const db = require("../../models");
const webPush = require('web-push');
const dayjs = require('dayjs');
const Exercise = db.exercise;
const Case = db.case;
const WorkUnit = db.workUnit;
const WorkUnitGroup = db.workUnitGroup;
const Group = db.groups;
const Grade = db.grade;
const Item = db.item;
const Student = db.student;
const UserAccount = db.userAccounts;
const ActivitySubscription = db.activitySubscription;
const Participation = db.participation;
const ItemPlayerRole = db.itemPlayerRole;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const newExercise = {
    assigned: req.body.assigned,
    CaseID: req.body.CaseID,
    finishDate: req.body.finishDate
  }

  if (!newExercise.assigned || !newExercise.CaseID) {
    return res.status(403).send({ message: "Please fill all fields" });
  }

  Exercise.create(newExercise).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.status(500).send({
      error: err.message || "Error creating a new exercise"
    });
  });
};

exports.createExerciseAndParticipations = async (req, res) => {
  const { Students, assigned, finishDate, CaseID, workUnitId, groupId } = req.body;

  if (!assigned || !finishDate || !CaseID || !Students || Students?.length === 0) {
    return res.status(400).send({ error: true, message: 'Please, add at least one participation and exerciseData' })
  }

  let transaction;
  try {
    transaction = await db.sequelize.transaction();

    const participations = [];
    const newFinishDate = new Date(finishDate);
    const splittedStudents = Students.split(',');

    const workUnitGroup = await WorkUnitGroup.findOne({
      where: {
        GroupId: groupId,
        WorkUnitId: workUnitId
      },
      raw: true,
      transaction
    });

    if (!workUnitGroup) {
      await transaction.rollback();
      return res.status(500).send({ error: true, message: 'The group is not associated with that workUnit' });
    }

    const newExercise = {
      assigned: assigned,
      CaseID: CaseID,
      finishDate: (newFinishDate instanceof Date && !isNaN(newFinishDate)) ? newFinishDate : null,
      WorkUnitGroupID: workUnitGroup.id
    }

    const createdExercise = await Exercise.create(newExercise, { transaction });

    splittedStudents.forEach(studentId => {
      participations.push({
        StudentID: studentId,
        ExerciseID: createdExercise.id
      })
    })

    const createdParticipations = await Participation.bulkCreate(participations, { transaction });

    const allSubscriptions = await ActivitySubscription.findAll({
      include: [
        {
          model: UserAccount,
          required: true,
          include: [
            {
              model: Student,
              required: true,
              include: {
                model: Participation,
                required: true,
                where: { ExerciseId: createdExercise.id }
              }
            }
          ]
        }
      ],
      transaction
    });

    allSubscriptions.forEach(s => {
      const subscriptionRecipient = {
        endpoint: s.endpoint,
        expirationTime: s.expirationTime,
        keys: JSON.parse(s.keys)
      }
      const title = `New exercise`;

      let description = (assigned == 'true')
        ? `Final date: ${dayjs(finishDate).format('DD/MM/YYYY')}`
        : 'Ungraded exercise';

      sendNotification(subscriptionRecipient, title, description);
    });

    await transaction.commit();

    return res.send(createdParticipations);

  } catch (error) {
    console.error('Transaction failed:', error);
    if (transaction) await transaction.rollback();
    return res.status(500).send({ error: true, message: 'Transaction failed' });
  }
}

exports.findAll = (req, res) => {
  Exercise.findAll().then(data => {
    res.json(data);
  }).catch(err => {
    res.status(500).send({
      error: err.message || "Some error occurred while retrieving exercises"
    });
  });
}

exports.findOne = (req, res) => {
  let id = req.params.id;
  Exercise.findByPk(id).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      error: err.message || "Some error occurred while retrieving one Exercise"
    })
  })
}

exports.findAllExercisesInAGroupByWorkUnit = async (req, res) => {
  const { groupId, workUnitId } = req.params;
  try {
    const result = await db.sequelize.query(`
      SELECT c.id, c.name, ex.finishDate, ex.assigned, ex.CaseID, ex.id as exerciseId
      FROM \`${WorkUnitGroup.tableName}\` AS wkug
      JOIN \`${Exercise.tableName}\` AS ex ON ex.WorkUnitGroupID = wkug.id
      JOIN \`${Case.tableName}\` AS c ON c.id = ex.CaseID
      WHERE wkug.GroupID = ${groupId} 
      AND wkug.WorkUnitID = ${workUnitId}
      GROUP BY c.id, c.WorkUnitId, c.name, ex.assigned, ex.finishDate, ex.CaseID, ex.id;
    `, { type: db.Sequelize.QueryTypes.SELECT });
    return res.send(result);
  } catch (err) {
    return res.status(500).send({
      error: err.message || "Some error occurred while retrieving the cases and their exercises."
    });
  }
}

exports.findAllExercisesAssignedToStudent = async (req, res) => {
  const { groupId, workUnitId } = req.params;
  try {
    const exercises = await Participation.findAll({
      raw: true,
      attributes: [
        [db.sequelize.col('exercise.id'), 'exerciseId'],
        [db.sequelize.col('exercise.assigned'), 'assigned'],
        [db.sequelize.col('exercise.finishDate'), 'finishDate'],
        [db.sequelize.col('exercise.case.id'), 'caseId'],
        [db.sequelize.col('exercise.case.WorkUnitId'), 'workUnitId'],
        [db.sequelize.col('exercise.case.name'), 'caseName'],
        [db.sequelize.col('participation.FinalGrade'), 'finalGrade'],
        [db.sequelize.col('participation.id'), 'participationId'],
      ],
      include: [
        {
          model: Exercise,
          attributes: [],
          required: true,
          include: [
            {
              model: Case,
              attributes: [],
              required: true,
              where: { WorkUnitId: workUnitId },
              include: [
                {
                  model: WorkUnit,
                  attributes: [],
                  required: true,
                  where: { id: workUnitId },
                  include: [
                    {
                      model: WorkUnitGroup,
                      required: true,
                      attributes: [],
                      where: { GroupID: groupId },
                      include: [
                        {
                          model: Group,
                          required: true,
                          attributes: [],
                          where: { id: groupId }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          model: Student,
          attributes: [],
          required: true,
          where: { id: req.user.id },
          include: [
            {
              model: UserAccount,
              attributes: [],
              required: true,
              where: { id: req.user.id }
            }
          ]
        },
      ],
    });

    const exercisesWithGradesPromises = exercises.map(async (exerciseParticipation) => {
      const grades = await Grade.findAll({
        raw: true,
        where: {
          ParticipationID: exerciseParticipation.participationId
        },
        attributes: [
          [db.sequelize.col('grade.id'), 'gradeId'],
          [db.sequelize.col('grade.correct'), 'gradeCorrect'],
          [db.sequelize.col('grade.grade'), 'gradeValue'],
          [db.sequelize.col('ItemPlayerRole.item.id'), 'itemId'],
          [db.sequelize.col('ItemPlayerRole.item.name'), 'itemName'],
          [db.sequelize.col('ItemPlayerRole.item.description'), 'itemDescription'],
        ],
        include: [
          {
            model: ItemPlayerRole,
            required: true,
            attributes: [],
            include: [
              {
                model: Item,
                attributes: [],
                required: true
              }
            ]
          }
        ]
      });
      exerciseParticipation.grades = grades;
      exerciseParticipation.assigned = exerciseParticipation.assigned ? 1 : 0;
      return exerciseParticipation;
    });

    const exercisesWithGrades = await Promise.all(exercisesWithGradesPromises);

    return res.send(exercisesWithGrades);
  } catch (err) {
    return res.status(500).send({
      error: err.message || "Some error occurred while retrieving the exercises of the student"
    });
  }
};


exports.getAllStudentsassignedToExerciseWithDetails = async (req, res) => {
  try {
    const { groupId, workUnitId, caseId, assigned, finishDate } = req.params;

    const result = await db.sequelize.query(`
      SELECT grd.id as gradeId, grd.grade as gradeValue, u.id as userId, u.username, u.name, i.id as itemId, i.name as itemName
      FROM \`${Group.tableName}\` AS g
      JOIN \`${WorkUnitGroup.tableName}\` AS wkug ON wkug.GroupID = g.id
      JOIN \`${WorkUnit.tableName}\` AS wku ON wku.id = wkug.WorkUnitID
      JOIN \`${Case.tableName}\` AS c ON c.WorkUnitId = wku.id
      JOIN \`${Exercise.tableName}\` AS ex ON ex.CaseID = c.id
      JOIN \`${Participation.tableName}\` AS p ON p.ExerciseId = ex.id
      JOIN \`${Student.tableName}\` AS stud p ON p.StudentID = stud.id
      JOIN  \`${UserAccount.tableName}\` AS u ON u.id = stud.id
      JOIN \`${Grade.tableName}\` AS grd ON grd.ParticipationID = p.id
      JOIN \`${Item.tableName}\` AS i ON i.id = grd.ItemID
      WHERE g.id = ${groupId}
      AND wku.id = ${workUnitId}
      AND ex.assigned = ${assigned}
      AND ex.CaseID = ${caseId}
      AND (date(ex.finishDate) like '${finishDate}' OR ex.finishDate IS NULL)
    `, { type: db.Sequelize.QueryTypes.SELECT });

    const formattedResult = {};

    result.forEach(item => {
      if (!formattedResult[item.userId]) {
        formattedResult[item.userId] = {
          userId: item.userId,
          username: item.username,
          name: item.name,
          items: []
        };
      }

      formattedResult[item.userId].items.push({
        itemId: item.itemId,
        itemName: item.itemName,
        gradeValue: item.gradeValue
      });
    });

    return res.send(Object.values(formattedResult));

  } catch (err) {
    console.log(err.message)

    return res.status(500).send({
      error: err.message || "Some error occurred while retreaving  the exercises"
    });
  }
}

exports.update = (req, res) => {
  const updatedExercise = {
    id: req.params.id,
    assigned: req.body.assigned,
    CaseID: req.body.CaseID,
    UserID: req.body.UserID
  }

  if (!updatedExercise.assigned || !updatedExercise.CaseID || !updatedExercise.UserID) {
    return res.status(400).send({
      message: "Exercise data cannot be empty!"
    })
  }

  Exercise.update(
    updatedExercise, {
    where: { id: updatedExercise.id }
  }).then(() => res.send('Update successful'))
    .catch(err => {
      res.status(500).send({
        error: err.message || "Some error occurred while updating Exercises"
      })
    })
}

const formatDate = (finishDate) => {
  const date = new Date(finishDate);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

exports.getAllStudentsAssignedToExercise = async (req, res) => {
  try {
    const { groupId, workUnitId, caseId, assigned, finishDate } = req.params;
    let formattedDate = null;
    if (finishDate) {
      formattedDate = formatDate(finishDate);
    }

    const result = await db.sequelize.query(`
      SELECT ex.id, u.*
      FROM \`${Group.tableName}\` AS g
      JOIN \`${WorkUnitGroup.tableName}\` AS wkug ON wkug.GroupID = g.id 
      JOIN \`${WorkUnit.tableName}\` AS wku ON wku.id = wkug.WorkUnitID
      JOIN \`${Case.tableName}\` AS c ON c.WorkUnitId = wku.id
      JOIN \`${Exercise.tableName}\` AS ex ON ex.CaseID = c.id
      JOIN \`${Participation.tableName}\` AS p ON ex.id = p.ExerciseID 
      JOIN \`${Student.tableName}\` AS stud ON p.StudentID = stud.id
      JOIN \`${UserAccount.tableName}\` AS u ON stud.id = u.id
      WHERE g.id = ${groupId} 
      AND wku.id = ${workUnitId} 
      AND ex.assigned = ${assigned}
      AND ex.CaseID = ${caseId}
      AND (ex.finishDate like '${formattedDate}' OR ex.finishDate IS NULL)
      ORDER BY u.id asc
    `, { type: db.Sequelize.QueryTypes.SELECT });

    return res.send(result);

  } catch (err) {
    console.log(err.message)

    return res.status(500).send({
      error: err.message || "Some error occurred while retreaving  the exercises"
    });
  }
}

exports.update = async (req, res) => {
  try {
    const { GroupID, WorkUnitID, prevCaseID, CaseID, Students, prevAssigned, assigned, prevDate, finishDate } = req.body;
    const idsToDelete = [];
    let formattedPrevDate = null;
    let formattedFinishDate = null;
    if (finishDate) {
      formattedFinishDate = formatDate(finishDate);
    }

    if (prevDate) {
      formattedPrevDate = formatDate(prevDate);
    }

    const result = await db.sequelize.query(`
    SELECT ex.id
    FROM \`${Group.tableName}\` AS g
    JOIN \`${WorkUnitGroup.tableName}\` AS wkug ON wkug.GroupID = g.id 
    JOIN \`${WorkUnit.tableName}\` AS wku ON wku.id = wkug.WorkUnitID
    JOIN \`${Case.tableName}\` AS c ON c.WorkUnitId = wku.id
    JOIN \`${Exercise.tableName}\` AS ex ON ex.CaseID = c.id
    WHERE g.id = ${GroupID} 
    and wku.id = ${WorkUnitID} 
    and ex.assigned = ${prevAssigned}
    and ex.CaseID = ${prevCaseID}
    and (ex.finishDate like '${formattedPrevDate}' OR ex.finishDate IS NULL)
  `, { type: db.Sequelize.QueryTypes.SELECT });


    console.log(result)

    result.forEach(exercise => {
      idsToDelete.push(exercise.id);
    });

    Exercise.destroy({ where: { id: idsToDelete } }).then(() => {

      const creationExercises = [];
      const splittedStudents = Students.split(',');

      if (assigned === 'true') {
        splittedStudents.forEach(studentId => {
          creationExercises.push({
            assigned: assigned,
            CaseID: CaseID,
            UserID: studentId,
            finishDate: finishDate
          })
        });
      } else {
        splittedStudents.forEach(studentId => {
          creationExercises.push({
            assigned: assigned,
            CaseID: CaseID,
            UserID: studentId,
            finishDate: null
          })
        });
      }

      Exercise.bulkCreate(creationExercises).then(data => {
        return res.send(data)
      })
    }).catch(err => {
      return res.status(500).send({ error: err });
    });

  } catch (err) {
    return res.status(500).send({
      error: err.message || "Some error occurred while deleting the exercises"
    });
  }
}


exports.delete = async (req, res) => {
  try {
    const { exerciseId } = req.params;

    Exercise.destroy({ where: { id: exerciseId } }).then(() => {
      return res.send("Deletion Successful");
    }).catch(err => {
      return res.status(500).send({ error: err });
    });

  } catch (err) {
    return res.status(500).send({
      error: err.message || "Some error occurred while deleting the exercises"
    });
  }
}

const sendNotification = async (subscriptionRecipient, title, description) => {
  const options = {
    vapidDetails: {
      subject: 'mailto:myemail@example.com',
      publicKey: process.env.PUBLIC_KEY,
      privateKey: process.env.PRIVATE_KEY
    }
  };

  try {
    await webPush.sendNotification(
      subscriptionRecipient,
      JSON.stringify({
        title,
        description,
        image: 'http://localhost:12080/images/logo144.png'
      }),
      options
    );
  } catch (err) {
    throw (err);
  }
}
const db = require("../../models");
const { getTranslationIncludeProps } = require("../../utils/translationProps");
const Grade = db.grade;
const Student = db.student;
const Participation = db.participation;
const Exercise = db.exercise;
const Case = db.case;
const WorkUnit = db.workUnit;
const WorkUnitGroup = db.workUnitGroup;
const ItemPlayerRole = db.itemPlayerRole;
const Item = db.item;
const StudentGroup = db.studentGroup;
const Group = db.groups;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const newGrade = {
    value: req.body.value,
    ItemID: req.body.ItemID,
    ExerciseID: req.body.ExerciseID
  }

  if (!newGrade.value || !newGrade.ItemID || !newGrade.ExerciseID) {
    return res.status(400).send({
      error: "Content can not be empty!"
    });
  }

  Grade.create(newGrade).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.status(500).send({
      error: err
    });
  });
};

exports.findAll = (req, res) => {
  Grade.findAll().then(data => {
    res.json(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving grades"
    });
  });
}

exports.findAllGradesOfTheUser = async (req, res) => {
  const { studentId } = req.params;
  const allGradesOfTheUser = await Participation.findAll({
    where: {
      StudentID: studentId,
    },
    attributes: {
      exclude: ['updatedAt'],
      include: [
        [db.sequelize.col('Exercise.assigned'), 'exerciseAssigned'],
        [db.sequelize.col('Exercise.finishDate'), 'exerciseFinishDate'],
        [db.sequelize.col('Exercise.Case.id'), 'caseId'],
        [db.sequelize.col('Exercise.Case.caseNumber'), 'caseNumber'],
        [db.sequelize.col('Exercise.Case.name'), 'caseName'],
        [db.sequelize.col('Student.name'), 'studentName'],
        [db.sequelize.col('Exercise.Case.WorkUnit.id'), 'workUnitId'],
        [db.sequelize.col('Exercise.Case.WorkUnit.name'), 'workUnitName'],
      ]
    },
    include: [
      {
        model: Student,
        attributes: []
      },
      {
        model: Exercise,
        attributes: [],
        include: [
          {
            model: Case,
            attributes: [],
            required: true,
            include: [
              {
                model: WorkUnit,
                attributes: []
              }
            ]
          },
        ]
      },
      {
        model: Grade,
        as: 'grades',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'ParticipationID']
        },
      },
    ],
  });

  return res.send(allGradesOfTheUser);
}

exports.findAllGradesOfTheUserWithFilters = async (req, res) => {
  const { studentId, workUnitId, groupId } = req.query;

  if (!studentId || !groupId) {
    return res.status(400).send({
      error: "Missing parameters: studentId and groupId are required"
    });
  }

  const whereCondition = {
    StudentId: studentId
  }

  if (workUnitId) {
    whereCondition['$Exercise.Case.WorkUnit.id$'] = workUnitId;
  }

  whereCondition['$Exercise.WorkUnitGroup.GroupID$'] = groupId;

  const gradesOfTheUser = await Participation.findAll({
    where: whereCondition,
    attributes: {
      exclude: ['updatedAt'],
      include: [
        [db.sequelize.col('Exercise.assigned'), 'exerciseAssigned'],
        [db.sequelize.col('Exercise.finishDate'), 'exerciseFinishDate'],
        [db.sequelize.col('Exercise.Case.id'), 'caseId'],
        [db.sequelize.col('Exercise.Case.caseNumber'), 'caseNumber'],
        [db.sequelize.col('Exercise.Case.name'), 'caseName'],
        [db.sequelize.col('Student.name'), 'studentName'],
        [db.sequelize.col('Exercise.Case.WorkUnit.id'), 'workUnitId'],
        [db.sequelize.col('Exercise.Case.WorkUnit.name'), 'workUnitName'],
        [db.sequelize.col('Exercise.workUnitGroup.id'), 'workUnitGroupId'],
        [db.sequelize.col('Exercise.workUnitGroup.GroupID'), 'groupId'],
      ]
    },
    include: [
      {
        model: Student,
        attributes: []
      },
      {
        model: Exercise,
        attributes: [],
        include: [
          {
            model: Case,
            attributes: [],
            required: true,
            include: [
              {
                model: WorkUnit,
                attributes: [],
              }
            ]
          },
          {
            model: WorkUnitGroup,
          }
        ]
      },
      {
        model: Grade,
        as: 'grades',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'ParticipationID']
        },
      },
    ],
  });

  return res.send(gradesOfTheUser);
}

exports.findActivityGradesOfTheUser = async (req, res) => {
  const { studentId, exerciseId } = req.query;

  if (!studentId || !groupId) {
    return res.status(400).send({
      error: "Missing parameters: studentId and exerciseId are required"
    });
  }

  const gradesOfTheUser = await Participation.findAll({
    where: {
      StudentId: studentId
    },
    attributes: {
      exclude: ['updatedAt'],
      include: [
        [db.sequelize.col('Participation.id'), 'participationId'],
        [db.sequelize.col('Participation.finalGrade'), 'finalGrade'],
      ]
    },
    include: [
      {
        model: Exercise,
        attributes: [],
        where: {
          id: exerciseId
        }
      },
      {
        model: Grade,
        as: 'grades',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'ParticipationID']
        },
      },
    ],
  });

  return res.send(gradesOfTheUser);
}

exports.findAllGradesOfTheGroupByUser = async (req, res) => {
  // TODO
}

exports.findAllGradesOfTheGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { language } = req.body;

    const itemTranslationProps = getTranslationIncludeProps('item', language, true);
    const caseTranslationProps = getTranslationIncludeProps('case', language, true);

    if (!groupId) {
      return res.status(400).send({
        error: "Missing parameter: groupId"
      });
    }

    const studentIdsInGroup = await StudentGroup.findAll({
      where: { GroupID: groupId },
      attributes: ['StudentId']
    });

    const studentsWithParticipations = await Student.findAll({
      raw: true,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'age'],
        include: [
          [db.sequelize.col('Student.id'), 'studentId'],
          [db.sequelize.col('Student.name'), 'studentName'],
          [db.sequelize.col('participations.id'), 'participationId'],
          [db.sequelize.col('participations.FinalGrade'), 'finalGrade'],
          [db.sequelize.col('participations.exercise.case.id'), 'caseId'],
          [db.sequelize.col('participations.exercise.case.caseNumber'), 'caseNumber'],
          [db.sequelize.col('participations.exercise.case.caseTranslations.name'), 'caseName'],
          [db.sequelize.col('participations.SubmittedAt'), 'submittedAt'],
          [db.sequelize.col('participations.exercise.case.workUnit.id'), 'workUnitId'],
          [db.sequelize.col('participations.exercise.case.workUnit.name'), 'workUnitName'],
        ]
      },
      where: { id: studentIdsInGroup.map(student => student.dataValues.StudentId) },
      include: [
        {
          model: Participation,
          include: [
            {
              model: Grade,
              attributes: { exclude: ['createdAt', 'updatedAt', 'ParticipationID'] },
              include: [
                {
                  model: ItemPlayerRole,
                  include: [
                    {
                      model: Item,
                      include: [itemTranslationProps]
                    }
                  ]
                }
              ]
            },
            {
              model: Exercise,
              include: [
                {
                  model: Case,
                  include: [
                    {
                      model: WorkUnit,
                      attributes: []
                    },
                    { ...caseTranslationProps }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });


    const studentsWithGrades = {};

    for (const row of studentsWithParticipations) {
      const { studentId, studentName, caseId, caseName, caseNumber, participationId, workUnitId, workUnitName, finalGrade, submittedAt } = row;

      if (participationId) {
        if (!studentsWithGrades[participationId]) {
          studentsWithGrades[participationId] = {
            studentId: studentId,
            studentName: studentName,
            finalGrade: finalGrade,
            caseId: caseId,
            caseName: caseName,
            caseNumber: caseNumber,
            participationId: participationId,
            workUnitId: workUnitId,
            workUnitName: workUnitName,
            grades: [],
            submittedAt: submittedAt
          };
        }

        if (row['participations.grades.id']) {
          const groupedGrades = {
            gradeId: row['participations.grades.id'],
            gradeCorrect: row['participations.grades.correct'],
            gradeValue: row['participations.grades.grade'],
            itemId: row['participations.grades.ItemPlayerRole.item.id'],
            itemName: row['participations.grades.ItemPlayerRole.item.itemTranslations.name']
          };

          if (!groupedGrades.itemId) {
            const itemId = row['participations.grades.ItemID'];

            try {
              const handWashItem = await Item.findOne({
                raw: true,
                where: { itemNumber: itemId + 1, WorkUnitID: workUnitId },
                include: [itemTranslationProps]
              });

              groupedGrades.itemName = handWashItem['itemTranslations.name'];
            } catch (error) {
              console.error('Error fetching hand wash item:', error);
            }
          }
          studentsWithGrades[participationId].grades.push(groupedGrades);
        }
      }
    }

    const result = Object.values(studentsWithGrades);

    return res.send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: "Internal Server Error"
    });
  }
};

exports.findAllGradesInGroupForExcel = async (req, res) => {
  try {
    const { groupId } = req.params;

    const result = await db.sequelize.query(`
      SELECT 
        wku.name as 'UT',
        c.caseNumber as 'Case',
        ROUND(p.FinalGrade, 2) as 'Final grade',
        DATE(p.SubmittedAt) as 'Submit Date', 
        TIME(p.SubmittedAt) as 'Submit Time',
        st.name as 'Student'
      FROM \`${WorkUnit.tableName}\` as wku
      JOIN \`${Case.tableName}\` as c on c.WorkUnitID = wku.id
      JOIN \`${Exercise.tableName}\` as ex on ex.CaseID = c.id
      JOIN \`${Participation.tableName}\` as p on p.ExerciseID = ex.id
      JOIN \`${Student.tableName}\` as st on st.id = p.StudentID
      JOIN \`${StudentGroup.tableName}\` as stg on stg.StudentID = st.id
      JOIN \`${Group.tableName}\` as g on g.id = stg.GroupID
      AND g.id = ${groupId}
    `, { type: db.Sequelize.QueryTypes.SELECT });

    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: "Internal Server Error",
      message: error.message
    });
  }
}

exports.findGradesByStudentInExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { language } = req.body;

    const itemTranslationProps = getTranslationIncludeProps('item', language, true);

    if (!exerciseId) {
      return res.status(400).send({
        message: "Missing parameter: exerciseId"
      });
    }

    const gradesInExerciseGroupByStudent = await Student.findAll({
      raw: true,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'age'],
        include: [
          [db.sequelize.col('Student.id'), 'studentId'],
          [db.sequelize.col('Student.name'), 'studentName'],
          [db.sequelize.col('participations.id'), 'participationId'],
          [db.sequelize.col('participations.FinalGrade'), 'finalGrade'],
          [db.sequelize.col('participations.exercise.case.id'), 'caseId'],
          [db.sequelize.col('participations.SubmittedAt'), 'submittedAt']
        ]
      },
      include: [
        {
          model: Participation,
          attributes: [],
          where: { ExerciseID: exerciseId },
          required: true,
          include: [
            {
              model: Exercise,
              attributes: [],
              include: [
                {
                  model: Case,
                  attributes: [],
                  required: true,
                  include: [
                    {
                      model: WorkUnit,
                      attributes: []
                    }
                  ]
                },
              ]
            },
            {
              raw: true,
              model: Grade,
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'ParticipationID'],
              },
              include: [
                {
                  model: ItemPlayerRole,
                  include: [
                    {
                      model: Item,
                      include: [itemTranslationProps]
                    }
                  ]
                }
              ]
            },
          ]
        },
      ]
    });

    const studentsWithGrades = {};

    for (const row of gradesInExerciseGroupByStudent) {
      const { studentId, studentName, caseId, participationId, finalGrade, submittedAt } = row;

      if (!studentsWithGrades[participationId]) {
        studentsWithGrades[participationId] = {
          studentId: studentId,
          studentName: studentName,
          finalGrade: finalGrade,
          caseId: caseId,
          participationId: participationId,
          grades: [],
          submittedAt: submittedAt
        };
      }

      if (row['participations.grades.id']) {
        const groupedGrades = {
          gradeId: row['participations.grades.id'],
          gradeCorrect: row['participations.grades.correct'],
          gradeValue: row['participations.grades.grade'],
          itemId: row['participations.grades.ItemPlayerRole.item.id'],
          itemName: row['participations.grades.ItemPlayerRole.item.itemTranslations.name']
        };

        if (!groupedGrades.itemId) {
          const itemId = row['participations.grades.ItemID'];

          try {
            const handWashItem = await Item.findOne({
              raw: true,
              where: {
                id: itemId
              },
              include: [itemTranslationProps]
            });

            groupedGrades.itemName = handWashItem['itemTranslations.name'];
          } catch (error) {
            console.error('Error fetching hand wash item:', error);
          }
        }

        const existingGrade = studentsWithGrades[participationId].grades.find(grade => grade.gradeId === groupedGrades.gradeId);

        if (!existingGrade) {
          studentsWithGrades[participationId].grades.push(groupedGrades);
        } else {
          console.log(`Grade with gradeId ${groupedGrades.gradeId} already exists.`);
        }
      }
    }

    const result = Object.values(studentsWithGrades);

    return res.send(result);
  } catch (error) {
    console.error("Error al buscar calificaciones por estudiante en el ejercicio:", error);
    return res.status(500).send({ message: "Error interno del servidor" });
  }
}


exports.findOne = (req, res) => {
  let id = req.params.id;
  Grade.findByPk(id).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      error: err.message || "Some error occurred while retrieving one grade"
    })
  })
}

exports.update = (req, res) => {
  const updatedGrade = {
    id: req.params.id,
    value: req.body.value,
    ItemID: req.body.ItemID,
    ParticipationID: req.body.ParticipationID
  }

  if (!updatedGrade.value || !updatedGrade.ItemID || !updatedGrade.ExerciseID) {
    return res.status(400).send({
      error: "Content can not be empty!"
    });
  }

  Grade.update(updatedGrade, { where: { id: updatedGrade.id } }).then(() => {
    res.send('Update successful')
  }).catch(err => {
    res.status(500).send({
      error: err.message || "Error updating a grade"
    })
  })
}

exports.delete = (req, res) => {
  let id = req.params.id;
  Grade.destroy({ where: { id: id } })
    .then(() => res.send("Deletion Successful"))
    .catch(err => {
      res.status(500).send({ error: err })
    })
}


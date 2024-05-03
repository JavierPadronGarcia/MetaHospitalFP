const db = require("../../models");
const Grade = db.grade;
const Student = db.student;
const Participation = db.participation;
const Exercise = db.exercise;
const Case = db.case;
const WorkUnit = db.workUnit;
const WorkUnitGroup = db.workUnitGroup;
const ItemPlayerRole = db.itemPlayerRole;
const Item = db.item;
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

exports.findGradesByStudentInExercise = async (req, res) => {
  const { exerciseId } = req.params;

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
        [db.sequelize.col('Participations.id'), 'participationId'],
        [db.sequelize.col('Participations.FinalGrade'), 'finalGrade'],
        [db.sequelize.col('Participations.Exercise.Case.id'), 'caseId'],
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
                required: true,
                model: ItemPlayerRole,
                include: [
                  {
                    model: Item,
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

  gradesInExerciseGroupByStudent.forEach(row => {
    const { studentId, studentName, caseId, participationId, finalGrade } = row;

    if (!studentsWithGrades[studentId]) {
      studentsWithGrades[studentId] = {
        studentId: studentId,
        studentName: studentName,
        finalGrade: finalGrade,
        caseId: caseId,
        participationId: participationId,
        grades: []
      };
    }

    if (row['participations.grades.id']) {
      const groupedGrades = {
        gradeId: row['participations.grades.id'],
        gradeCorrect: row['participations.grades.correct'],
        gradeValue: row['participations.grades.grade'],
        itemId: row['participations.grades.ItemPlayerRole.item.id'],
        itemName: row['participations.grades.ItemPlayerRole.item.name']
      }

      studentsWithGrades[studentId].grades.push(groupedGrades);
    }
  });

  const result = Object.values(studentsWithGrades);

  return res.send(result);
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


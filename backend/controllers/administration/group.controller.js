const db = require("../../models");
const dayjs = require('dayjs');
const Group = db.groups;
const User = db.userAccounts;
const School = db.school;
const Student = db.student;
const WorkUnit = db.workUnit;
const StudentGroup = db.studentGroup;
const TeacherGroup = db.teacherGroup;
const WorkUnitGroup = db.workUnitGroup;
const Case = db.case;
const Exercise = db.exercise;
const Op = db.Sequelize.Op;

exports.createGroup = async (req, res) => {
  const name = req.body.name;
  const date = req.body.date;
  const CourseId = req.body.CourseId;
  const schoolId = req.body.schoolId;

  const workUnitGroupCreation = [];
  const exercisesArray = [];
  let workUnit;

  const transaction = await db.sequelize.transaction();
  try {

    if (!name || !CourseId || !schoolId) {
      return res.status(400).send({
        error: "You must provide a name"
      });
    }

    const newGroup = { name: name, date: date, CourseID: CourseId, SchoolID: schoolId };

    const group = await Group.create(newGroup, { transaction });

    const allWorkUnits = await WorkUnit.findAll({ transaction });

    allWorkUnits.forEach(workUnit => {
      workUnitGroupCreation.push({
        GroupID: group.id,
        WorkUnitID: workUnit.id,
        visibility: false
      });
    });

    const workUnitGroups = await WorkUnitGroup.bulkCreate(workUnitGroupCreation, { transaction });
    const parsedWorkUnitGroups = workUnitGroups.map((workUnitGroup) => workUnitGroup.get({ plain: true }));

    for (const workUnitGroup of parsedWorkUnitGroups) {

      if (!workUnit || workUnitGroup.WorkUnitID !== workUnit)
        workUnit = workUnitGroup.WorkUnitID;

      const casesInWorkUnit = await Case.findAll({
        where: {
          WorkUnitID: workUnit,
        },
        raw: true,
        transaction
      });

      casesInWorkUnit.forEach((caseItem) => {
        exercisesArray.push({
          finishDate: null,
          CaseID: caseItem.id,
          WorkUnitGroupID: workUnitGroup.id
        });
      });

    }

    await Exercise.bulkCreate(exercisesArray, { transaction });

    await transaction.commit();

    return res.send(group);

  } catch (err) {
    if (transaction) await transaction.rollback();
    return res.status(500).send({
      error: err
    });
  }
};

exports.findAllWithCounts = async (req, res) => {
  let studentCount = [];
  let teacherCount = [];
  try {
    studentCount = await db.sequelize.query(`
      SELECT gr.id, gr.name, COALESCE(COUNT(gre.GroupID), 0) AS StudentCount
      FROM \`${Group.tableName}\` AS gr
      LEFT JOIN \`${StudentGroup.tableName}\` AS gre ON gr.id = gre.GroupID
      GROUP BY gr.id, gr.name
    `, { type: db.Sequelize.QueryTypes.SELECT });
  } catch (err) {
    return res.status(500).send({
      error: err
    })
  }
  try {
    teacherCount = await db.sequelize.query(`
      SELECT gr.id, gr.name, COALESCE(COUNT(the.GroupID), 0) AS TeacherCount
      FROM \`${Group.tableName}\` AS gr
      LEFT JOIN \`${TeacherGroup.tableName}\` AS the ON gr.id = the.GroupID
      GROUP BY gr.id, gr.name
    `, { type: db.Sequelize.QueryTypes.SELECT });
  } catch (err) {
    return res.status(500).send({
      error: err
    })
  }
  const mergedArray = await mergeArrays(teacherCount, studentCount);
  return res.send(mergedArray);
};

const mergeArrays = (arr1, arr2) => {
  return arr1.map(item1 => {
    const matchingItem = arr2.find(item2 => item1.id === item2.id && item1.name === item2.name);
    return {
      ...item1,
      StudentCount: matchingItem ? matchingItem.StudentCount : 0
    };
  });
}

exports.findAll = (req, res) => {
  Group.findAll().then(data => {
    res.json(data);
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving groups"
    });
  });
}

exports.findOne = (req, res) => {
  let id = req.params.id;
  Group.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        error: err
      })
    })
}

exports.findAllInSchool = (req, res) => {
  const schoolId = req.params.schoolId;

  Group.findAll({
    where: {
      SchoolID: schoolId
    }
  }).then(allGroups => {
    res.send(allGroups);
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving groups"
    });
  });
}

exports.findUserGroup = (req, res) => {
  const userId = req.user.id;

  const month = dayjs().month();
  const year = dayjs().year();
  let yearRange = '';

  if (month >= 9) {
    yearRange = `${year}-${year + 1}`;
  } else {
    yearRange = `${year - 1}-${year}`;
  }

  Student.findOne({
    where: { id: userId },
    include: {
      model: StudentGroup,
      required: true,
      include: {
        model: Group,
        where: {
          date: yearRange
        }
      }
    }
  }).then(userWithGroup => {
    if (!userWithGroup) {
      return res.status(500).send({
        error: true,
        message: 'User do not have a group in this range'
      });
    }
    return res.send(userWithGroup.StudentGroups[0].group);
  });
}

exports.update = (req, res) => {
  let id = req.params.id;
  Group.update(req.body, { where: { id: id } })
    .then(() => res.send('Update successful'))
    .catch(err => {
      res.status(500).send({
        error: err
      })
    })
}

exports.delete = (req, res) => {
  let id = req.params.id;
  Group.destroy({ where: { id: id } })
    .then(() => res.send("Deletion Successful"))
    .catch(err => {
      res.status(500).send({ error: err })
    })
}
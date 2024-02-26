const db = require("../../models");
const User = db.userAccounts;
const Role = db.role;
const UserRole = db.userRole;
const Teacher = db.teacher;
const TeacherGroup = db.teacherGroup;
const UserAccount = db.userAccounts;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const { userId, name, age, isDirector } = req.body;

  if (!userId || !name) {
    return res.status(400).send({
      error: true,
      message: 'Content cannot be empty'
    })
  }

  const newTeacher = {
    id: userId,
    name: name,
    age: age || null,
    isDirector: isDirector || false
  }

  Teacher.create(newTeacher).then(teacher => {
    return res.send(teacher);
  }).catch(err => {
    return res.status(500).send({
      error: true,
      message: 'error creating a new teacher, details: ' + err
    })
  })
}

exports.findAll = (req, res) => {

  Teacher.findAll({
    include: [
      { model: TeacherGroup },
      { model: UserAccount }
    ]
  }).then(allTeachers => {
    const teachers = [];

    allTeachers.map((teacher) => {
      teachers.push({
        id: teacher.id,
        name: teacher.name,
        username: teacher.UserAccount.username
      });
    });

    return res.send(teachers);
  }).catch(err => {
    return res.status(500).send({
      error: true,
      message: 'error retrieving all teachers, details: ' + err
    })
  })
}

exports.findAllDirectors = (req, res) => {
  Teacher.findAll({ where: { isDirector: true } }).then(allDirectors => {
    return res.send(allDirectors);
  }).catch(err => {
    return res.status(500).send({
      error: true,
      message: 'error retrieving all directors, details ' + err
    })
  })
}

exports.assignDirector = (req, res) => {
  const id = req.params.id;

  Teacher.findByPk(id).then(teacher => {
    teacher.isDirector = true;
    teacher.save();
    return res.send(teacher);
  }).catch(err => {
    return res.status(500).send({
      error: true,
      message: 'error assigning teacher as director, details: ' + err
    })
  })
}

exports.unAssignDirector = (req, res) => {
  const id = req.params.id;

  Teacher.findByPk(id).then(teacher => {
    teacher.isDirector = false;
    teacher.save();
    return res.send(teacher);
  }).catch(err => {
    return res.status(500).send({
      error: true,
      message: 'error unassigning teacher as director, details: ' + err
    })
  })
}
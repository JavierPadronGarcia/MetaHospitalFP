const db = require("../../models");
const User = db.userAccounts;
const Role = db.role;
const UserRole = db.userRole;
const Student = db.student;
const Op = db.Sequelize.Op;


exports.create = (req, res) => {
  const { userId, name, age } = req.body;

  if (!userId || !name || !age) {
    return res.status(400).send({
      error: true,
      message: 'Content cannot be empty'
    })
  }

  const newStudent = {
    id: userId,
    name: name,
    age: age
  }

  Student.create(newStudent).then(student => {
    return res.send(student);
  }).catch(err => {
    return res.status(500).send({
      error: true,
      message: 'error creating a new student'
    })
  })
}

exports.findAll = (req, res) => {
  Student.findAll().then(allStudents => {
    return res.send(allStudents);
  }).catch(err => {
    return res.status(500).send({
      error: true,
      message: 'error retrieving all students'
    })
  })
}
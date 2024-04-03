const db = require("../../models");
const UserAccount = db.userAccounts;
const StudentGroup = db.studentGroup;
const Role = db.role;
const UserRole = db.userRole;
const Student = db.student;
const Op = db.Sequelize.Op;
const StudentToSchool = require("../administration/studentschool.controller");

exports.create = (req, res) => {
  const { userId, name, age, schoolId } = req.body;

  if (!userId || !name) {
    return res.status(400).send({
      error: true,
      message: 'Content cannot be empty'
    })
  }

  const newStudent = {
    id: userId,
    name: name,
    age: age || null,
  }

  Student.create(newStudent).then(student => {
    StudentToSchool.AssignStudentToSchool(schoolId, userId);
    return res.send(student);
  }).catch(err => {
    return res.status(500).send({
      error: true,
      message: 'error creating a new student'
    })
  })

}

exports.findAll = (req, res) => {
  Student.findAll({
    include: [
      { model: UserAccount },
      { model: StudentGroup }
    ]
  }).then(allStudents => {
    const students = [];

    allStudents.map((student) => {
      students.push({
        id: student.id,
        name: student.name,
        username: student.UserAccount.username
      })
    })

    return res.send(students);
  }).catch(err => {
    return res.status(500).send({
      error: true,
      message: 'error retrieving all students'
    })
  })
}
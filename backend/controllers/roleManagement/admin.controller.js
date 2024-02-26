const db = require("../../models");
const Admin = db.admin;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const { userId, name, age, schoolId } = req.body;

  if (!name || !userId) {
    return res.status(400).send({
      error: true,
      message: 'Content cannot be empty'
    });
  }

  const newAdmin = {
    id: userId,
    name: name,
    age: age || null,
    SchoolID: schoolId || null
  }

  Admin.create(newAdmin).then(data => {
    return res.send('Admin created successfully');
  }).catch(err => {
    return res.status(500).send({
      error: true,
      message: 'Error creating a new admin'
    })
  });
}

exports.getAll = (req, res) => {
  Admin.findAll().then(data => {
    return res.send(data);
  })
}
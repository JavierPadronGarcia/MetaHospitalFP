module.exports = app => {
  const Student = require("../../controllers/roleManagement/student.controller.js")
  const auth = require('../../controllers/roleManagement/auth');

  var router = require("express").Router();

  router.get("/", auth.isAuthenticated, Student.findAll);

  router.post("/", auth.isAuthenticated, Student.create);


  app.use('/api/students', router);
}
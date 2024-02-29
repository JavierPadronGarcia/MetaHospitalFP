module.exports = app => {
  const Teacher = require("../../controllers/roleManagement/teacher.controller.js")
  const auth = require('../../controllers/roleManagement/auth.js');

  var router = require("express").Router();

  router.get("/", auth.isAuthenticated, Teacher.findAll);

  router.post("/", auth.isAuthenticated, Teacher.create);

  router.get("/directors", auth.isAuthenticated, Teacher.findAllDirectors);

  // Assign a teacher to be Director
  router.put("/assignDirector/:id", auth.isAuthenticated, Teacher.assignDirector);

  // Un assign a director
  router.put("/unAssignDirector/:id", auth.isAuthenticated, Teacher.unAssignDirector);

  router.put('/resetStudentPassword/:id', auth.isAuthenticated, Teacher.resetPasswordForAUser);

  app.use('/api/teachers', router);
}
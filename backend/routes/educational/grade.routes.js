module.exports = app => {
  const grades = require("../../controllers/educational/grade.controller");
  const auth = require('../../controllers/roleManagement/auth');

  var router = require("express").Router();

  //create a new grade
  router.post("/", auth.isAuthenticated, grades.create);

  //retrieve all grades
  router.get("/", auth.isAuthenticated, grades.findAll);

  router.get('/userGrades/:studentId', auth.isAuthenticated, grades.findAllGradesOfTheUser);

  router.get('/groupUserGradesByWorkUnit', auth.isAuthenticated, grades.findAllGradesOfTheUserWithFilters);

  //retrieve a single grade by id
  router.get("/:id", auth.isAuthenticated, grades.findOne);

  //update a grade with given id
  router.put("/:id", auth.isAuthenticated, grades.update);

  //delete a grade with given id
  router.delete("/:id", auth.isAuthenticated, grades.delete);

  app.use('/api/grades', router);
};
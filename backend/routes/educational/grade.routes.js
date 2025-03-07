module.exports = app => {
  const grades = require("../../controllers/educational/grade.controller");
  const auth = require('../../controllers/roleManagement/auth');
  const { getRequestedTranslation } = require('../../middlewares/translations');

  var router = require("express").Router();

  //create a new grade
  router.post("/", auth.isAuthenticated, grades.create);

  //retrieve all grades
  router.get("/", auth.isAuthenticated, grades.findAll);

  router.get('/userGrades/:studentId', auth.isAuthenticated, grades.findAllGradesOfTheUser);

  router.get('/groupUserGradesByWorkUnit', auth.isAuthenticated, grades.findAllGradesOfTheUserWithFilters);

  router.get('/findGradesInExerciseAndUser', auth.isAuthenticated, grades.findActivityGradesOfTheUser);

  router.get('/findGradesByStudentInExercise/:exerciseId', auth.isAuthenticated, getRequestedTranslation, grades.findGradesByStudentInExercise);

  router.get('/findAllGradesOfTheGroup/:groupId', auth.isAuthenticated, getRequestedTranslation, grades.findAllGradesOfTheGroup);

  router.get('/findAllGradesInGroupForExcel/:groupId', auth.isAuthenticated, grades.findAllGradesInGroupForExcel);

  router.get('/findAllGradesFiltered', auth.isAuthenticated, getRequestedTranslation, grades.findAllGradesFiltered);

  //retrieve a single grade by id
  router.get("/:id", auth.isAuthenticated, grades.findOne);

  //update a grade with given id
  router.put("/:id", auth.isAuthenticated, grades.update);

  //delete a grade with given id
  router.delete("/:id", auth.isAuthenticated, grades.delete);

  app.use('/api/grades', router);
};
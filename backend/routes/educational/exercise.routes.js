module.exports = app => {
  const exercises = require("../../controllers/educational/exercise.controller");
  const auth = require('../../controllers/roleManagement/auth');
  const { getRequestedTranslation } = require('../../middlewares/translations');

  var router = require("express").Router();

  //create some exercises depends on the body
  router.post("/addExercises", auth.isAuthenticated, exercises.createExerciseAndParticipations);

  //create a new exercise
  router.post("/", auth.isAuthenticated, exercises.create);

  //retrieve all exercises in a workUnit assigned to a group
  router.get("/exercisesinagroup/:groupId/:workUnitId",
    auth.isAuthenticated,
    getRequestedTranslation,
    exercises.findAllExercisesInAGroupByWorkUnit
  );

  router.get('/studentsAssignedToExercise/:groupId/:workUnitId/:caseId/:assigned/:finishDate',
    auth.isAuthenticated,
    exercises.getAllStudentsAssignedToExercise);

  router.get('/studentsAssignedToExerciseWithDetails/:groupId/:workUnitId/:caseId/:assigned/:finishDate',
    auth.isAuthenticated,
    exercises.getAllStudentsassignedToExerciseWithDetails);

  router.get('/exercisesAssignedToStudent/:groupId/:workUnitId',
    auth.isAuthenticated,
    getRequestedTranslation,
    exercises.findAllExercisesAssignedToStudent)

  //retrieve all exercises
  router.get("/", auth.isAuthenticated, exercises.findAll);

  //retrieve a single exercise by id
  router.get("/:id", auth.isAuthenticated, exercises.findOne);
  //update an exercise with given id
  router.put("/updateExercises", auth.isAuthenticated, exercises.update);

  //delete an exercise with given id and filtered with assigned
  router.delete("/:exerciseId", auth.isAuthenticated, exercises.delete);

  app.use('/api/exercises', router);
};
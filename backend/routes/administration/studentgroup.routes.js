module.exports = app => {
  const studentGroup = require("../../controllers/administration/studentgroup.controller");
  const auth = require('../../controllers/roleManagement/auth');

  var router = require("express").Router();

  // assign students to groups or groups to students
  router.post("/", auth.isAuthenticated, studentGroup.create);

  // retrieve all data from groupenrolements
  router.get("/", auth.isAuthenticated, studentGroup.findAll);

  //retrieve all students in a group
  router.get("/group/:id", auth.isAuthenticated, studentGroup.findAllStudentsInGroup);

  //retrieve the count of the students in a group
  router.get("/studentcount/group/:id", auth.isAuthenticated, studentGroup.getCountOfStudentsInGroup);

  //retrieve all students not in this table
  router.get("/studentsnotinagroup/:groupId", auth.isAuthenticated, studentGroup.findAllStudentsNotInAGroup);

  //update
  router.put("/:id", auth.isAuthenticated, studentGroup.update);

  //delete
  router.delete("/:id", auth.isAuthenticated, studentGroup.remove);

  //delete
  router.delete("/:userId/:groupId", auth.isAuthenticated, studentGroup.unAssignStudent);

  app.use('/api/studentgroup', router);
}
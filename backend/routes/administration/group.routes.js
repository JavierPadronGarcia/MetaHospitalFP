module.exports = app => {
  const groups = require("../../controllers/administration/group.controller");
  const auth = require('../../controllers/roleManagement/auth');

  var router = require("express").Router();

  //create a new group
  router.post("/", auth.isAuthenticated, groups.createGroup);

  //retrieve all groups with the count of the teachers and students assigned
  router.get("/withCounts", auth.isAuthenticated, groups.findAllWithCounts);

  router.get("/userGroup", auth.isAuthenticated, groups.findUserGroup);

  router.get('/school/:schoolId', auth.isAuthenticated, groups.findAllInSchool);

  //retrieve all groups
  router.get("/", auth.isAuthenticated, groups.findAll);

  //retrieve a single group by id
  router.get("/:id", auth.isAuthenticated, groups.findOne);

  //update a group with given id
  router.put("/:id", auth.isAuthenticated, groups.update);

  //delete a group with given id
  router.delete("/:id", auth.isAuthenticated, groups.delete);

  app.use('/api/groups', router);
};
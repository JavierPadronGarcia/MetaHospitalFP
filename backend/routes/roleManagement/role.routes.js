module.exports = app => {
  const Role = require('../../controllers/roleManagement/role.controller');
  const auth = require('../../controllers/roleManagement/auth');

  var router = require("express").Router();

  // create a role
  router.post("/", auth.isAuthenticated, Role.create);

  // delete a role
  router.delete("/:id", auth.isAuthenticated, Role.delete);

  app.use('/api/roles', router);
}
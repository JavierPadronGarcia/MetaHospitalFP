module.exports = app => {
  const applications = require("../../controllers/roleManagement/application.controller");
  const auth = require('../../controllers/roleManagement/auth');

  var router = require("express").Router();

  //create a new application
  router.post("/", auth.isAuthenticated, applications.create);

  app.use('/api/applications', auth.isAuthenticated, router);
};
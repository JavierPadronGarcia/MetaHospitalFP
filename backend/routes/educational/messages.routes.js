module.exports = app => {
  const Messages = require('../../controllers/administration/messages.controller');
  const auth = require('../../controllers/roleManagement/auth');

  var router = require("express").Router();

  router.post("/", auth.isAuthenticated, Messages.createMany);

  app.use('/api/messages', router);
}
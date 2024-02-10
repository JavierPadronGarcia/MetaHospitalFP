module.exports = app => {
  const Messages = require('../controllers/messages.controller');
  const auth = require('../controllers/auth');

  var router = require("express").Router();

  // create an item and assign it to a case
  router.post("/", auth.isAuthenticated, Messages.createMany);

  app.use('/api/messages', router);
}
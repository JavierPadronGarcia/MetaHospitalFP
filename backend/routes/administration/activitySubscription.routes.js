module.exports = app => {
  const activitySubscriptions = require('../../controllers/administration/activitySubscription.controller');
  const auth = require('../../controllers/roleManagement/auth');

  var router = require("express").Router();

  router.post("/subscribe", auth.isAuthenticated, activitySubscriptions.create);

  router.post("/sendNotificationToSubscriptionName", activitySubscriptions.sendNotificationToSubscriptionName);

  router.post("/deleteByEndpoint", activitySubscriptions.deleteByEndpoint);

  router.get('/', activitySubscriptions.findAll);

  app.use('/api/activitysubscriptions', router);
};
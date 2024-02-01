module.exports = app => {
  const Admin = require("../../controllers/roleManagement/admin.controller")
  const auth = require('../../controllers/roleManagement/auth');
  var upload = require('../../multer/upload');

  var router = require("express").Router();

  router.get("/", auth.isAuthenticated, Admin.getAll);

  router.post("/", auth.isAuthenticated, Admin.create);


  app.use('/api/admins', router);
}
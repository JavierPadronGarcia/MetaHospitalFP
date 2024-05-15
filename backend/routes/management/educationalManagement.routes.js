module.exports = app => {
  const insertDataFromExcel = require('../../controllers/management/insertDataFromExcel.controller');
  const auth = require('../../controllers/roleManagement/auth');
  const multer = require('multer');
  const upload = multer();

  var router = require("express").Router();

  router.post('/createCompleteCase/:workUnitId', auth.isAuthenticated, upload.single('file'), insertDataFromExcel.createCompleteCase);

  app.use('/api/management', auth.isAuthenticated, router);
};
module.exports = app => {
  const users = require("../../controllers/roleManagement/user.controller")
  const auth = require('../../controllers/roleManagement/auth');
  var upload = require('../../multer/upload');

  var router = require("express").Router();

  // Retrieve all Users
  router.get("/", auth.isAuthenticated, users.findAll);

  // Retrieve a single user with id
  router.get("/:id", auth.isAuthenticated, users.findOne);

  // Create a new User
  router.post("/", users.create);

  // Update the image in a user
  router.put("/image", upload.single('file'), auth.isAuthenticated, users.updateWithImage);

  router.put("/noimage/:id", auth.isAuthenticated, users.update);

  // Generate uuid and assign to the user with the id
  router.put("/assignCode", auth.isAuthenticated, users.assignCode);

  router.put("/unassignCode", auth.isAuthenticated, users.unAssignCode);

  // Delete a User with id
  router.delete("/:id", auth.isAuthenticated, users.delete);

  //Sign in
  router.post('/signin', auth.signin);

  router.put('/changePassword', auth.isAuthenticated, auth.changePassword);

  router.post('/signinCode', auth.codeSignin);

  app.use('/api/users', router);
}
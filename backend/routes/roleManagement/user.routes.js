module.exports = app => {
  const users = require("../../controllers/roleManagement/user.controller")
  const auth = require('../../controllers/roleManagement/auth');
  var upload = require('../../multer/upload');

  var router = require("express").Router();

  // // Retrieve all users with role = director
  // router.get("/directors", auth.isAuthenticated, users.findAllDirectors);

  // Retrieve all Users
  router.get("/", auth.isAuthenticated, users.findAll);

  // Retrieve a single user with id
  router.get("/:id", auth.isAuthenticated, users.findOne);

  // Create a new User
  router.post("/", users.create);

  // // Update the image in a user
  // router.put("/image", upload.single('file'), auth.isAuthenticated, users.updateWithImage);

  // Generate uuid and assign to the user with the id
  router.put("/assignCode", auth.isAuthenticated, users.assignCode);

  router.put("/unassignCode", auth.isAuthenticated, users.unAssignCode);

  // Update a User with id
  router.put("/:id", auth.isAuthenticated, users.update);

  // // Assign a user to be Director
  // router.put("/assignDirector/:id", auth.isAuthenticated, users.assignDirector);

  // Delete a User with id
  router.delete("/:id", auth.isAuthenticated, users.delete);

  //Sign in
  router.post('/signin', auth.signin);

  router.post('/signinCode', auth.codeSignin);

  app.use('/api/users', router);
}
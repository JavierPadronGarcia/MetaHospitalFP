module.exports = app => {
  const Participation = require("../controllers/participation.controller")
  const auth = require('../controllers/auth');

  var router = require("express").Router();

  // create a participation and assign it to a case
  router.post("/", auth.isAuthenticated, Participation.create);

  // retrieve all participations
  router.get("/", auth.isAuthenticated, Participation.findAll);

  // retrieve one participation by id
  router.get("/:id", auth.isAuthenticated, Participation.findOne);

  router.put("/submitGrade", auth.isAuthenticated, Participation.submitGrade);

  //update one participation by id
  router.put("/:id", auth.isAuthenticated, Participation.update);
  
  //delete one participation by id
  router.delete("/:id", auth.isAuthenticated, Participation.delete);

  app.use('/api/participations', router);
}
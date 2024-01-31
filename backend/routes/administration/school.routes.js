module.exports = (app) => {
    const school = require("../../controllers/administration/school.controller"); 
    const auth = require('../../controllers/roleManagement/auth');

    var router = require("express").Router();

    router.post("/", auth.isAuthenticated, school.create);

    router.get("/", auth.isAuthenticated, school.findAll);

    router.put("/:id", auth.isAuthenticated, school.update);

    router.delete("/:id", auth.isAuthenticated, school.delete);

    app.use("/api/schools", router); 
};

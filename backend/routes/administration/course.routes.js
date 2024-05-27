module.exports = (app) => {
    const Course = require("../../controllers/administration/course.controller");
    const auth = require('../../controllers/roleManagement/auth');

    var router = require("express").Router();

    router.post("/add", auth.isAuthenticated, Course.create);

    router.get("/:schoolId", auth.isAuthenticated, Course.findBySchoolId);

    router.put("/:id", auth.isAuthenticated, Course.update);

    router.delete("/:id", auth.isAuthenticated, Course.delete);

    app.use("/api/courses", router);
};
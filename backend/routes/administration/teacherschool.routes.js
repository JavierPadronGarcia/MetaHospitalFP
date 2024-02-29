module.exports = (app) => {
    const teacherschool = require("../../controllers/administration/teacherschool.controller");
    const auth = require('../../controllers/roleManagement/auth');

    const router = require("express").Router();

    router.get("/:schoolId/teachers", auth.isAuthenticated, teacherschool.getTeachersBySchool);

    router.post("/:schoolId/teachers",auth.isAuthenticated, teacherschool.addTeacherToSchool);

    router.delete("/:schoolId/teachers/:userId", auth.isAuthenticated, teacherschool.deleteTeacherFromSchool);

    app.use("/api/schools", router);
};
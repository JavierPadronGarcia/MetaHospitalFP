module.exports = (app) => {
    const teacherschool = require("../controllers/teacherschool.controller");
    const auth = require("../controllers/auth");

    const router = require("express").Router();

    router.get("/:schoolId/teachers", auth.isAuthenticated, teacherschool.getTeachersBySchool);

    router.post("/:schoolId/teachers",auth.isAuthenticated, teacherschool.addTeacherToSchool);

    router.delete("/:schoolId/teachers/:userId", auth.isAuthenticated, teacherschool.deleteTeacherFromSchool);

    app.use("/api/schools", router);
};
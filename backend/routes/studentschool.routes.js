module.exports = (app) => {
    const studentSchool = require("../controllers/studentschool.controller");
    const auth = require("../controllers/auth");

    const router = require("express").Router();

    router.get("/:schoolId/students", auth.isAuthenticated, studentSchool.getStudentsBySchool);

    router.post("/:schoolId/students",auth.isAuthenticated, studentSchool.addStudentToSchool);

    router.delete("/:schoolId/students/:userId", auth.isAuthenticated, studentSchool.deleteStudentFromSchool);

    app.use("/api/schools", router);
};

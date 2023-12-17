module.exports = (app) => {
    const Course = require("../controllers/course.controller");
    const auth = require("../controllers/auth");

    var router = require("express").Router();

    router.post("/", auth.isAuthenticated, Course.create);

    router.get("/", auth.isAuthenticated, Course.findAll);

    router.put("/:id", auth.isAuthenticated, Course.update);

    router.delete("/:id", auth.isAuthenticated, Course.delete);

    app.use("/api/courses", router);
};
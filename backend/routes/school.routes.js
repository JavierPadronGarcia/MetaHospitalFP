module.exports = (app) => {
    const school = require("../controllers/school.controller"); 
    const auth = require("../controllers/auth");

    var router = require("express").Router();

    router.post("/", auth.isAuthenticated, school.create);

    router.get("/", auth.isAuthenticated, school.findAll);

    router.put("/:id", auth.isAuthenticated, school.update);

    router.delete("/:id", auth.isAuthenticated, school.delete);

    app.use("/api/schools", router); 
};

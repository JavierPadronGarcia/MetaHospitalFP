const db = require("../models");
const Course = db.Course;

exports.create = (req, res) => {
    if (!req.body.name||!req.body.acronyms) {
        res.status(500).send({ error: "name is mandatory" });
        return;
    }

    const CourseData = {
        name: req.body.name,
        acronyms: req.body.acronyms
    };

    Course.create(CourseData)
        .then((createdCourse) => {
            res.send(createdCourse);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Server error. Couldn't add new Course.",
            });
        });
};

exports.findAll = (req, res) => {
    Course.findAll()
        .then((allCourses) => {
            res.send(allCourses);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Server error. Couldn't find Courses.",
            });
        });
};

exports.delete = (req, res) => {
    const CourseId = req.params.id;

    Course.destroy({
        where: { id: CourseId },
    })
        .then((deletedCount) => {
            if (deletedCount === 1) {
                res.send({ message: "Course deleted successfully." });
            } else {
                res.status(404).send({
                    message: "Course not found or already deleted.",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Server error. Couldn't delete Course.",
            });
        });
};

exports.update = (req, res) => {
    const CourseId = req.params.id;

    const updatedCourseData = {
        name: req.body.name,
        acronyms: req.body.acronyms
    };

    Course.update(updatedCourseData, {
        where: { id: CourseId },
    })
        .then((result) => {
            if (result[0] === 1) {
                res.send({ message: "Course updated successfully." });
            } else {
                res.status(404).send({
                    message: "Course not found or no changes made.",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Server error. Couldn't update Course.",
            });
        });
};
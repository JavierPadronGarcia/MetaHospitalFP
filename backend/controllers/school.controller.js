const db = require("../models");
const School = db.School;

exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(500).send({ error: "name is mandatory" });
        return;
    }

    const schoolData = {
        name: req.body.name,
    };

    School.create(schoolData)
        .then((createdSchool) => {
            res.send(createdSchool);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Server error. Couldn't add new school.",
            });
        });
};

exports.findAll = (req, res) => {
    School.findAll()
        .then((allSchools) => {
            res.send(allSchools);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Server error. Couldn't find schools.",
            });
        });
};

exports.delete = (req, res) => {
    const schoolId = req.params.id;

    School.destroy({
        where: { id: schoolId },
    })
        .then((deletedCount) => {
            if (deletedCount === 1) {
                res.send({ message: "School deleted successfully." });
            } else {
                res.status(404).send({
                    message: "School not found or already deleted.",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Server error. Couldn't delete school.",
            });
        });
};

exports.update = (req, res) => {
    const schoolId = req.params.id;

    const updatedSchoolData = {
        name: req.body.name,
    };

    School.update(updatedSchoolData, {
        where: { id: schoolId },
    })
        .then((result) => {
            if (result[0] === 1) {
                res.send({ message: "School updated successfully." });
            } else {
                res.status(404).send({
                    message: "School not found or no changes made.",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Server error. Couldn't update school.",
            });
        });
};

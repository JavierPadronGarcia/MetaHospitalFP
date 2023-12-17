const db = require("../models");
const TeacherSchool = db.TeacherSchool;
const User = db.User;

exports.getTeachersBySchool = async (req, res) => {
    const schoolId = req.params.schoolId;

    try {
        const teachers = await TeacherSchool.findAll({
            where: {
                SchoolId: schoolId
            },
            include: [{
                model: User,
                attributes: { exclude: ['password','discriminator'] },
            }],
        });

        res.send(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error. Couldn't fetch teachers." });
    }
};


exports.addTeacherToSchool = async (req, res) => {
    const userId = req.body.UserId;
    const schoolId = req.params.schoolId;

    try {
        
        const user = await User.findOne({
            where: {
                id: userId,
                discriminator: 'profesor'
            }
        });

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado o no es un profesor." });
        }

        const newTeacher = await TeacherSchool.create({
            UserId: userId,
            SchoolId: schoolId
        });

        res.status(201).send(newTeacher);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error del servidor. No se pudo agregar al profesor a la escuela." });
    }
};

exports.deleteTeacherFromSchool = async (req, res) => {
    const userId = req.params.userId;
    const schoolId = req.params.schoolId;

    try {
        await TeacherSchool.destroy({
            where: {
            userId: userId,
            schoolId: schoolId,
        }});

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error del servidor. No se pudo eliminar al estudiante de la escuela." });
    }
};
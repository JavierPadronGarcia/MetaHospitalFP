const db = require("../models");
const StudentSchool = db.StudentSchool;
const User = db.User;

exports.getStudentsBySchool = async (req, res) => {
    const schoolId = req.params.schoolId;

    try {
        const students = await StudentSchool.findAll({
            where: {
                SchoolId: schoolId
            },
            include: [{
                model: User,
                attributes: { exclude: ['password','discriminator'] },
            }],
        });

        res.send(students);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error. Couldn't fetch students." });
    }
};


exports.addStudentToSchool = async (req, res) => {
    const userId = req.body.UserId;
    const schoolId = req.params.schoolId;

    try {
        
        const user = await User.findOne({
            where: {
                id: userId,
                discriminator: 'estudiante'
            }
        });

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado o no es un estudiante." });
        }

        const newStudent = await StudentSchool.create({
            UserId: userId,
            SchoolId: schoolId
        });

        res.status(201).send(newStudent);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error del servidor. No se pudo agregar al estudiante a la escuela." });
    }
};

exports.deleteStudentFromSchool = async (req, res) => {
    const userId = req.params.userId;
    const schoolId = req.params.schoolId;

    try {
        await StudentSchool.destroy({
            where: {
            userId: userId,
            schoolId: schoolId,
        }});

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error del servidor. No se pudo eliminar al estudiante de la escuela." });
    }
};
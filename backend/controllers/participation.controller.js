const db = require("../models");
const Participation = db.participation;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const { exerciseId, userId } = req.body;

  if (!exerciseId || !userId) {
    return res.status(403).send({ message: "Please fill all fields" });
  }

  const newParticipation = {
    ExerciseId: exerciseId,
    UserId: userId,
  }

  Participation.create(newParticipation).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.status(500).send({
      error: err.message || "Error creating a new participation"
    });
  });
};

exports.findAll = (req, res) => {
  Participation.findAll().then(data => {
    res.json(data);
  }).catch(err => {
    res.status(500).send({
      error: err.message || "Some error occurred while retrieving participations"
    });
  });
}

exports.findOne = (req, res) => {
  const id = req.params.id;
  Participation.findByPk(id).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      error: err.message || "Some error occurred while retrieving one participation"
    })
  })
}

exports.update = (req, res) => {
  const id = req.params.id;
  const { exerciseID, userID } = req.body;

  if (!exerciseID || !userID) {
    return res.status(400).send({
      message: "CaseId and name cannot be empty!"
    })
  }

  const updatedParticipation = {
    id: id,
    ExerciseId: exerciseID,
    UserId: userID,
  }

  Participation.update(
    updatedParticipation, {
    where: { id: id }
  }).then(() => res.send('Update successful'))
    .catch(err => {
      res.status(500).send({
        error: err.message || "Some error occurred while updating Participations"
      })
    })
}

exports.submitGrade = (req, res) => {
  const { finalGrade, role, submittedTime, userId, exerciseId } = req.body;

  Participation.findOne({
    where: {
      UserId: userId,
      ExerciseId: exerciseId
    },
  }).then(participation => {
    if (!participation) {
      return res.status(404).send("No such participation found!");
    }
    participation.FinalGrade = finalGrade;
    participation.Role = role;
    participation.SubmittedAt = submittedTime;
    participation.save();
    res.send({
      message: 'participation final grade added successfully',
      data: participation
    })
  }).catch(err => {
    return res.status(500).send({
      error: err || "Error when trying to update the final grade!"
    })
  })
}

exports.delete = (req, res) => {
  const id = req.params.id;
  Participation.destroy({ where: { id: id } })
    .then(() => res.send("Deletion Successful"))
    .catch(err => {
      res.status(500).send({ error: err })
    })
}
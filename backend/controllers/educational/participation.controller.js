const db = require("../../models");
const Participation = db.participation;
const Grade = db.grade
const Exercise = db.exercise;
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
  const { finalGrade, role, submittedTime, userId, exerciseId, items } = req.body;
  const handWash = [req.body.handWashInit, req.body.handWashEnd];

  Participation.findOne({
    where: {
      StudentID: userId,
    },
    include: [
      {
        model: Exercise,
        where: {
          CaseID: exerciseId
        }
      }
    ]
  }).then(participation => {
    if (!participation) {
      return res.status(404).send("No such participation found!");
    }

    if (items && items?.length !== 0
      && handWash[0] !== undefined
      && handWash[1] !== undefined) {
      const participationId = participation.id;

      participation.FinalGrade = finalGrade;
      participation.Role = role;
      participation.SubmittedAt = submittedTime;
      participation.save();

      const grades = [];
      for (let i = 0; i < items.length; i++) {
        grades.push({
          grade: items[i].grade,
          correct: items[i].correct,
          ItemID: items[i].itemId,
          ParticipationID: participationId
        })
      }

      grades.push({
        grade: handWash[0].grade,
        correct: handWash[0].correct,
        ItemID: handWash[0].itemId,
        ParticipationID: participationId
      }, {
        grade: handWash[1].grade,
        correct: handWash[1].correct,
        ItemID: handWash[1].itemId,
        ParticipationID: participationId
      })

      Grade.bulkCreate(grades).then(response => {
        return res.send({
          message: 'grades added successfully',
        })
      }).catch(err => {
        return res.status(500).send(
          "Error adding the grading information to the database!: " + err
        )
      })
    } else {
      return res.status(404).send("No item grades found")
    }

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
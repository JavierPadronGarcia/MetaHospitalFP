const db = require("../../models");
const Participation = db.participation;
const Grade = db.grade
const Exercise = db.exercise;
const Case = db.case;
const ItemPlayerRole = db.itemPlayerRole;
const PlayerRole = db.playerRole;
const Item = db.item;
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

exports.submitGrade = async (req, res) => {
  const { finalGrade, role, submittedTime, userId, exerciseId, items, UT } = req.body;
  const handWash = [req.body.handWashInit, req.body.handWashEnd];

  const transaction = await db.sequelize.transaction();

  try {
    const participation = await Participation.findOne({
      where: {
        StudentID: userId,
      },
      include: {
        model: Exercise,
        required: true,
        include: {
          model: Case,
          required: true,
          where: {
            caseNumber: exerciseId + 1,
            WorkUnitID: UT
          }
        }
      },
      transaction
    });

    if (!participation) {
      await transaction.rollback();
      return res.status(403).send({ error: true, message: "User not assigned to this exercise" });
    }

    if (participation.FinalGrade) {
      await transaction.rollback();
      return res.status(200).send({ message: 'The user has already done this exercise, the grades will not be updated' });
    }

    const participationId = participation.id;

    participation.FinalGrade = finalGrade;
    participation.Role = role;
    participation.SubmittedAt = submittedTime;
    await participation.save({ transaction });

    if (items && items?.length !== 0
      && handWash[0] !== undefined
      && handWash[1] !== undefined) {
      const allItemsInWorkUnit = await Item.findAll({
        where: {
          WorkUnitID: UT
        },
        transaction
      });

      const grades = [];
      for (let i = 0; i < items.length; i++) {
        const itemFound = allItemsInWorkUnit.find(item => item.itemNumber === items[i].itemId + 1);
        const itemPlayerRole = await ItemPlayerRole.findOne({
          where: {
            ItemID: itemFound.id
          },
          include: {
            model: PlayerRole,
            where: {
              name: role
            },
            attributes: []
          },
          raw: true,
          transaction
        });

        grades.push({
          grade: items[i].grade,
          correct: items[i].correct,
          ItemPlayerRoleID: itemPlayerRole.id,
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
      try {
        await Grade.bulkCreate(grades, { transaction });

        await transaction.commit();

        return res.send({
          message: 'grades added successfully',
        })
      } catch (error) {
        await transaction.rollback();
        return res.status(500).send(
          { error: true, message: "Error adding the grading information to the database!: " + error }
        )
      }

    } else if (handWash != []) {
      try {

        const handWashgrades = [{
          grade: handWash[0].grade,
          correct: handWash[0].correct,
          ItemID: handWash[0].itemId,
          ParticipationID: participationId
        }, {
          grade: handWash[1].grade,
          correct: handWash[1].correct,
          ItemID: handWash[1].itemId,
          ParticipationID: participationId
        }];

        await Grade.bulkCreate(handWashgrades, { transaction });
        await transaction.commit();
        return res.send({ message: "grades added successfully" })

      } catch (error) {
        await transaction.rollback();
        return res.status(500).send({ error: true, message: 'Error saving Hand wash grades' });
      }
    } else {
      await transaction.rollback();
      return res.status(500).send({ error: true, message: "No handwash grades provided" });
    }

  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({
      error: true,
      message: error.message || "Error when trying to update the final grade!",
    })
  }
}

exports.delete = (req, res) => {
  const id = req.params.id;
  Participation.destroy({ where: { id: id } })
    .then(() => res.send("Deletion Successful"))
    .catch(err => {
      res.status(500).send({ error: err })
    })
}
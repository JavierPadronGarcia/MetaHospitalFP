const db = require("../../models");
const Case = db.case;
const WorkUnit = db.workUnit;
const WorkUnitGroup = db.workUnitGroup;
const Group = db.groups;
const CaseTranslations = db.caseTranslation;
const TranslationLanguage = db.translationLanguage;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const workUnit = req.body.workUnit;
  const name = req.body.name;

  if (!workUnit || !name) {
    return res.status(403).send({ message: "Please fill all fields" });
  }

  const newCase = {
    WorkUnitId: workUnit,
    name: name,
  }

  Case.create(newCase).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.status(500).send({
      error: err.message || "Error creating a new case"
    });
  });
};

exports.findAll = (req, res) => {
  Case.findAll().then(data => {
    res.json(data);
  }).catch(err => {
    res.status(500).send({
      error: err.message || "Some error occurred while retrieving cases"
    });
  });
}

exports.findOne = (req, res) => {
  let id = req.params.id;
  Case.findByPk(id).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      error: err.message || "Some error occurred while retrieving one case"
    })
  })
}

exports.findAllCasesInAGroup = async (req, res) => {
  const { groupId, workUnitId } = req.params;
  const { language } = req.body;

  try {
    const result = await db.sequelize.query(
      `
      SELECT c.id, ct.name
      FROM \`${Group.tableName}\` AS g
      JOIN \`${WorkUnitGroup.tableName}\` AS wkug ON wkug.GroupID = g.id 
      JOIN \`${WorkUnit.tableName}\` AS wku ON wku.id = wkug.WorkUnitID
      JOIN \`${Case.tableName}\` AS c ON c.WorkUnitId = wku.id
      JOIN \`${CaseTranslations.tableName}\` AS ct ON ct.CaseID = c.id
      JOIN \`${TranslationLanguage.tableName}\` AS tl ON tl.id = ct.LanguageID
      WHERE g.id = :groupId 
        AND wku.id = :workUnitId 
        AND tl.languageShort = :language
      GROUP BY c.id, ct.name;
      `,
      {
        replacements: { groupId, workUnitId, language },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );
    return res.send(result);
  } catch (err) {
    return res.status(500).send({
      error: err.message || "Some error occurred while retrieving the cases and their exercises."
    });
  }
}

exports.update = (req, res) => {
  let id = req.params.id;
  const workUnit = req.body.workUnit;
  const name = req.body.name;

  if (!workUnit || !name) {
    return res.status(400).send({
      message: "Work unit and name cannot be empty!"
    })
  }

  const updatedCase = {
    id: id,
    WorkUnitId: workUnit,
    name: name,
  }

  Case.update(
    updatedCase, {
    where: { id: id }
  }).then(() => res.send('Update successful'))
    .catch(err => {
      res.status(500).send({
        error: err.message || "Some error occurred while updating cases"
      })
    })
}



exports.delete = (req, res) => {
  let id = req.params.id;
  Case.destroy({ where: { id: id } })
    .then(() => res.send("Deletion Successful"))
    .catch(err => {
      res.status(500).send({ error: err })
    })
}

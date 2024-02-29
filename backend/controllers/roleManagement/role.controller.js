const db = require("../../models");
const Role = db.role;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const { role } = req.body;

  if (!role) {
    return res.status(400).send({
      error: true,
      message: 'Content cannot be empty'
    })
  }

  const roleObj = {
    name: role,
    status: 'active'
  }

  Role.create(roleObj).then(data => {
    return res.send(data);
  });
}

exports.delete = (req, res) => {
  const id = req.params.id;

  Role.destroy({ where: { id: id } }).then(response => {
    return res.send({
      message: 'Role deleted succesfully'
    });
  });

}
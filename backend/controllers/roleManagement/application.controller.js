const db = require("../../models");
const Application = db.application;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const appName = req.body.name;

  if (!appName) {
    res.status(400).send({
      error: true,
      message: 'Content cannot be empty'
    })
  }

  const newApp = {
    app_name: appName,
    status: 'active'
  }

  Application.create(newApp).then(data => {
    return res.send(data);
  });
}
const db = require('../../models');
const ActivitySubscription = db.activitySubscription;

const webPush = require('web-push');

exports.create = (req, res) => {
  const { subscription, subscriptionName } = req.body;

  if (!subscription || !subscriptionName) {
    return res.status(401).send({
      error: true,
      message: 'Content cannot be empty!'
    });
  }

  const newSubscription = {
    endpoint: subscription.endpoint,
    expirationTime: subscription.expirationTime,
    keys: JSON.stringify(subscription.keys),
    subscriptionName: subscriptionName,
    UserID: req.user.id
  }

  ActivitySubscription.create(newSubscription).then(async (data) => {
    return res.send('User subscribed successfully');
  }).catch(err => {
    return res.status(500).send({
      error: true,
      message: err.message || "Error creating a new subscription"
    })
  });
}

exports.findAll = (req, res) => {
  ActivitySubscription.findAll().then(data => {
    res.send(data);
  }).catch(err => {
    return res.status(500).send({
      error: true,
      message: err.message || "error finding all subscriptions"
    })
  })
}

exports.sendNotificationToSubscriptionName = (req, res) => {
  ActivitySubscription.findAll({
    where: {
      subscriptionName: req.body.subscriptionName
    }
  }).then(subscriptionsInDB => {
    for (const s of subscriptionsInDB) {
      const subscriptionRecipient = {
        endpoint: s.dataValues.endpoint,
        expirationTime: s.dataValues.expirationTime,
        keys: JSON.parse(s.dataValues.keys)
      }
      const title = `Just for ${req.body.subscriptionName}`;
      const description = req.body.notificationMessage;
      sendNotification(subscriptionRecipient, title, description);
    }
    return res.send('Notification sent')
  })
}

exports.deleteByEndpoint = (req, res) => {
  if (!req.body.endpoint) {
    return res.status(401).send({
      error: true,
      message: 'Content cannot be empty'
    })
  }

  ActivitySubscription.findOne({
    where: {
      endpoint: req.body.endpoint
    }
  }).then(subsctiptionToDelete => {
    if (!subsctiptionToDelete) return res.status(400).send({ error: true, message: 'Endpoint not found' })

    ActivitySubscription.destroy({
      where: {
        id: subsctiptionToDelete.id
      }
    }).then(() => {
      res.send("Subscription deleted successfully");
    }).catch(err => {
      return res.status(500).send({
        error: true,
        message: err.message || 'Error deleting the subscription'
      })
    })
  })
}

const sendNotification = async (subscriptionRecipient, title, description) => {
  const options = {
    vapidDetails: {
      subject: 'mailto:myemail@example.com',
      publicKey: process.env.PUBLIC_KEY,
      privateKey: process.env.PRIVATE_KEY
    }
  };

  try {
    await webPush.sendNotification(
      subscriptionRecipient,
      JSON.stringify({
        title,
        description,
        image: 'http://localhost:12080/images/logo144.png'
      }),
      options
    );
  } catch (err) {
    throw (err);
  }
}
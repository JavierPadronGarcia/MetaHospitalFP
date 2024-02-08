import { useState, useEffect } from 'react';

import {
  regSw,
  subscribe,
  checkIfAlreadySubscribed,
  getAllSubscriptions,
  sendNotificationToSubscriptionName,
  unregisterFromServiceWorker
} from '../../../services/notification.service';

function NotificationTest() {
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionName, setSubscriptionName] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("select a recipient");

  const registerAndSubscribe = async () => {
    try {
      await subscribe(subscriptionName);

      window.localStorage.setItem("subscription-name", subscriptionName);

      setSubscribed(true);
      getAllSubscriptions().then((res) => {
        setSubscriptions(res.data);
      })
    } catch (error) {
      console.log(error);
    }
  }

  const checkSubscriptionState = async () => {
    const subscriptionState = await checkIfAlreadySubscribed();
    setSubscribed(subscriptionState);
    if (subscriptionState) {
      const aux = window.localStorage.getItem("subscription-name");
      setSubscriptionName(aux);
    }
  }

  const handleSubscription = async (e) => {
    e.preventDefault();

    await registerAndSubscribe();
  }

  const handleUnsubscription = (e) => {
    e.preventDefault();

    unregisterFromServiceWorker().then(() => {
      checkSubscriptionState();
      setSubscriptionName("");
      window.localStorage.removeItem("subscription-name");
    })
  }

  const handleNotificationSending = (e) => {
    e.preventDefault();

    sendNotificationToSubscriptionName(selectedRecipient, notificationMessage).then(() => {
      setNotificationMessage("");
    })
  }

  useEffect(() => {
    checkSubscriptionState();

    getAllSubscriptions().then((res) => {
      setSubscriptions(res.data);
    })
  }, []);

  useEffect(() => {
    getAllSubscriptions().then((res) => {
      setSubscriptions(res.data);
    })
  }, [subscribed])

  return (
    <>
      {subscribed ?
        <div className="container">
          <div className="header">
            <h1>You are subscribed as {subscriptionName}</h1>
            <button onClick={handleUnsubscription}>Unsubscribe</button>
          </div>
          <div className="section">
            <label>
              Recipient:
              <select
                value={selectedRecipient}
                onChange={(e) => {
                  setSelectedRecipient(e.target.value);
                  console.log("select value changed")
                }
                }>
                <option key="0" value="select a recipient">select a recipient</option>
                {subscriptions.map((s) => {
                  return (
                    <option key={s.id} value={s.subscriptionName}>{s.subscriptionName}</option>
                  )
                })}
              </select>
            </label>
            <form onSubmit={handleNotificationSending}>
              <label htmlFor="notification-message"></label>
              <input type="text" id="notification-message" name="notification-message" required
                placeholder="Enter notification message"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)} />
              <button type="submit">Send Notification</button>
            </form>
          </div>
        </div>
        :
        <div className="container">
          <div className="header">
            <h1>This client is not  subscribed</h1>
          </div>
          <div className="section">
            <form onSubmit={handleSubscription}>
              <label htmlFor="subscription-name"></label>
              <input type="text" id="subscription-name" name="subscription-name" required
                placeholder="Enter subscription name"
                value={subscriptionName}
                onChange={(e) => setSubscriptionName(e.target.value)} />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      }
    </>
  );
}

export default NotificationTest;
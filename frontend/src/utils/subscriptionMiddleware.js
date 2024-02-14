import {
  subscribe,
  checkIfAlreadySubscribed,
  getAllSubscriptions,
} from '../services/notification.service';

async function subscriptionMiddleware(user) {
  const subscribed = await checkIfAlreadySubscribed();

  if (!subscribed) {
    const subscriptionName = user.username + user.id;
    await subscribe(subscriptionName);

    localStorage.setItem("subscription-name", subscriptionName);
  }
}

export default subscriptionMiddleware;
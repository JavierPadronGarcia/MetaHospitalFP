import {
  subscribe,
  checkIfAlreadySubscribed,
} from '../services/notification.service';

async function subscriptionMiddleware(user) {
  try {
    const subscribed = await checkIfAlreadySubscribed();

    if (!subscribed) {
      const subscriptionName = user.username + user.id;
      await subscribe(subscriptionName);

      localStorage.setItem("subscription-name", subscriptionName);
    }
  } catch (error) {
    return;
  }
}

export default subscriptionMiddleware;
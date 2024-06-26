import axios from 'axios';

import { backendSubscriptionEndpoint } from '../constants/backendEndpoints';

function getOptions(token) {
  let bearerAccess = 'Bearer ' + token;

  let options = {
    headers: {
      'Authorization': bearerAccess,
    }
  }
  return options;
}

function unregisterAllServiceWorkers() {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

async function subscribe(subscriptionName) {

  const serviceWorkerReg = await navigator.serviceWorker.getRegistration();

  let subscription = await serviceWorkerReg.pushManager.getSubscription();
  if (subscription === null) {
    subscription = await serviceWorkerReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_PUBLIC_KEY
    });
    axios.post(`${backendSubscriptionEndpoint}/subscribe`,
      { subscriptionName: subscriptionName, subscription: subscription },
      getOptions(localStorage.getItem('token'))
    );
  }
}

async function sendNotificationToSubscriptionName(subscriptionName, notificationMessage) {
  const message = {
    subscriptionName,
    notificationMessage
  }
  return axios.post(`${backendSubscriptionEndpoint}/sendNotificationToSubscriptionName`, message);
}

async function getAllSubscriptions() {
  return axios.get(`${backendSubscriptionEndpoint}`);
}

async function checkIfAlreadySubscribed() {
  const serviceWorkerReg = await navigator.serviceWorker.getRegistration('/serviceWorker.js');
  if (!serviceWorkerReg) return false;

  let subscription = await serviceWorkerReg.pushManager.getSubscription();

  if (subscription !== null) return true;

  return false;
}

async function unregisterFromServiceWorker() {
  const serviceWorkerReg = await navigator.serviceWorker.getRegistration();

  if (!serviceWorkerReg) return;
  let subscription = await serviceWorkerReg.pushManager.getSubscription();

  if (!subscription) return;

  // I use the endpoint to delete a subscription. 
  // I use a non standard POST to delete the subscription in Backend
  await axios.post(`${backendSubscriptionEndpoint}/deleteByEndpoint`, { endpoint: subscription.endpoint });
  await subscription.unsubscribe();
}

export {
  subscribe,
  unregisterAllServiceWorkers,
  checkIfAlreadySubscribed,
  getAllSubscriptions,
  sendNotificationToSubscriptionName,
  unregisterFromServiceWorker
};
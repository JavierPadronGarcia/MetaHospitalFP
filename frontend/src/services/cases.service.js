import axios from 'axios';
import i18next from 'i18next';

import { backendCasesEndpoint } from '../constants/backendEndpoints';

function getOptions(token) {
  let bearerAccess = 'Bearer ' + token;

  let options = {
    headers: {
      'Authorization': bearerAccess,
      'Content-Type': 'application/x-www-form-urlencoded',
      'required-language-response': i18next.language
    }
  }
  return options;
}

async function getAllCasesOfTheGroup(groupId, workUnitId) {
  try {
    const response = axios.get(`${backendCasesEndpoint}/byGroup/${groupId}/${workUnitId}`,
      getOptions(localStorage.getItem('token'))
    );
    return (await response).data;
  } catch (err) {
    throw err;
  }
}

export default {
  getAllCasesOfTheGroup
}
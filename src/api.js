const CONFIG = require('./config');
const fetch = require("whatwg-fetch");

const API = ((global, partnerKey, Utils) => {
  const parseJSON = (response) => {
    if(response.status >= 200 && response.status < 400) {
      return response.json()
    }
    throw response.json()
  }

  const getProfile = (sessionState, nonce) => {
    return new Promise((resolve, reject) => {
      global.fetch(
        `${CONFIG.API.DOMAIN}${CONFIG.API.VERSION}${CONFIG.API.PROFILE}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${Utils.encryptData(sessionState, nonce)}`,
            'client-id': partnerKey
          }
        }
      ).then(parseJSON).then(data => resolve(data.response)).catch(err => reject(new Error(err)));
    });
  }

  const logout = (sessionState, nonce) => {
    return new Promise((resolve, reject) => {
      global.fetch(
        `${CONFIG.API.DOMAIN}${CONFIG.API.VERSION}${CONFIG.API.LOGOUT}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${Utils.encryptData(sessionState, nonce)}`,
            'client-id': partnerKey
          }
        }
      ).then(parseJSON).then(data => resolve(data.response)).catch(err => reject(new Error(err)));
    });
  }

  const getPartner = () => {
    return new Promise((resolve, reject) => {
      global.fetch(
        `${CONFIG.API.DOMAIN}${CONFIG.API.VERSION}${CONFIG.API.PARTNER}/${partnerKey}`,
        {
          method: 'GET'
        }
      ).then(parseJSON).then(data => resolve(data.response)).catch(err => reject(new Error(err)));
    });
  }

  return {
    getProfile: getProfile,
    logout: logout,
    getPartner: getPartner
  }
});

module.exports = API;
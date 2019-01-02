const CONFIG = require('./config');

const API = ((global, $, partnerKey) => {
  const getProfile = (sessionState, nonce) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${CONFIG.API.DOMAIN}${CONFIG.API.VERSION}${CONFIG.API.PROFILE}`,
        headers: {
          'session-state': sessionState,
          'client-id': partnerKey,
          nonce
        }
      }).then(data => {
        resolve(data.response);
      }).catch(err => {
        reject(new Error(err));
      })
    });
  }

  return {
    getProfile: getProfile
  }
});

module.exports = API;
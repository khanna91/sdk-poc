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

  const logout = (sessionState, nonce) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${CONFIG.API.DOMAIN}${CONFIG.API.VERSION}${CONFIG.API.LOGOUT}`,
        method: 'DELETE',
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
    getProfile: getProfile,
    logout: logout
  }
});

module.exports = API;
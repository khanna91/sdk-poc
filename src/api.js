const CONFIG = require('./config');

const API = ((global, $, partnerKey) => {
  const getProfile = (sessionState, nonce) => {
    $.ajax({
      url: `${CONFIG.API.DOMAIN}${CONFIG.API.VERSION}${CONFIG.API.PROFILE}`,
      headers: {
        'session-state': sessionState,
        'client-id': partnerKey,
        nonce
      }
    }).then(data => {
      // setCookie(SESSION_COOKIE, sessionState);
      user.isLoggedIn = true;
      user.detail = data.response;
      global.dispatchEvent(new CustomEvent("authStatusChange"));
    }).catch(err => {
      console.log(err)
    })
  }

  return {
    getProfile: getProfile
  }
});

module.exports = API;
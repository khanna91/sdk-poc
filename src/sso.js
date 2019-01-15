const SSO = ((global, partnerKey) => {
  const CONFIG = require('./config');
  const Utils = require('./utils')(global);
  const API = require('./api')(global, partnerKey);
  const User = require('./user')();
  const UI = require('./ui')(global, partnerKey, Utils);

  const authenticate = (queryParams) => {
    let astroIdentitySessionState = Utils.getQueryStringValue('session_state') || Utils.getCookie(CONFIG.COOKIE.SESSION) // Astro Identity Session State
    let astroNonce = Utils.getQueryStringValue('nonce') || Utils.getCookie(CONFIG.COOKIE.NONCE) // Astro Identity Nonce
    if (!astroNonce) {
      astroNonce = Utils.generateNonce();
    }
    Utils.setCookie(CONFIG.COOKIE.NONCE, astroNonce);
    let authCheck = Utils.getCookie(CONFIG.COOKIE.AUTH_CHECK);
    if(astroIdentitySessionState) { // need to get user profile
      Utils.setCookie(CONFIG.COOKIE.SESSION, astroIdentitySessionState);
      const partnerInfo = API.getPartner().then(partner => partner).catch(err => {
        return {
          showLinkingPopup: false
        }
      })
      const userInfo = API.getProfile(astroIdentitySessionState, astroNonce).then((user) => {
        User.setUser(user);
        global.dispatchEvent(new CustomEvent("authStatusChange"));
        return user;
      }).catch(err => { 
        User.setUser(null);
        Utils.deleteCookie(CONFIG.COOKIE.SESSION);
        global.dispatchEvent(new CustomEvent("authStatusChange")); 
        return null;
      });
      Promise.all([partnerInfo, userInfo]).then(result => {
        if(result[0] && result[0].showLinkingPopup && result[1] && result[1].linkingInfo && !result[1].linkingInfo.isProfileLinked) {
          UI.createUiNotificationBar();
        }
      })
    } else if (!authCheck) { // need to redirect to identity portal to check user auth state
      Utils.setCookie(CONFIG.COOKIE.AUTH_CHECK, true, 1);
      queryParams.nonce = astroNonce;
      queryString = Utils.makeQueryString(queryParams);
      global.location.href = `${CONFIG.PORTAL.DOMAIN}/auth?${queryString}`;
    }
    // otherwise, user never logged in, dont do anything
  }

  const login = (params) => {
    if (!params.redirect_uri || !params.continue) {
      console.error('Missing Identity Parameters');
      return;
    }
    params.response_type = 'code';
    params.scope = 'openid';
    params.nonce = Utils.generateNonce();
    params.state = '321';
    params.redirectToLogin = true;
    params.partnerKey = partnerKey;
    queryString = Utils.makeQueryString(params);
    global.location.href = `${CONFIG.PORTAL.DOMAIN}/auth?${queryString}`;
  }

  const register = (params) => {
    if (!params.redirect_uri) {
      console.error('Missing Identity Parameters');
      return;
    }
    params.response_type = 'code';
    params.scope = 'openid';
    params.nonce = Utils.generateNonce();
    params.state = '321';
    params.partnerKey = partnerKey;
    queryString = Utils.makeQueryString(params);
    global.location.href = `${CONFIG.PORTAL.DOMAIN}/signup?${queryString}`;
  }

  const getCurrentUser = () => {
    return User.getUser();
  }

  const logout = (params) => {
    const sessionState = Utils.getCookie(CONFIG.COOKIE.SESSION);
    const nonce = Utils.getCookie(CONFIG.COOKIE.NONCE);
    API.logout(sessionState, nonce).then((user) => {
      User.setUser(null);
      global.dispatchEvent(new CustomEvent("authStatusChange"));
      Utils.deleteCookie(CONFIG.COOKIE.SESSION);
      params.partnerKey = partnerKey;
      queryString = Utils.makeQueryString(params);
      window.location.href = `${CONFIG.PORTAL.DOMAIN}/logout?${queryString}`;
    }).catch(err => { 
      console.error(err);
    });
  }

  return {
    authenticate: authenticate,
    login: login,
    register: register,
    getCurrentUser: getCurrentUser,
    logout: logout
  }
});

module.exports = SSO;
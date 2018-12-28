const SSO = ((global, $, partnerKey) => {
  const CONFIG = require('./config');
  const Utils = require('./utils')(global);
  const API = require('./api')(global, $, partnerKey);

  const authenticate = (queryParams) => {
    let astroIdentitySessionState = Utils.getQueryStringValue('session_state') || Utils.getCookie(CONFIG.COOKIE.SESSION) // Astro Identity Session State
    let astroNonce = Utils.getQueryStringValue('nonce') || Utils.getCookie(CONFIG.COOKIE.NONCE) // Astro Identity Nonce
    if(astroIdentitySessionState) { // need to get user profile
      Utils.setCookie(CONFIG.COOKIE.SESSION, astroIdentitySessionState);
      if (!astroNonce) {
        astroNonce = Utils.generateNonce();
      }
      Utils.setCookie(CONFIG.COOKIE.NONCE, astroNonce);
      API.getProfile(astroIdentitySessionState, astroNonce);
    } else if (!astroNonce) { // need to redirect to identity portal to check user auth state
      queryString = Utils.makeQueryString(queryParams);
      global.location.href = `${CONFIG.PORTAL.DOMAIN}/auth?${queryString}`;
    }
    // otherwise, user never logged in, dont do anything
  }

  const setIdentity = () => {
    Utils.setCookie(CONFIG.COOKIE.NONCE, Utils.generateNonce());
    const sessionState = Utils.getQueryStringValue('session_state');
    if(sessionState !== undefined && sessionState !== null && sessionState !== '') {
      Utils.setCookie(SESSION_COOKIE, sessionState);
    }
  }

  const login = (params) => {
    if (!params.partnerKey || !params.redirect_uri || !params.continue) {
      console.error('Missing Identity Parameters');
      return;
    }
    params.response_type = 'code';
    params.scope = 'openid';
    params.nonce = Utils.generateNonce();
    params.state = '321';
    params.redirectToLogin = true;
    queryString = Utils.makeQueryString(params);
    global.location.href = `${CONFIG.PORTAL.DOMAIN}/auth?${queryString}`;
  }

  const register = (params) => {
    if (!params.partnerKey || !params.redirect_uri) {
      console.error('Missing Identity Parameters');
      return;
    }
    params.response_type = 'code';
    params.scope = 'openid';
    params.nonce = Utils.generateNonce();
    params.state = '321';
    queryString = Utils.makeQueryString(params);
    global.location.href = `${CONFIG.PORTAL.DOMAIN}/register?${queryString}`;
  }

  const getCurrentUser = () => {
    return null
  }

  return {
    authenticate: authenticate,
    setIdentity: setIdentity,
    login: login,
    register: register,
    getCurrentUser: getCurrentUser
  }
});

module.exports = SSO;
const SSO = ((global, $, partnerKey) => {
  const CONFIG = require('./config');
  const Utils = require('./utils')(global);
  const API = require('./api')(global, $, partnerKey);
  const User = require('./user')();

  const authenticate = (queryParams) => {
    let astroIdentitySessionState = Utils.getQueryStringValue('session_state') || Utils.getCookie(CONFIG.COOKIE.SESSION) // Astro Identity Session State
    let astroNonce = Utils.getQueryStringValue('nonce') || Utils.getCookie(CONFIG.COOKIE.NONCE) // Astro Identity Nonce
    if(astroIdentitySessionState) { // need to get user profile
      Utils.setCookie(CONFIG.COOKIE.SESSION, astroIdentitySessionState);
      if (!astroNonce) {
        astroNonce = Utils.generateNonce();
      }
      Utils.setCookie(CONFIG.COOKIE.NONCE, astroNonce);
      API.getProfile(astroIdentitySessionState, astroNonce).then((user) => {
        User.setUser(user);
        global.dispatchEvent(new CustomEvent("authStatusChange"));
      }).catch(err => { 
        User.setUser(null);
        global.dispatchEvent(new CustomEvent("authStatusChange")); 
      });
    } else if (!astroNonce) { // need to redirect to identity portal to check user auth state
      astroNonce = Utils.generateNonce();
      Utils.setCookie(CONFIG.COOKIE.NONCE, astroNonce);
      queryString = Utils.makeQueryString(queryParams);
      global.location.href = `${CONFIG.PORTAL.DOMAIN}/auth?${queryString}`;
    }
    // otherwise, user never logged in, dont do anything
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
    return User.getUser();
  }

  const logout = (params) => {
    const sessionState = Utils.getCookie(CONFIG.COOKIE.SESSION);
    const nonce = Utils.getCookie(CONFIG.COOKIE.NONCE);
    API.logout(sessionState, nonce).then((user) => {
      User.setUser(null);
      global.dispatchEvent(new CustomEvent("authStatusChange"));
      Utils.deleteCookie(CONFIG.COOKIE.SESSION)
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
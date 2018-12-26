;((global, $) => {
  let user = {
    isLoggedIn: false,
    detail: null
  }
  const PORTAL_DOMAIN = 'https://identity-portal-dev.identity.astro.com.my';
  const API_DOMAIN = 'https://middleware-service-develop.identity.astro.com.my';
  const API_VERSION = 'api/v1';
  const SESSION_COOKIE = 'AISS';
  const NONCE_COOKIE = 'AIN';

  // function to generate nonce
  generateNonce = () => {
    return [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('') // eslint-disable-line
  }

  // function to get the query value
  getQueryStringValue = (key) => {  
    return decodeURIComponent(global.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
  } 

  // function to read cookies
  getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  // function to set the cookie
  setCookie = (cname, cvalue, exdays) => {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  deleteCookie = (cname) => {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  // function to make query string from object
  makeQueryString = (params = {}) => {
    let queryString = '';
    const entries = Object.entries(params);
    for (const [index, value] of entries) {
      queryString += `${index}=${encodeURI(value)}&`
    }
    return queryString
  }

  // function to get the user profile
  getUserProfile = (sessionState, nonce) => {
    $.ajax({
      url: `${API_DOMAIN}/${API_VERSION}/profile`,
      headers: {
        'session-state': sessionState,
        'client-id': 'ngrock',
        nonce
      }
    }).then(data => {
      // setCookie(SESSION_COOKIE, sessionState);
      user.isLoggedIn = true;
      user.detail = data.response
      global.dispatchEvent(new CustomEvent("authStatusChange"));
    }).catch(err => {
      console.log(err)
    })
  }

  // funtion to check whether needs redirection or not, and authenticate the user
  authenticate = (queryParams) => {
    let astroIdentitySessionState = getCookie(SESSION_COOKIE) // Astro Identity Session State
    if (!astroIdentitySessionState) {
      astroIdentitySessionState = getQueryStringValue('session_state')
      setCookie(SESSION_COOKIE, astroIdentitySessionState);
    }
    let astroNonce = getCookie(NONCE_COOKIE) // Astro Identity Nonce
    if(astroIdentitySessionState) { // need to get user profile
      if (!astroNonce) {
        astroNonce = generateNonce();
        setCookie(NONCE_COOKIE, astroNonce); 
      }
      getUserProfile(astroIdentitySessionState, astroNonce);
    } else if (!astroNonce) { // need to redirect to identity portal to check user auth state
      queryString = makeQueryString(queryParams);
      window.location.href = `${PORTAL_DOMAIN}/auth?${queryString}`;
    }
    // otherwise, user never logged in, dont do anything
  }

  // function to set appropriate cookie if user is logged in globally
  setIdentity = () => {
    setCookie(NONCE_COOKIE, generateNonce());
    const sessionState = getQueryStringValue('session_state');
    if(sessionState !== undefined && sessionState !== null && sessionState !== '') {
      setCookie(SESSION_COOKIE, sessionState);
    }
  }

  login = (params) => {
    if (!params.partnerKey || !params.redirect_uri) {
      console.error('Missing Identity Parameters');
      return;
    }
    params.response_type = 'code';
    params.scope = 'openid';
    params.nonce = generateNonce();
    params.state = '321';
    queryString = makeQueryString(params);
    window.location.href = `${PORTAL_DOMAIN}/login?${queryString}`;
  }

  register = (params) => {
    if (!params.partnerKey || !params.redirect_uri) {
      console.error('Missing Identity Parameters');
      return;
    }
    params.response_type = 'code';
    params.scope = 'openid';
    params.nonce = generateNonce();
    params.state = '321';
    queryString = makeQueryString(params);
    window.location.href = `${PORTAL_DOMAIN}/register?${queryString}`;
  }

  logout = (params) => {
    const sessionState = getCookie(SESSION_COOKIE) // Astro Identity Session State
    let nonce = getCookie(NONCE_COOKIE) // Astro Identity Nonce
    $.ajax({
      url: `${API_DOMAIN}/${API_VERSION}/oidc/logout`,
      method: 'DELETE',
      headers: {
        'session-state': sessionState,
        'client-id': 'ngrock',
        nonce
      }
    }).then(data => {
      deleteCookie(SESSION_COOKIE)
      queryString = makeQueryString(params);
      user.isLoggedIn = false;
      user.detail = null;
      window.location.href = `${PORTAL_DOMAIN}/logout?${queryString}`;
      // global.dispatchEvent(new CustomEvent("authStatusChange"));
    }).catch(err => {
      console.log(err)
    })
  }

  global.sso = {
    authenticate: authenticate,
    setIdentity: setIdentity,
    login: login,
    logout: logout,
    register: register,
    user: user
  }
})(window, jQuery);
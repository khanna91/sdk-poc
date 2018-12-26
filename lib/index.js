"use strict";

require("core-js/modules/es6.regexp.split");

;

((global, $) => {
  let isUserLoggedIn = false;
  let user = null;
  const API_DOMAIN = 'https://middleware-service-develop.identity.astro.com.my';
  const API_VERSION = 'api/v1'; // function to read cookies

  getCookie = cname => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];

      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }

      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }

    return null;
  }; // function to get the user profile


  getUserProfile = (sessionState, nonce) => {
    $.ajax({
      url: `${API_DOMAIN}/${API_VERSION}/profile`,
      headers: {
        'session-state': sessionState,
        nonce
      }
    }).then(response => response.json()).then(data => console.log(data)).catch(err => console.log(err));
  }; // funtion to check whether needs redirection or not, and authenticate the user


  authenticate = () => {
    const astroIdentitySessionState = getCookie('AISS'); // Astro Identity Session State

    const astroNonce = getCookie('AIN'); // Astro Identity Nonce

    if (astroIdentitySessionState) {
      // need to get user profile
      getUserProfile(astroIdentitySessionState, astroNonce);
    } else if (!astroNonce) {
      // need to redirect to identity portal to check user auth state
      window.href = 'http://localhost:3000/auth';
    } // otherwise, user never logged in, dont do anything

  };

  global.sso = {
    authenticate: authenticate
  };
})(window, jQuery);
const Utils = ((global) => {
  // function to generate nonce
  const generateNonce = () => {
    return [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('') // eslint-disable-line
  }

  // function to get the query value
  const getQueryStringValue = (key) => {  
    return decodeURIComponent(global.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
  } 

  // function to read cookies
  const getCookie = (cname) => {
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
  const setCookie = (cname, cvalue, exdays) => {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  const deleteCookie = (cname) => {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  // function to make query string from object
  const makeQueryString = (params = {}) => {
    let queryString = '';
    const entries = Object.entries(params);
    for (const [index, value] of entries) {
      queryString += `${index}=${encodeURI(value)}&`
    }
    return queryString
  }

  return {
    generateNonce: generateNonce,
    getQueryStringValue: getQueryStringValue,
    getCookie: getCookie,
    setCookie: setCookie,
    deleteCookie: deleteCookie,
    makeQueryString: makeQueryString
  }
});

module.exports = Utils;
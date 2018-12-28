const SSO = require('./sso');

;((global, $) => {
  const script_tag = document.getElementById('astro-identity');
  const query = script_tag.src.replace(/^[^\?]+\??/,''); 
  // Parse the querystring into arguments and parameters
  const vars = query.split("&");
  const args = {};
  for (let i=0; i<vars.length; i++) {
      let pair = vars[i].split("=");
      // decodeURI doesn't expand "+" to a space.
      args[pair[0]] = decodeURI(pair[1]).replace(/\+/g, ' ');   
  }
  const partnerKey = args['partnerKey'];
  global.sso = new SSO(global, $, partnerKey);
})(window, $);
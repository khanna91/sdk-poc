const config = require('./config');

const UI = ((global, partnerKey) => {
  const applyBarStyling = (div) => {
    div.setAttribute('id', 'astro-identity-notification-bar');
    div.style.position = "absolute";
    div.style['z-index'] = 9001;
    div.style.top = 0;
    div.style.left = 0;
    div.style.right = 0;
    div.style.background = '#ec008c';
    div.style['text-align'] = 'center';
    div.style['line-height'] = 2.5;
    div.style.overflow = 'hidden'; 
  }

  const appendNotificationContent = (div) => {
    const paragraph = document.createElement('p');
    paragraph.style.margin = 0;
    paragraph.style.padding = '10px 20px';
    paragraph.style.color = '#FFF';
    paragraph.style['line-height'] = 1.5;
    const text = document.createTextNode('Seems, you haven\'t linked your account with Astro. To avail all the services, please link your account ');
    paragraph.appendChild(text);
    // append link
    const anchor = document.createElement('a');
    anchor.setAttribute('href', `${config.PORTAL.DOMAIN}${config.PORTAL.LINKING}?continue=${encodeURIComponent(global.location.href)}`);
    const linkText = document.createTextNode("here");
    anchor.style.color = '#08080a';
    anchor.appendChild(linkText);
    paragraph.appendChild(anchor);
    div.appendChild(paragraph);
  }

  const appendInsideBody = (div) => {
    global.document.body.appendChild(div);
  }

  const createUiNotificationBar = () => {
    const div = global.document.createElement("div");
    applyBarStyling(div);
    appendNotificationContent(div);
    appendInsideBody(div);
  }

  return {
    createUiNotificationBar: createUiNotificationBar
  }
});

module.exports = UI;
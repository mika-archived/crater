// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

let current = null;
const domains = [
  'czilladx.com',
  'mellowads.com'
];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'block') {
    console.log('Try to block next request.');
    current = message.current;
    sendResponse('ok');
  }
});

chrome.webRequest.onBeforeRequest.addListener((details) => {
  console.log(`Navigating to ${details.url}.`)
  console.log(current)
  console.log(domains.indexOf(new URL(details.url).host))
  const redirect = current;
  current = null;
  if (redirect && domains.indexOf(new URL(details.url).host) >= 0) {
    console.log(`Blocking. Redirect to ${redirect}`);
    // return { cancel: true }
    return { redirectUrl: redirect };
  }
  return { cancel: false }
}, { urls: ["<all_urls>"], types: ["main_frame"] }, ['blocking']);

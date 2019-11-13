import './analytics';

chrome.runtime.onInstalled.addListener(function () {
  console.log('browsertime2');
  chrome.omnibox.onInputEntered.addListener(function (text) {
    console.log('browsertime3');
    chrome.storage.sync.get('confluenceUrl', function (data) {
      if (!data.confluenceUrl) {
        alert('Click the extension and set a Confluence URL');
        return;
      } else {
        chrome.tabs.create({ url: `https://${data.confluenceUrl}/wiki/dosearchsite.action?queryString=${encodeURIComponent(text)}` });
      }
    });
  });
  chrome.notifications.create('new-install-notification', {
    type: 'basic',
    iconUrl: 'images/connie-128.png',
    title: 'Confluence Quick Search',
    message: 'Click me and set a hotkey...',
    contextMessage: 'Keyboard shortcut',
    requireInteraction: true
  }, (id) => {
    chrome.notifications.onClicked.addListener(() => {
      chrome.tabs.create({ url: 'chrome://extensions/shortcuts' }, ({ windowId }) => {
        chrome.windows.update(windowId, { focused: true }, () => {
          chrome.notifications.clear(id);
          // yodawg I heard you like callbacks
        });
      });
    });
  });
});

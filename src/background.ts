import "./_ga";
import { _gaq } from "./analytics";
import { getSiteUrl } from "./utils/data";

const installHandler = (details: chrome.runtime.InstalledDetails): void => {
  _gaq.push(["_trackEvent", "install"]);
  if (details.reason !== "install") {
    // no need to show notification
    return;
  }
  _gaq.push(["_trackEvent", "notification", "shown"]);
  chrome.notifications.create(
    "new-install-notification",
    {
      type: "basic",
      iconUrl: "images/connie-128.png",
      title: "Confluence Quick Search",
      message: "Click me and set a hotkey...",
      contextMessage: "Keyboard shortcut",
      requireInteraction: true,
    },
    (id) => {
      chrome.notifications.onClicked.addListener(() => {
        _gaq.push(["_trackEvent", "notification", "clicked"]);
        chrome.tabs.create({ url: "chrome://extensions/shortcuts" }, ({ windowId }) => {
          chrome.windows.update(windowId, { focused: true }, () => {
            chrome.notifications.clear(id);
          });
        });
      });
    },
  );
};

const searchHandler = (text) => {
  _gaq.push(["_trackEvent", "omnibox"]);
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError.message);
  }
  getSiteUrl()
    .then((siteUrl) => {
      if (!siteUrl) {
        _gaq.push(["_trackEvent", "omnibox", "alert"]);
        alert("Click the extension and set a Confluence URL");
      } else {
        _gaq.push(["_trackEvent", "omnibox", "success"]);
        chrome.tabs.create({ url: `${siteUrl}/dosearchsite.action?queryString=${encodeURIComponent(text)}` }, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          }
        });
      }
    })
    .catch((err) => {
      console.error(err);
      _gaq.push(["_trackEvent", "omnibox", "error"]);
    });
};

if (!chrome.runtime.onInstalled.hasListener(installHandler)) {
  chrome.runtime.onInstalled.addListener(installHandler);
}

if (!chrome.omnibox.onInputEntered.hasListener(searchHandler)) {
  chrome.omnibox.onInputEntered.addListener(searchHandler);
}

import { Category, trackEvent } from "./analytics";
import { getSiteUrl } from "./storage";

const installHandler = (details: chrome.runtime.InstalledDetails): void => {
  trackEvent({ category: Category.Config, action: "install", label: details.reason });
  if (details.reason !== "install") {
    // no need to show notification
    return;
  }
  // in fact, nobody wants to see the notification
  // trackEvent({ category: Category.Notification, action: "shown" });
  // chrome.notifications.create(
  //   "new-install-notification",
  //   {
  //     type: "basic",
  //     iconUrl: "images/connie-128.png",
  //     title: "Confluence Quick Search",
  //     message: "Click me and set a hotkey...",
  //     contextMessage: "Keyboard shortcut",
  //     requireInteraction: true,
  //   },
  //   (id) => {
  //     if (chrome.runtime.lastError) {
  //       console.error(chrome.runtime.lastError.message);
  //     }
  //     chrome.notifications.onClicked.addListener(() => {
  //       if (chrome.runtime.lastError) {
  //         console.error(chrome.runtime.lastError.message);
  //       }
  //       trackEvent({ category: Category.Notification, action: "clicked" });
  //       chrome.tabs.create({ url: "chrome://extensions/shortcuts" }, ({ windowId }) => {
  //         chrome.windows.update(windowId, { focused: true }, () => {
  //           chrome.notifications.clear(id);
  //         });
  //       });
  //     });
  //   },
  // );
};

const searchHandler = (text) => {
  trackEvent({ category: Category.Omnibox, action: "submit" });
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError.message);
  }
  getSiteUrl()
    .then((siteUrl) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      }
      if (!siteUrl) {
        trackEvent({ category: Category.Omnibox, action: "alert" });
        alert("Click the extension and set a Confluence URL");
      } else {
        trackEvent({ category: Category.Omnibox, action: "pending" });
        chrome.tabs.create({ url: `${siteUrl}/dosearchsite.action?queryString=${encodeURIComponent(text)}` }, () => {
          trackEvent({ category: Category.Omnibox, action: "success" });
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          }
        });
      }
    })
    .catch((err) => {
      console.error(err);
      trackEvent({ category: Category.Omnibox, action: "error" });
    });
};

if (!chrome.runtime.onInstalled.hasListener(installHandler)) {
  chrome.runtime.onInstalled.addListener(installHandler);
}

if (!chrome.omnibox.onInputEntered.hasListener(searchHandler)) {
  chrome.omnibox.onInputEntered.addListener(searchHandler);
}

// todo: update to push to GA4 API. https://developer.chrome.com/docs/extensions/how-to/integrate/google-analytics-4

// export const TRACKING_ID = "UA-152084023-1";

// export const _gaq = {
//   push: (args: Array<string | number>): void => {
//     window._gaq = window._gaq || ([] as GoogleAnalyticsCode);
//     window._gaq.push(args);
//   },
// };

// export const init = (trackingId: string): void => {
//   const ga = document.createElement("script");
//   ga.type = "text/javascript";
//   ga.async = true;
//   ga.src = "https://ssl.google-analytics.com/ga.js";
//   const ss = document.getElementsByTagName("script");
//   if (ss.length >= 1) {
//     const s = ss[0];
//     s.parentNode.insertBefore(ga, s);
//   }

//   _gaq.push(["_setAccount", trackingId]);
//   _gaq.push(["_trackPageview"]);
// };

export interface GAEvent {
  category: string;
  action: string;
  label?: string;
  value?: string;
}

export const trackEvent = ({ category, action, label, value }: GAEvent): void => {
  // const event: Array<string | number> = ["_trackEvent", category, action];
  // if (label) event.push(label);
  // if (value) event.push(parseInt(value));
  // if (value && !label) {
  //   console.error("label is missing. label required when using value");
  //   return;
  // }
  // _gaq.push(event);
};

export enum Category {
  Config = "config",
  Notification = "notification",
  Omnibox = "omnibox",
  Popup = "popup",
  Storage = "storage",
}

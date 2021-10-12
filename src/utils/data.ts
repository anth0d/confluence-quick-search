import { Category, trackEvent } from "../analytics";

export const saveSiteUrl = async (siteUrl: string): Promise<void> => {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.set({ siteUrl }, resolve);
  });
};

export const getSiteUrl = async (): Promise<string> => {
  const url = await getString("siteUrl");
  if (url) {
    if (url.endsWith("/")) {
      // emit a metric to help avoid breaking things in the future
      trackEvent({ category: Category.Storage, action: "siteUrlTrailingSlash" });
    }
    // trim trailing slash if present
    return url.replace(/\/$/, "");
  }
  const fallback = await getString("confluenceUrl");
  if (fallback) {
    // emit a metric to help avoid breaking things in the future
    trackEvent({ category: Category.Storage, action: "confluenceUrlExists" });
    return `https://${fallback}/wiki`;
  }
  // default
  return "";
};

// one limitation is this only gets stringified data.
export const getString = async (key: string): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, function (data) {
      if (!data[key]) {
        return resolve("");
      }
      trackEvent({ category: Category.Storage, action: key });
      return resolve(data[key]);
    });
  });
};

import { _gaq } from "../analytics";

export const saveSiteUrl = async (siteUrl: string): Promise<void> => {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.set({ siteUrl }, resolve);
  });
};

export const getSiteUrl = async (): Promise<string> => {
  const url = await getString("siteUrl");
  if (url) {
    return url;
  }
  const fallback = await getString("confluenceUrl");
  if (fallback) {
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
      _gaq.push(["_trackEvent", "data", key]);
      return resolve(data[key]);
    });
  });
};

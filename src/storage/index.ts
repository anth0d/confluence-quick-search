// import browser from "webextension-polyfill";

const SITE_URL_KEY = "siteUrl";
const DEPRECATED_WIKILESS_SITE_URL_KEY = "confluenceUrl";

export const saveSiteUrl = async (url: string): Promise<void> => {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.set({ [SITE_URL_KEY]: url }, resolve);
  });
};

export const getSiteUrl = async (): Promise<string> => {
  const url = await getString(SITE_URL_KEY);
  if (url) {
    // trim trailing slash if present
    return url.replace(/\/$/, "");
  }
  const fallback = await getString(DEPRECATED_WIKILESS_SITE_URL_KEY);
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
      return resolve(data[key]);
    });
  });
};

// const get = async (key: string): Promise<any> => {
//   const value = await browser.storage.sync.get(key);
//   if (!value) {
//     return;
//   }
//   return value[key];
// };

// const set = async (key: string, value: any): Promise<void> => {
//   return browser.storage.sync.set({ [key]: value });
// };

// export const getUrl = async (): Promise<string> => {
//   try {
//     const url = await get(SITE_URL_KEY);
//     console.log(`SITE_URL_KEY: ${SITE_URL_KEY}, url: ${url}`);
//     if (url) {
//       return url.replace(/\/$/, ""); // trim trailing slash, if present
//     }
//   } catch (e) {
//     console.error(`error reading site configuration: ${e}`);
//   }
//   try {
//     const url = await get(DEPRECATED_WIKILESS_SITE_URL_KEY);
//     console.log(`DEPRECATED_WIKILESS_SITE_URL_KEY: ${DEPRECATED_WIKILESS_SITE_URL_KEY}, url: ${url}`);
//     if (url) {
//       setUrl(`https://${url}/wiki`);
//       return `https://${url}/wiki`;
//     }
//   } catch (e) {
//     console.error(`error reading old configuration: ${e}`);
//   }
//   return "";
// };

// export const setUrl = async (url: string): Promise<void> => {
//   return set(SITE_URL_KEY, url);
// };

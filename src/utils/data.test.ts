/**
 * @jest-environment jsdom
 */

import { getSiteUrl } from "./data";

interface Extension {
  chrome: {
    storage: {
      sync: {
        get: (key: string, callback: (any) => void) => void;
      };
    };
  };
}

const setup = ({ sOutput, cOutput }) => {
  (global as Extension).chrome = {
    storage: {
      sync: {
        get: (key: string, cb: (any) => void) => {
          switch (key) {
            case "siteUrl":
              cb({ siteUrl: sOutput });
              break;
            case "confluenceUrl":
              cb({ confluenceUrl: cOutput });
          }
        },
      },
    },
  };
};

describe("getSiteUrl", () => {
  test("no data", async () => {
    setup({ sOutput: "", cOutput: "" });
    expect(await getSiteUrl()).toBe("");
  });

  test("existing confluenceUrl", async () => {
    setup({ sOutput: "", cOutput: "love.atlassian.net" });
    expect(await getSiteUrl()).toBe("https://love.atlassian.net/wiki");
  });

  test("existing siteUrl", async () => {
    setup({ sOutput: "https://mysite.com/confluence", cOutput: "sdf" });
    expect(await getSiteUrl()).toBe("https://mysite.com/confluence");
  });

  test("existing url with trailing slash", async () => {
    setup({ sOutput: "https://mysite.com/wiki/", cOutput: "sdf" });
    expect(await getSiteUrl()).toBe("https://mysite.com/wiki");
  });
});

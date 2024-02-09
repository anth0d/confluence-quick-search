/**
 * @jest-environment jsdom
 */

import { getSiteUrl } from ".";

interface Extension {
  // browser: {
  //   storage: {
  //     sync: {
  //       get(keys?: null | string | string[] | Record<string, string>): Promise<Record<string, string>>;
  //       set(items: Record<string, string>): Promise<void>;
  //     };
  //   };
  // };
  chrome: {
    storage: {
      sync: {
        get: (key: string, callback: (any) => void) => void;
      };
    };
  };
}

const setup = ({ sOutput, cOutput }) => {
  // (global as unknown as Extension).browser = {
  //   storage: {
  //     sync: {
  //       get: async (key: string) => {
  //         switch (key) {
  //           case "siteUrl":
  //             return { siteUrl: sOutput };
  //           case "confluenceUrl":
  //             return { confluenceUrl: cOutput };
  //         }
  //       },
  //       set: async (items: any) => {
  //         return;
  //       },
  //     },
  //   },
  // };
  (global as unknown as Extension).chrome = {
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

// describe("getUrl", () => {
//   test("no data", async () => {
//     setup({ sOutput: "", cOutput: "" });
//     expect(await getUrl()).toBe("");
//   });

//   test("existing confluenceUrl", async () => {
//     setup({ sOutput: "", cOutput: "love.atlassian.net" });
//     expect(await getUrl()).toBe("https://love.atlassian.net/wiki");
//   });

//   test("existing siteUrl", async () => {
//     setup({ sOutput: "https://mysite.com/confluence", cOutput: "sdf" });
//     expect(await getUrl()).toBe("https://mysite.com/confluence");
//   });

//   test("existing url with trailing slash", async () => {
//     setup({ sOutput: "https://mysite.com/wiki/", cOutput: "sdf" });
//     expect(await getUrl()).toBe("https://mysite.com/wiki");
//   });
// });

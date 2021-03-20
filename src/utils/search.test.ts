import { enableFetchMocks } from "jest-fetch-mock";
import { SearchResultProps } from "../components/SearchResult";

import { ErrorCondition, searchRequest } from "./search";

enableFetchMocks();

test("happy path search", async () => {
  const BASE_URL = "http://fake";
  const expected: SearchResultProps = {
    name: "Page Name",
    space: "The Space",
    resultLink: `${BASE_URL}/spaces/SPACE/pages/12345/Page+Name`,
  };
  fetchMock.mockResponseOnce(
    JSON.stringify({
      results: [
        {
          content: {
            title: expected.name,
          },
          resultGlobalContainer: {
            title: expected.space,
          },
          title: expected.name,
          excerpt: "Lorem ipsum",
          url: expected.resultLink.replace(BASE_URL, ""),
        },
        // unusable result often included from Confluence API
        // expected to be filtered out by the response handler
        {
          resultGlobalContainer: {
            title: expected.space,
          },
          title: expected.name,
          excerpt: "Not a good result",
          url: expected.resultLink.replace(BASE_URL, ""),
        },
      ],
    }),
    { status: 200 },
  );
  const result = await searchRequest(BASE_URL, "foo");
  expect(result.isErr()).toBeFalsy();
  expect(result.isOk()).toBeTruthy();
  result.map((results) => {
    expect(results.length).toBe(1);
    expect(results[0]).toEqual(expected);
  });
});

test("site not found", async () => {
  const BASE_URL = "http://fake";
  fetchMock.mockResponseOnce(JSON.stringify({}), { status: 404 });
  const result = await searchRequest(BASE_URL, "foo");
  expect(result.isErr()).toBeTruthy();
  expect(result.isOk()).toBeFalsy();
  result.mapErr((err) => {
    expect(err).toBe(ErrorCondition.NotFound);
  });
});

test("unauthenticated", async () => {
  const BASE_URL = "http://fake";
  fetchMock.mockResponseOnce(JSON.stringify({}), { status: 401 });
  const result = await searchRequest(BASE_URL, "foo");
  expect(result.isErr()).toBeTruthy();
  expect(result.isOk()).toBeFalsy();
  result.mapErr((err) => {
    expect(err).toBe(ErrorCondition.Unauthenticated);
  });
});

test("default error", async () => {
  const BASE_URL = "http://fake";
  fetchMock.mockResponseOnce(JSON.stringify({}), { status: 499 });
  const result = await searchRequest(BASE_URL, "foo");
  expect(result.isErr()).toBeTruthy();
  expect(result.isOk()).toBeFalsy();
  result.mapErr((err) => {
    expect(err).toBe(ErrorCondition.Default);
  });
});

test("no uncaught exception", async () => {
  const BASE_URL = "http://fake";
  const err = new Error("(intentional test error)");
  fetchMock.mockRejectOnce(err);
  const result = await searchRequest(BASE_URL, "foo");
  expect(result.isErr()).toBeTruthy();
  expect(result.isOk()).toBeFalsy();
  result.mapErr((err) => {
    expect(err).toBe(ErrorCondition.Default);
  });
});

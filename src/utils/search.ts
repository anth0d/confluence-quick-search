import { ok, err, Result } from "neverthrow";

import { SearchResultProps } from "../components/SearchResult";

export enum ErrorCondition {
  NoError,
  Default,
  Unauthenticated,
  NotFound,
}

export const searchRequest = async (
  BASE_URL: string,
  search: string,
): Promise<Result<SearchResultProps[], ErrorCondition>> => {
  try {
    const searchUrl = `${BASE_URL}/rest/api/search?cql=siteSearch+~+${encodeURIComponent(`"${search}"`)}`;
    const response = await fetch(searchUrl);
    switch (response.status) {
      case 401:
        return err(ErrorCondition.Unauthenticated);
      case 404:
        return err(ErrorCondition.NotFound);
    }
    if (!response.ok) {
      return err(ErrorCondition.Default);
    }
    const { results } = await response.json();
    const pages: SearchResultProps[] = [];
    for (const result of results) {
      if (result.content) {
        pages.push({
          name: result.content.title,
          space: result.resultGlobalContainer?.title,
          resultLink: `${BASE_URL}${result.url}`,
        });
      }
    }
    return ok(pages);
  } catch (fetchError) {
    console.dir(fetchError);
    return err(ErrorCondition.Default);
  }
};

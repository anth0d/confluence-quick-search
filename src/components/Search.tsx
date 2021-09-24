import React, { ReactElement, useState } from "react";

import SearchError from "./SearchError";
import { mapSearchResults } from "./SearchResult";
import TextInput from "./TextInput";

import { Category, trackEvent } from "../analytics";
import { searchRequest } from "../utils/search";

type SearchProps = {
  siteUrl: string;
};

export default function Search(props: SearchProps): ReactElement {
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const submit = (query: string) => {
    trackEvent({ category: Category.Popup, action: "search-submitted" });
    searchRequest(props.siteUrl, query).then((result) => {
      if (result.isErr()) {
        trackEvent({ category: Category.Popup, action: "search-failed" });
        return setSearchError(result.error);
      }
      trackEvent({ category: Category.Popup, action: "result-shown" });
      if (result.value.length === 0) {
        trackEvent({ category: Category.Popup, action: "result-empty" });
      }
      setSearchResults(result.value);
      setSearchError(null);
    });
  };

  return (
    <>
      <TextInput iconPath="images/search.svg" onSubmit={submit} placeholder="Search Confluence..." />
      <br />
      {searchError !== null ? (
        <SearchError siteUrl={props.siteUrl} error={searchError} />
      ) : (
        mapSearchResults(searchResults)
      )}
      <br />
    </>
  );
}

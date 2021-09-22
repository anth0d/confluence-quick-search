import React, { ReactElement, useState } from "react";

import SearchError from "./SearchError";
import { mapSearchResults } from "./SearchResult";
import TextInput from "./TextInput";

import { trackEvent } from "../analytics";
import { searchRequest } from "../utils/search";

type SearchProps = {
  siteUrl: string;
};

export default function Search(props: SearchProps): ReactElement {
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const submit = (query: string) => {
    trackEvent({ category: "search", action: "submitted" });
    searchRequest(props.siteUrl, query).then((result) => {
      if (result.isErr()) {
        trackEvent({ category: "search", action: "failed" });
        return setSearchError(result.error);
      }
      trackEvent({ category: "searchresult", action: "shown" });
      if (result.value.length === 0) {
        trackEvent({ category: "searchresult", action: "empty" });
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

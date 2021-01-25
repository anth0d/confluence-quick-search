import React, { ReactElement, useState } from "react";

import SearchError from "./SearchError";
import { mapSearchResults } from "./SearchResult";
import TextInput from "./TextInput";

import { _gaq } from "../analytics";
import { searchRequest } from "../utils/search";

type SearchProps = {
  siteUrl: string;
};

export default function Search(props: SearchProps): ReactElement {
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const submit = (query: string) => {
    _gaq.push(["_trackEvent", "search", "submitted"]);
    searchRequest(props.siteUrl, query).then((result) => {
      if (result.isErr()) {
        _gaq.push(["_trackEvent", "search", "failed"]);
        return setSearchError(result.error);
      }
      _gaq.push(["_trackEvent", "searchresult", "shown"]);
      if (result.value.length === 0) {
        _gaq.push(["_trackEvent", "searchresult", "empty"]);
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

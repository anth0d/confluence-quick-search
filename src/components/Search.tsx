import React, { ReactElement, useState } from 'react';

import SearchError from './SearchError';
import { mapSearchResults } from './SearchResult';
import TextInput from './TextInput';

import { searchRequest } from '../utils/search';

type SearchProps = {
  siteUrl: string;
};

export default function Search(props: SearchProps): ReactElement {
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const submit = (query: string) => {
    searchRequest(props.siteUrl, query).then(result => {
      if (result.isErr()) {
        return setSearchError(result.error);
      }
      setSearchResults(result.value);
      setSearchError(null);
    });
  }

  return <>
    <TextInput
      iconPath="images/search.svg"
      onSubmit={submit}
      placeholder="Search Confluence..."
    />
    <br />
    {
      searchError !== null
      ? <SearchError siteUrl={props.siteUrl} error={searchError} />
      : mapSearchResults(searchResults)
    }
    <br />
  </>;
}

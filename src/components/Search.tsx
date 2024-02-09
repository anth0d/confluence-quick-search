import React, { useState } from "react";
import browser from "webextension-polyfill";

import SearchError from "./SearchError";
import { mapSearchResults } from "./SearchResult";
import TextInput from "./TextInput";

import { Category, trackEvent } from "../analytics";
import { searchRequest } from "../search";

type SearchProps = {
  siteUrl: string;
};

export default function Search(props: SearchProps): React.ReactElement {
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const submit = (query: string) => {
    trackEvent({ category: Category.Popup, action: "submit" });
    browser.permissions
      .request({ origins: [`${props.siteUrl.replace(new RegExp("/wiki$"), "")}/*`] })
      .then((allowed) => {
        searchRequest(props.siteUrl, query).then((result) => {
          if (result.isErr()) {
            trackEvent({ category: Category.Popup, action: "error" });
            return setSearchError(result.error);
          }
          if (result.value.length === 0) {
            trackEvent({ category: Category.Popup, action: "empty" });
          } else {
            trackEvent({
              category: Category.Popup,
              action: "success",
              label: "results",
              value: result.value.length.toString(),
            });
          }
          setSearchResults(result.value);
          setSearchError(null);
        });
      });
  };

  return (
    <>
      <TextInput iconData={iconData} onSubmit={submit} placeholder="Search Confluence..." />
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

// todo: i'm not entirely sure how this differs from encodeURI(), but this site helps: https://yoksel.github.io/url-encoder/
const iconData = `%3Csvg width='100%25' height='100%25' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7C12 8.15126 11.6109 9.21164 10.9571 10.0568L13.5846 12.7302C13.8427 12.9928 13.839 13.4149 13.5764 13.673C13.3139 13.9311 12.8918 13.9274 12.6337 13.6648L10.0086 10.9939C9.17144 11.6255 8.12945 12 7 12ZM10.6667 7C10.6667 9.02504 9.02504 10.6667 7 10.6667C4.97496 10.6667 3.33333 9.02504 3.33333 7C3.33333 4.97496 4.97496 3.33333 7 3.33333C9.02504 3.33333 10.6667 4.97496 10.6667 7Z' fill='currentColor'%3E%3C/path%3E%3Cmask id='mask0' mask-type='alpha' maskUnits='userSpaceOnUse' x='2' y='2' width='12' height='12'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7C12 8.15126 11.6109 9.21164 10.9571 10.0568L13.5846 12.7302C13.8427 12.9928 13.839 13.4149 13.5764 13.673C13.3139 13.9311 12.8918 13.9274 12.6337 13.6648L10.0086 10.9939C9.17144 11.6255 8.12945 12 7 12ZM10.6667 7C10.6667 9.02504 9.02504 10.6667 7 10.6667C4.97496 10.6667 3.33333 9.02504 3.33333 7C3.33333 4.97496 4.97496 3.33333 7 3.33333C9.02504 3.33333 10.6667 4.97496 10.6667 7Z' fill='currentColor'%3E%3C/path%3E%3C/mask%3E%3Cg mask='url(%23mask0)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 16H16V0H0V16Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E`;

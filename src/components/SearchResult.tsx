import React from "react";

import { Category, trackEvent } from "../analytics";

export type SearchResultProps = {
  name: string;
  space: string;
  resultLink: string;
};

export function mapSearchResults(list?: SearchResultProps[]): React.ReactElement {
  if (!list) {
    return <></>;
  }
  if (list.length === 0) {
    return (
      <p>
        <em>No results</em>
      </p>
    );
  }
  return (
    <>
      {list.map((r: SearchResultProps, i: number) => {
        return (
          <p key={i}>
            <SearchResult {...r} />
          </p>
        );
      })}
    </>
  );
}

export default function SearchResult(props: SearchResultProps): React.ReactElement {
  return (
    <>
      <a
        href={props.resultLink}
        title={props.resultLink}
        rel="noreferrer"
        target="_blank"
        style={{
          display: "inline-block",
          textAlign: "start",
          margin: "0em",
          font: "400 11px system-ui",
        }}
        onClick={() => trackEvent({ category: Category.Popup, action: "click", label: "result" })}
      >
        <span
          style={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "1.4em",
          }}
        >
          {props.name}
        </span>
        <span
          style={{
            fontSize: "1.2em",
          }}
        >
          {props.space || ""}
        </span>
      </a>
    </>
  );
}

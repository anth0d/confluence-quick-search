import React, { ReactElement } from 'react';

export type SearchResultProps = {
  name: string;
  space: string;
  resultLink: string;
};

export function mapSearchResults(list: SearchResultProps[]): ReactElement {
  return <>
    {list.map((r: SearchResultProps, i: number) => {
      return <p key={i}>
        <SearchResult {...r} />
      </p>;
    })}
  </>;
}

export default function SearchResult(props: SearchResultProps): ReactElement {
  return <>
    <a
      href={props.resultLink}
      title={props.resultLink}
      rel="noreferrer"
      target="_blank"
      style={{
        display: 'inline-block',
        textAlign: 'start',
        margin: '0em',
        font: '400 11px system-ui',
      }}
      // onClick={() => _gaq.push[]}
    >
      <span style={{
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '1.4em',
      }}>{props.name}</span>
      <span style={{
        fontSize: '1.2em',
      }}>{props.space || ''}</span>
    </a>
  </>;
}

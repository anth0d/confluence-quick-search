import React, { ReactElement, useState } from 'react';

type SearchInputProps = {
  placeholder: string;
  siteUrl?: string;
};

type SearchResultProps = {
  name: string;
  space: string;
  resultLink: string;
};

const searchRequest = async (BASE_URL, search): Promise<SearchResultProps[]> => {
  try {
    const searchUrl = `${BASE_URL}/rest/api/search?cql=siteSearch+~+${encodeURIComponent(`"${search}"`)}`;
    const response = await fetch(searchUrl);
    const { results } = await response.json();
    const pages: SearchResultProps[] = [];
    for (const result of results) {
      pages.push({
        name: result.content.title,
        space: result.resultGlobalContainer.title,
        resultLink: `${BASE_URL}${result.url}`,
      });
    }
    return pages;
  } catch (fetchError) {
    console.error(fetchError);
    return [];
  }
};

function SearchInput(props: SearchInputProps): ReactElement {
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = evt => {
    evt.preventDefault();
    searchRequest(props.siteUrl, userInput).then(setResults);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
          {/* <SearchIcon /> */}
          <input 
            autoFocus
            // disabled={props.siteUrl ? false : true}
            type="text"
            placeholder={props.placeholder}
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            style={{
              width: '100%',
              backgroundImage: 'url(images/search.svg)',
              backgroundRepeat: 'no-repeat',
              paddingLeft: '28px',
              border: '0',
              outline: 'none',
              fontSize: '1.4em',
            }}
          />
      </form>
      <br />
      <div>{results.map((r: SearchResultProps, i: number) => {
        return <p key={i}>
          <a
            href={r.resultLink}
            title={r.resultLink}
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
            }}>{r.name}</span>
            <span style={{
              fontSize: '1.2em',
            }}>{r.space || ''}</span>
          </a>
        </p>;
      })}</div>
      <br />
    </>
  );
}

export default SearchInput;

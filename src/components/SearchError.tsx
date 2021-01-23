import React, { ReactElement } from "react";

import { ErrorCondition } from "../utils/search";

type SearchErrorProps = {
  error: ErrorCondition;
  siteUrl: string;
};

export default function SearchError(props: SearchErrorProps): ReactElement {
  const { error, siteUrl } = props;

  let message: string;
  switch (error) {
    case ErrorCondition.Default:
      message =
        "Error! Check that this URL is correct. Include https:// and /wiki if missing. Then, visit your Confluence site and log in.";
      break;
    case ErrorCondition.Unauthenticated:
      message = "Error! Visit your site and log in.";
      break;
    case ErrorCondition.NotFound:
      message = "Error! Check for errors in your URL. Include https:// and /wiki if missing. Then, retry search.";
      break;
  }

  return (
    <div
      style={{
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "1.4em",
      }}
    >
      <p>
        <span>{message}</span>
      </p>
      <p>
        <a
          href={siteUrl}
          title={siteUrl}
          rel="noreferrer"
          target="_blank"
          // onClick={_gaq.push([])}
        >
          {siteUrl}
        </a>
      </p>
    </div>
  );
}

import React, { ReactElement } from "react";

import { trackEvent } from "../analytics";
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
        "Error! Check that this is the correct Confluence URL. (Include /wiki if needed.) Then, visit your Confluence site and log in.";
      break;
    case ErrorCondition.Unauthenticated:
      message = "Error! Visit your site and log in.";
      break;
    case ErrorCondition.NotFound:
      message = "Error! Check that this is the correct Confluence URL. (Include /wiki if needed.) Then, retry search.";
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
          onClick={() => trackEvent({ category: "searcherror", action: "clicked" })}
        >
          {siteUrl}
        </a>
      </p>
    </div>
  );
}

import React from "react";

import { Category, trackEvent } from "../analytics";
import { ErrorCondition } from "../search";

type SearchErrorProps = {
  error: ErrorCondition;
  siteUrl: string;
};

export default function SearchError(props: SearchErrorProps): React.ReactElement {
  const { error, siteUrl } = props;
  const defaultError = (
    <div>
      <p style={{ fontSize: "1.2em" }}>⚠️ Sorry, search failed.</p>
      <p>Please ensure that:</p>
      <ul style={{ fontSize: "1em" }}>
        <li style={{ marginBottom: 5 }}>
          The site url below is correct, including{" "}
          <span style={{ fontFamily: "monospace", display: "inline" }}>/wiki</span> if necessary.
          <br />
          <em style={{ fontSize: "-2" }}>
            <span style={{ fontFamily: "monospace", display: "inline" }}>e.g., myteam.atlassian.net/wiki</span>
          </em>
        </li>
        <li style={{ marginBottom: 5 }}>
          <span>You are </span>
          <a
            href={siteUrl}
            title={siteUrl}
            rel="noreferrer"
            target="_blank"
            onClick={() => trackEvent({ category: Category.Popup, action: "click", label: "error" })}
          >
            logged in
          </a>
          .
        </li>
        <li>In your browser extension settings, you have allowed this extension to access your site.</li>
      </ul>
    </div>
  );

  const notFoundError = (
    <div>
      <p style={{ fontSize: "1.2em" }}>🫣 Site not found.</p>
      <p>Check that this is the correct Confluence site url.</p>
      <p>
        (Include <span style={{ fontFamily: "monospace", display: "inline" }}>/wiki</span> if needed. Then, retry
        search.)
      </p>
    </div>
  );

  const unauthenticatedError = (
    <div>
      <p style={{ fontSize: "1.2em" }}>🔒 Unauthorized.</p>
      <p>
        <span>Log into </span>
        <a
          href={siteUrl}
          title={siteUrl}
          rel="noreferrer"
          target="_blank"
          onClick={() => trackEvent({ category: Category.Popup, action: "click", label: "error" })}
        >
          your Confluence site
        </a>
        <span> using this browser. Then, retry search.</span>
      </p>
    </div>
  );

  let Message: React.JSX.Element;
  switch (error) {
    case ErrorCondition.Default:
      Message = defaultError;
      break;
    case ErrorCondition.Forbidden:
      Message = defaultError;
      break;
    case ErrorCondition.NotFound:
      Message = notFoundError;
      break;
    case ErrorCondition.Unauthenticated:
      Message = unauthenticatedError;
      break;
    default:
      Message = defaultError;
      break;
  }
  // switch (error) {
  //   case ErrorCondition.Default:
  //     // message = (
  //     //   <>
  //     //     Search failed due to error. Some things to try: \nCheck that this is the correct Confluence URL. (Include
  //     //     /wiki if needed.) \nVisit your Confluence site and log in. \nEnsure your browser permissions allow this
  //     //     extension to access your site hostname."
  //     //   </>
  //     // );
  //     Message = genericError;
  //     break;
  //   case ErrorCondition.Forbidden:
  //     Message = <>Error: Log into your Confluence site and try again.</>;
  //     break;
  //   case ErrorCondition.Unauthenticated:
  //     Message = <>Error: Visit your site and log in.</>;
  //     break;
  //   case ErrorCondition.NotFound:
  //     Message = (
  //       <>Error: Check that this is the correct Confluence URL. (Include /wiki if needed.) Then, retry search.</>
  //     );
  //     break;
  // }

  return (
    <div
      style={{
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "1.4em",
      }}
    >
      {Message}
    </div>
  );
}

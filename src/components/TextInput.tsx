import React, { useState } from "react";

export type TextInputProps = {
  placeholder: string;
  onSubmit: (query: string) => void;
  iconData?: string; // e.g., "%3Csvg..."
  iconFile?: string; // e.g., "images/icon.svg"
  initialValue?: string;
  small?: boolean;
  withOutline?: boolean;
};

export default function TextInput(props: TextInputProps): React.ReactElement {
  const [userInput, setUserInput] = useState(props.initialValue || "");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.onSubmit(userInput);
  };

  let background = "";
  if (props.iconFile) {
    background = `url(${props.iconFile})`;
  } else if (props.iconData) {
    background = `url("data:image/svg+xml,${props.iconData}")`;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          type="text"
          placeholder={props.placeholder}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={{
            width: "95%",
            background: background,
            backgroundRepeat: "no-repeat",
            paddingLeft: background ? "28px" : "0",
            border: props.withOutline ? "" : "0",
            outline: props.withOutline ? "" : "none",
            fontSize: props.small ? "1.2em" : "1.4em",
          }}
        />
      </form>
    </>
  );
}

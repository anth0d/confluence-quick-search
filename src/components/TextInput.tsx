import React, { ReactElement, useState } from 'react';

export type TextInputProps = {
  placeholder: string;
  onSubmit: (query: string) => void;
  iconPath?: string;
  initialValue?: string;
  small?: boolean;
  withOutline?: boolean;
};

export default function TextInput(props: TextInputProps): ReactElement {
  const [userInput, setUserInput] = useState(props.initialValue || "");

  const handleSubmit = evt => {
    evt.preventDefault();
    props.onSubmit(userInput);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
          <input 
            autoFocus
            type="text"
            placeholder={props.placeholder}
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            style={{
              width: '95%',
              backgroundImage: props.iconPath ? `url(${props.iconPath})` : '',
              backgroundRepeat: 'no-repeat',
              paddingLeft: props.iconPath ? '28px' : '0',
              border: props.withOutline ? '' : '0',
              outline: props.withOutline ? '' : 'none',
              fontSize: props.small ? '1.2em' : '1.4em',
            }}
          />
      </form>
    </>
  );
}

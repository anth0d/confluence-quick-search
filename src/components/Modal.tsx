import React, { ReactElement, useEffect, useRef } from "react";

type ModalProps = {
  visible: boolean;
  onClickOutside: () => void;
};

function Modal(props: React.PropsWithChildren<ModalProps>): ReactElement {
  const { onClickOutside, visible } = props;

  const ref = useRef(null);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const handler = evt => {
      if (ref.current && !ref.current.contains(evt.target)) {
        onClickOutside();
      }
    };
    document.addEventListener("click", handler, false);
    return () => {
      document.removeEventListener("click", handler, false);
    };
  }, [onClickOutside, visible]);

  if (!visible) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.6)',
    }}>
      <div ref={ref} style={{
        position: 'fixed',
        background: 'white',
        width: '80%',
        height: 'auto',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        { props.children }
      </div>
    </div>
  );
}

export default Modal;

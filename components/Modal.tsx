import React from "react";

type Props = React.ComponentPropsWithRef<"div"> & {
  onClose: (e: React.MouseEvent) => void;
};

const Modal = (props: Props) => {
  return (
    <div
      id="modal_overlay"
      ref={props.ref}
      className="fixed z-50 inset-0 bg-black/80 w-screen h-screen flex justify-center items-center shrink"
      onClick={props.onClose}
    >
      <div className="absolute inset-1/8 flex items-center justify-center">
        {props.children}
      </div>
    </div>
  );
};

export default Modal;

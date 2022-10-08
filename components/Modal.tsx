import React from "react";

type Props = {
  children: React.ReactElement;
  onClose: (e: React.MouseEvent) => void 
};

const Modal = (props: Props) => {
  return (
    <div id="modal_overlay"className="fixed z-10 inset-0 bg-opacity-80 bg-black w-screen h-screen flex justify-center items-center shrink" onClick={props.onClose}>
      <div className="absolute inset-1/5 flex items-center justify-center">
        {props.children}
      </div>
    </div>
  );
};

export default Modal;

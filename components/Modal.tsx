import React, { useEffect, useRef } from "react";

type Props = {
  children: React.ReactElement;
  onClose: (e: React.MouseEvent) => void;
}

const Modal = React.forwardRef((props: Props, ref: React.Ref<HTMLDivElement>) => {
  return (
    <div
      id="modal_overlay"
      ref={ref}
      className="fixed z-50 inset-0 bg-opacity-80 bg-black w-screen h-screen flex justify-center items-center shrink"
      onClick={props.onClose}
    >
      <div className="animate-fade absolute inset-1/8 flex items-center justify-center">
        {props.children}
      </div>
    </div>
  );
});

export default Modal;

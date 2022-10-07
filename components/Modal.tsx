import React from "react";

type Props = {
  children: React.ReactElement
}

const Modal = (props: Props) => {
  return (
    <div className="fixed inset-0 bg-opacity-75 bg-black w-screen h-screen grid place-items-center">
      <div className="relative flex items-center justify-center w-1/2">
          {props.children}
      </div>
    
    </div>
  );
};

export default Modal;

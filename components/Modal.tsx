import React from "react";

type Props = React.ComponentPropsWithRef<"div"> & {
  onClose: (e: React.MouseEvent | KeyboardEvent) => void;
};

const Modal = (props: Props) => {

  // close on escape key
  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        props.onClose(e);
      }
    };
    window.addEventListener("keydown", handleEscapeKey);
  }, [props.onClose]);

  // Prevent scrolling on modal open
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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

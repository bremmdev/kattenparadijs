import React from "react";
import Avatar from "./Avatar";

const avatars = [
  { url: "/avatar/daantje.svg" },
  { url: "/avatar/flynn.svg" },
  { url: "/avatar/moos.svg" },
  { url: "/avatar/norris.svg" },
];

const Avatars = () => {
  return (
    <div className="flex gap-2 justify-center my-2 sm:my-0 sm:ml-auto">
      {avatars.map((avatar, idx) => (
        <Avatar key={idx} url={avatar.url} />
      ))}
    </div>
  );
};

export default Avatars;

import React from "react";
import Image from "next/image";
import Link from "next/link";

const avatars = [
  { src: "/avatar/daantje.svg", path: "/daantje" },
  { src: "/avatar/flynn.svg", path: "/flynn" },
  { src: "/avatar/moos.svg", path: "/moos" },
  { src: "/avatar/norris.svg", path: "/norris" },
  { src: "/avatar/cats.svg", path: "/all" },
];

const Avatars = () => {
  return (
    <div className="flex gap-3 justify-center my-2 sm:my-0 sm:ml-auto">
      {avatars.map((avatar, idx) => (
        <Link key={idx} href={avatar.path}>
          <a>
            <img
              className="transition-all duration-300 cursor-pointer hover:scale-110 hover:brightness-105"
              src={avatar.src}
              alt="cat avatar"
              width="42"
              height="42"
            />
          </a>
        </Link>
      ))}
    </div>
  );
};

export default Avatars;

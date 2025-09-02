import Link from "next/link";
import Image from "next/image";
import PassingIcon from "./PassingIcon";
import type { Route } from "next";

const avatars = [
  { src: "/avatar/daantje.svg", path: "/daantje" },
  { src: "/avatar/flynn.svg", path: "/flynn", passedAway: true },
  { src: "/avatar/moos.svg", path: "/moos", passedAway: true },
  { src: "/avatar/norris.svg", path: "/norris" },
  { src: "/avatar/cats.svg", path: "/all" },
  { src: "/avatar/cats-videos.svg", path: "/videos" },
];

const Avatars = () => {
  return (
    <div className="flex gap-3 justify-center my-2 sm:my-0 sm:ml-auto">
      {avatars.map((avatar, idx) => {
        return (
          <Link key={idx} href={avatar.path as Route} className="relative">
            {avatar.passedAway && (
              <PassingIcon className="absolute right-1 z-10" />
            )}
            <Image
              className={`${avatar.passedAway ? "opacity-50" : ""} transition-all duration-300 cursor-pointer hover:scale-110 hover:brightness-105`}
              src={avatar.src}
              alt="cat avatar"
              width="42"
              height="42"
            />
          </Link>
        );
      })}
    </div>
  );
};

export default Avatars;

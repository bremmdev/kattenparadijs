import Link from "next/link";
import Image from "next/image";

const avatars = [
  { src: "/avatar/daantje.svg", path: "/daantje" },
  { src: "/avatar/flynn.svg", path: "/flynn" },
  { src: "/avatar/moos.svg", path: "/moos" },
  { src: "/avatar/norris.svg", path: "/norris" },
  { src: "/avatar/cats.svg", path: "/all" },
  { src: "/avatar/cats-videos.svg", path: "/videos" },
];

const Avatars = () => {
  return (
    <div className="flex gap-3 justify-center my-2 sm:my-0 sm:ml-auto">
      {avatars.map((avatar, idx) => (
        <Link key={idx} href={avatar.path}>
            <Image
              className="transition-all duration-300 cursor-pointer hover:scale-110 hover:brightness-105"
              src={avatar.src}
              alt="cat avatar"
              width="42"
              height="42"
            />
        </Link>
      ))}
    </div>
  );
};

export default Avatars;

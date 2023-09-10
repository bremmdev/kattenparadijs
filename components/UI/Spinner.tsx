import Image from "next/image";
import Loading from "@/public/loading.svg";

type Props = {
  width?: number;
  height?: number;
}

const Spinner = ({ width, height }: Props) => {

  return (
    <Image src={Loading} className="animate-spin spinner" width={width || 24} height={height || 24} alt="" />
  );
};

export default Spinner;

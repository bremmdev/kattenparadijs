import NorrisBanner from "@/public/norris_banner.webp";
import DaantjeBanner from "@/public/daantje_banner.webp";
import MoosBanner from "@/public/moos_banner.webp";
import FlynnBanner from "@/public/flynn_banner.webp";
import { type Cat } from "@/types/types";

const banners = {
  daantje: DaantjeBanner,
  flynn: FlynnBanner,
  moos: MoosBanner,
  norris: NorrisBanner,
};

export const getBanner = (cat?: Cat) => {
  return cat ? banners[cat.name as keyof typeof banners] : null;
};

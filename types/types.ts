export interface Cat {
  name: string;
  birthDate: string;
  passingDate?: string;
  iconUrl: string;
  nicknames: Array<string>;
}

export interface ImageWithDimensions {
  cats: Array<Cat>;
  width: number;
  height: number;
  id: string;
  url: string;
  takenAt?: string;
  blurData: string;
}

export interface Video {
  cats: Array<Cat>;
  id: string;
  url: string;
  width: number;
  height: number;
  takenAt?: string;
}

export type CatName = "moos" | "norris" | "daantje" | "flynn";

export interface Cat {
  name: string;
  birthDate: string;
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
export interface Option {
  style: {
    default: {
      thumbnail: string;
      placeholder: string;
    };
    processed: {
      thumbnail: string;
      placeholder: string;
    };
  };
}

export type WpxFileType = 'picture' | 'video';
export type WpxFile = WpxPicture;
export interface WpxPicture {
  name: string;
  url: string;
  query?: string;
  process?: WpxPictureProcess;
  deleted?: boolean;
  categories: string[];
}

export interface WpxPictureProcess {
  mode: number;
  cut: { x: number; y: number; w: number; h: number };
  zoom: { w: number; h: number };
}

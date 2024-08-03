import { Any } from '@weplanx/ng';

export type RichtextData = {
  blocks: Block[];
  time: number;
  version: string;
} & null;

export interface Block {
  id: string;
  type: string;
  data: Any;
}

export type ResolveDone = (data: InputData) => void;

export interface InputData {
  assets: string;
  url: string;
}

export interface Config {
  resolve: (done: ResolveDone) => void;
  change: () => void;
}

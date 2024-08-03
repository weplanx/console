import { Any } from '@weplanx/ng';

export interface Dataset {
  name: string;
  type: string;
  keys: string[];
  sensitives: string[];
  status: boolean;
  event: boolean;
  options: Any;
}

export interface DatasetCreateDto {
  name: string;
  kind: string;
  option?: DatasetCreateOptionDto;
}

export interface DatasetCreateOptionDto {
  time: string;
  meta: string;
  expire: number;
}

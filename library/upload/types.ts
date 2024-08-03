import { NzUploadFile } from 'ng-zorro-antd/upload';

export interface Transport {
  name: string;
  percent: number;
  file: NzUploadFile;
}

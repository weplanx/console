import { Any } from '@weplanx/ng';

export interface LogsetJob {
  timestamp: Date;
  metadata: LogsetJobMetadata;
  headers: Any;
  body: Any;
  response: {
    status: number;
    body: Any;
  };
}

export interface LogsetJobMetadata {
  key: string;
  index: number;
  mode: string;
  url: string;
}

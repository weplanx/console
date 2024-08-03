import { Any } from '@weplanx/ng';

export interface LogsetImessage {
  timestamp: Date;
  metadata: LogsetImessageMetadata;
  payload: Any;
}

export interface LogsetImessageMetadata {
  client: string;
  topic: string;
}

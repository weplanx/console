import { Any } from '@weplanx/ng';

export interface LogsetOperate {
  timestamp: Date;
  metadata: LogsetOperateMetadata;
  params: string;
  body: Any;
  status: number;
  user_agent: string;
}

export interface LogsetOperateMetadata {
  client_ip: string;
  method: string;
  path: string;
  user_id: string;
}

import { Any } from '@weplanx/ng';

export interface Queue {
  project: string;
  name: string;
  description: string;
  subjects: string[];
  max_msgs?: number;
  max_bytes?: number;
  max_age?: number;
}

export interface QueueInfo {
  config: {
    allow_direct: boolean;
    description: string;
    discard: string;
    duplicate_window: number;
    max_age: number;
    max_bytes: number;
    max_consumers: number;
    max_msg_size: number;
    max_msgs: number;
    max_msgs_per_subject: number;
    mirror_direct: boolean;
    name: string;
    num_replicas: number;
    retention: string;
    storage: string;
    subjects: string[];
  };
  created: Date;
  state: {
    bytes: number;
    consumer_count: number;
    deleted: Any;
    first_seq: number;
    first_ts: Date;
    last_seq: number;
    last_ts: Date;
    messages: number;
    num_deleted: number;
    num_subjects: number;
    subjects: Any;
  };
}

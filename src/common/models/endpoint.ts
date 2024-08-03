import { Any } from '@weplanx/ng';

export interface Endpoint {
  name: string;
  kind: 'schedule' | 'emqx';
  schedule?: EndpointSchedule;
  emqx?: EndpointEmqx;
}

export interface EndpointSchedule {
  node: string;
}

export interface EndpointEmqx {
  host: string;
  api_key: string;
  secret_key: string;
}

export interface ScheduleState {
  status: boolean;
  jobs: ScheduleJob[];
}

export interface ScheduleJob {
  mode: string;
  spec: string;
  option: Any;
  schedule_state: { next: Date; prev: Date };
}

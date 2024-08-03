export interface Imessage {
  topic: string;
  rule?: string;
  description?: string;
  projects: string[];
}

export interface EmqxNode {
  node: string;
  node_status: string;
  uptime: number;
  version: string;
  connections: number;
  live_connections: number;
  load1: number;
  load5: number;
  load15: number;
}

export interface Info {
  topic: string;
  metrics: Metrics;
  create_time: Date;
}

export interface Metrics {
  'messages.dropped.count': number;
  'messages.dropped.rate': number;
  'messages.in.count': number;
  'messages.in.rate': number;
  'messages.out.count': number;
  'messages.out.rate': number;
  'messages.qos0.in.count': number;
  'messages.qos0.in.rate': number;
  'messages.qos0.out.count': number;
  'messages.qos0.out.rate': number;
  'messages.qos1.in.count': number;
  'messages.qos1.in.rate': number;
  'messages.qos1.out.count': number;
  'messages.qos1.out.rate': number;
  'messages.qos2.in.count': number;
  'messages.qos2.in.rate': number;
  'messages.qos2.out.count': number;
  'messages.qos2.out.rate': number;
}

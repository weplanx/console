export interface Cluster {
  name: string;
  kind: 'kubernetes' | 'agent';
  config: string;
  admin?: boolean;
}

export interface ClusterInfo {
  version: string;
  nodes: number;
  cpu: number;
  mem: number;
  storage: number;
}

export interface ClusterNode {
  name: string;
  create: Date;
  hostname: string;
  ip: string;
  version: string;
  cpu: number;
  mem: number;
  storage: number;
  os: string;
  architecture: string;
}

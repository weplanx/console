export interface Project {
  name: string;
  namespace: string;
  kind: string;
  expire: Date;
  secret_id?: string;
  secret_key?: string;
  entry?: string[];
  cluster?: string;
  nats?: ProjectNats;
  redis?: ProjectRedis;
  status: boolean;
}

export interface ProjectNats {
  nkey: string;
}

export interface ProjectRedis {
  url: string;
  auth: string;
}

export interface TenantsResult {
  nkey?: string;
  redis_host?: string;
  redis_auth?: string;
}

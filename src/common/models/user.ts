import { LogsetLogin } from '@common/models/logset-login';

export interface User {
  email: string;
  password: string;
  roles: string[];
  name: string;
  avatar: string;
  phone?: string;
  totp?: string;
  lark?: UserLark;
  sessions?: number;
  history?: LogsetLogin;
  status: boolean;
}

export interface UserLark {
  access_token: string;
  token_type: string;
  expires_in: number;
  name: string;
  en_name: string;
  avatar_url: string;
  avatar_thumb: string;
  avatar_middle: string;
  avatar_big: string;
  open_id: string;
  union_id: string;
  email: string;
  enterprise_email: string;
  user_id: string;
  mobile: string;
  tenant_key: string;
  refresh_expires_in: number;
  refresh_token: string;
  sid: string;
}

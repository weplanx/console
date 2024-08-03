export interface LoginDto {
  email: string;
  password: string;
}
export interface SetUserDto {
  key: Omit<keyof SetUserDto, 'key'>;
  email?: string;
  name?: string;
  avatar?: string;
}
export type UnsetUserKey = 'phone' | 'totp' | 'lark';
export interface CollaborationOption {
  url: string;
  redirect: string;
  app_id: string;
}

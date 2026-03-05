export interface LoginReq {
  email: string;
  password: string;
}

export interface LoginRes {
  access_token: string;
  refresh_token: string;
  token_type?: string;
}

export interface UserProfileRes {
  id: string;
  email: string;
  name: string;
  is_admin?: boolean;
}

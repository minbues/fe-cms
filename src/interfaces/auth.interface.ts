export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IUser {
  role: string | number;
  id: number;
}

export interface Auth {
  token: string | null;
  refreshToken: string | null;
  tokenExpires: number | null;
  refreshExpires: number | null;
}

export interface IAuthResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  refreshExpires: number;
}

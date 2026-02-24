import { authStorage, post } from "./apiClient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export async function login(body: LoginRequest): Promise<TokenResponse> {
  const data = await post<TokenResponse>("/api/auth/login", body);
  authStorage.setAccessToken(data.access_token);
  authStorage.setRefreshToken(data.refresh_token);
  return data;
}

export function logoutLocal(): void {
  authStorage.clear();
}

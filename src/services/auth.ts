import { authStorage, post } from "./apiClient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type?: string;
}

export async function login(body: LoginRequest): Promise<TokenResponse> {
  if (
    import.meta.env.DEV &&
    body.email === "test@itcen.com" &&
    body.password === "1234"
  ) {
    const mock: TokenResponse = { access_token: "dev-token", refresh_token: "dev-refresh" };
    authStorage.setAccessToken(mock.access_token);
    authStorage.setRefreshToken(mock.refresh_token);
    return mock;
  }

  const data = await post<TokenResponse>("/api/auth/login", body);
  authStorage.setAccessToken(data.access_token);
  authStorage.setRefreshToken(data.refresh_token);
  return data;
}

export async function logout(): Promise<void> {
  const refreshToken = authStorage.getRefreshToken();
  if (refreshToken) {
    try {
      await post<void>("/api/auth/logout", { refresh_token: refreshToken });
    } catch {
      // 토큰이 만료되었어도 로컬 스토리지는 정리
    }
  }
  authStorage.clear();
}

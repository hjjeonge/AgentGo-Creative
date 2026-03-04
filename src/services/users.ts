import { get } from "./apiClient";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  is_admin?: boolean;
}

export async function getMyProfile(): Promise<UserProfile> {
  return get<UserProfile>("/api/users/me");
}

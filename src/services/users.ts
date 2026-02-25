import { get } from "./apiClient";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export async function getMyProfile(): Promise<UserProfile> {
  return get<UserProfile>("/api/users/me");
}
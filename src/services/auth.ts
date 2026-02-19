import { api } from "./api";

type LoginResponse = {
  token?: string;
  accessToken?: string;
};

export async function login(username: string, password: string): Promise<void> {
  const { data } = await api.post<LoginResponse>("/api/auth/login", {
    username,
    password,
  });

  const token = data.token ?? data.accessToken;
  if (!token) throw new Error("API não retornou token");

  localStorage.setItem("auth_token", token);
}

export function logout(): void {
  localStorage.removeItem("auth_token");
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("auth_token");
}

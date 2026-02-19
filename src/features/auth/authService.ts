import { api } from "../../services/api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string; // ajuste aqui se o backend retornar outro nome (ex: accessToken)
  // pode vir mais coisa, tipo user, expiresIn, etc
};

export async function login(req: LoginRequest): Promise<LoginResponse> {
  // ajuste o caminho se seu swagger tiver /api/Users/login, etc
  const { data } = await api.post<LoginResponse>("/api/users/login", req);
  return data;
}
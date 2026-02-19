import { api } from "../services/api";
import type { StudentListItemDto, StudentCreateRequest, StudentUpdateRequest } from "./students.types";

export async function getStudentsList(): Promise<StudentListItemDto[]> {
  const { data } = await api.get<StudentListItemDto[]>("/api/students");
  return data ?? [];
}

export async function createStudent(payload: StudentCreateRequest): Promise<void> {
  await api.post("/api/students", payload);
}

export async function deleteStudent(id: number): Promise<void> {
  await api.delete(`/api/students/${id}`);
}

export async function getStudentById(id: number) {
  const { data } = await api.get(`/api/students/${id}`);
  return data;
}

export async function updateStudent(id: number, payload: StudentUpdateRequest): Promise<void> {
  await api.put(`/api/students/${id}`, payload);
}

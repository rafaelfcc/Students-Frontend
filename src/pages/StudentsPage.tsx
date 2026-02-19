import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { api } from "../services/api";

import type {
  StudentListItemDto,
  StudentCreateRequest,
  StudentUpdateRequest,
  StudentDetailDto,
} from "../students/students.types";

import {
  getStudentsList,
  createStudent,
  deleteStudent,
  updateStudent,
  getStudentById,
} from "../students/students.service";

import { StudentCreateModal } from "../students/StudentCreateModal";
import { StudentDetailsModal } from "../students/StudentDetailModal";

type UiMessage = { type: "success" | "danger"; text: string } | null;
type CrudMessage = { type: "success" | "danger"; text: string } | null;

export function StudentsPage() {
  const [items, setItems] = useState<StudentListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<UiMessage>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsMode, setDetailsMode] = useState<"view" | "edit">("view");
  const [selectedStudent, setSelectedStudent] = useState<StudentDetailDto | null>(null);
  const [detailsBusy, setDetailsBusy] = useState(false);

  const [crudMessage, setCrudMessage] = useState<CrudMessage>(null);

  // CSV upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvBusy, setCsvBusy] = useState(false);

  const navigate = useNavigate();

  function showSuccess(text: string) {
    setCrudMessage({ type: "success", text });
    setTimeout(() => setCrudMessage(null), 3000);
  }

  function showError(text: string) {
    setCrudMessage({ type: "danger", text });
    setTimeout(() => setCrudMessage(null), 5000);
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  async function loadStudents() {
    setError(null);
    setLoading(true);

    try {
      const list = await getStudentsList();
      setItems(list);
    } catch (err: any) {
      const msg =
        err?.userMessage ||
        err?.response?.data?.detail ||
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        "Erro ao carregar alunos.";
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStudents();
  }, []);

  async function handleCreate(payload: StudentCreateRequest) {
    setCreating(true);

    try {
      await createStudent(payload);
      setIsCreateOpen(false);
      showSuccess("Aluno criado com sucesso!");
      await loadStudents();
    } catch (err: any) {
      const msg =
        err?.userMessage ||
        err?.response?.data?.detail ||
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        "Erro ao criar aluno.";
      showError(msg);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este aluno?");
    if (!confirmDelete) return;

    try {
      await deleteStudent(id);
      showSuccess("Aluno excluído com sucesso!");
      await loadStudents();
    } catch (err: any) {
      const msg =
        err?.userMessage ||
        err?.response?.data?.detail ||
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        "Erro ao excluir aluno.";
      showError(msg);
    }
  }

  async function handleView(id: number) {
    setDetailsMode("view");
    setDetailsOpen(true);
    setSelectedStudent(null);
    setDetailsBusy(true);

    try {
      const full = await getStudentById(id);
      setSelectedStudent(full);
    } catch (err: any) {
      const msg =
        err?.userMessage ||
        err?.response?.data?.detail ||
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        "Erro ao carregar detalhes.";
      showError(msg);
      setDetailsOpen(false);
    } finally {
      setDetailsBusy(false);
    }
  }

  async function handleEdit(id: number) {
    setDetailsMode("edit");
    setDetailsOpen(true);
    setSelectedStudent(null);
    setDetailsBusy(true);

    try {
      const full = await getStudentById(id);
      setSelectedStudent(full);
    } catch (err: any) {
      const msg =
        err?.userMessage ||
        err?.response?.data?.detail ||
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        "Erro ao carregar aluno.";
      showError(msg);
      setDetailsOpen(false);
    } finally {
      setDetailsBusy(false);
    }
  }

  async function handleSaveEdit(payload: StudentUpdateRequest) {
    if (!selectedStudent) return;

    setDetailsBusy(true);

    try {
      await updateStudent(selectedStudent.id, payload);
      showSuccess("Aluno atualizado com sucesso!");
      setDetailsOpen(false);
      await loadStudents();
    } catch (err: any) {
      const msg =
        err?.userMessage ||
        err?.response?.data?.detail ||
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        "Erro ao atualizar aluno.";
      showError(msg);
    } finally {
      setDetailsBusy(false);
    }
  }

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvBusy(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/students/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data ?? {};
      const imported = data.imported ?? 0;
      const failed = data.failed ?? 0;

      showSuccess(`CSV importado: ${imported} ok, ${failed} falhas.`);
      await loadStudents();
    } catch (err: any) {
      const msg =
        err?.userMessage ||
        err?.response?.data?.detail ||
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        "Erro ao importar CSV.";
      showError(msg);
    } finally {
      setCsvBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateOpen(true)}
            disabled={csvBusy}
          >
            + Student
          </button>

          <button
            className="btn btn-outline-success"
            onClick={() => fileInputRef.current?.click()}
            disabled={csvBusy}
          >
            {csvBusy ? "Importando..." : "+ CSV"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleCsvUpload}
          />
        </div>

        <h2 className="m-0 flex-grow-1 text-center">Students</h2>

        <button className="btn btn-outline-secondary" onClick={handleLogout}>
          Sair
        </button>
      </div>

      {/* ALERTA GLOBAL (CRUD SUCCESS / ERROR) */}
      {crudMessage && (
        <div className={`alert alert-${crudMessage.type} mt-3`} role="alert">
          {crudMessage.text}
        </div>
      )}

      {/* LOADING / ERROR */}
      {loading && <div className="mt-3">Carregando...</div>}

      {error && !loading && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      {/* LISTA */}
      {!loading && !error && (
        <ul className="list-group mt-3">
          {items.map((s) => (
            <li
              key={s.id}
              className="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2"
            >
              <span className="me-2">
                <strong>{s.id}</strong> — {s.nome}
              </span>

              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-info" onClick={() => handleView(s.id)}>
                  Ver
                </button>

                <button className="btn btn-sm btn-outline-warning" onClick={() => handleEdit(s.id)}>
                  Editar
                </button>

                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <StudentCreateModal
        isOpen={isCreateOpen}
        isBusy={creating}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <StudentDetailsModal
        isOpen={detailsOpen}
        mode={detailsMode}
        student={selectedStudent}
        isBusy={detailsBusy}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedStudent(null);
        }}
        onSave={detailsMode === "edit" ? handleSaveEdit : undefined}
      />
    </div>
  );
}

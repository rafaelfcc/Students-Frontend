import { useEffect, useMemo, useState } from "react";
import type { StudentDetailDto, StudentUpdateRequest } from "./students.types";

type Mode = "view" | "edit";

type Props = {
  isOpen: boolean;
  mode: Mode;
  student: StudentDetailDto | null;
  isBusy?: boolean;
  onClose: () => void;
  onSave?: (payload: StudentUpdateRequest) => Promise<void> | void;
};

function toDateInputValue(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function toIsoFromDateInput(dateValue: string) {
  return new Date(`${dateValue}T00:00:00`).toISOString();
}

export function StudentDetailsModal({
  isOpen,
  mode,
  student,
  isBusy,
  onClose,
  onSave,
}: Props) {
  const isEdit = mode === "edit";
  const title = useMemo(
    () => (isEdit ? "Editar Student" : "Detalhes do Student"),
    [isEdit]
  );

  const [form, setForm] = useState<StudentUpdateRequest>({
    id: 0,
    nome: "",
    idade: 0,
    serie: 0,
    notaMedia: 0,
    endereco: "",
    nomePai: "",
    nomeMae: "",
    dataNascimento: "",
  });

  useEffect(() => {
    if (!isOpen || !student) return;

    setForm({
      id: student.id,
      nome: student.nome,
      idade: student.idade,
      serie: student.serie,
      notaMedia: student.notaMedia,
      endereco: student.endereco,
      nomePai: student.nomePai,
      nomeMae: student.nomeMae,
      dataNascimento: toDateInputValue(student.dataNascimento),
    });
  }, [isOpen, student]);

  if (!isOpen) return null;

  return (
    <div className="modal d-block" tabIndex={-1}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-3">
          <div className="modal-header">
            <h5 className="modal-title fw-semibold">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={!!isBusy}
            />
          </div>

          <div className="modal-body">
            {!student ? (
              <div className="text-center py-4">Carregando...</div>
            ) : (
              <>
                <div className="mb-3">
                  <span className="text-muted small">ID</span>
                  <div className="fw-semibold fs-5">{student.id}</div>
                </div>

                <div className="row g-4">

                  {/* Nome */}
                  <Field
                    label="Nome"
                    isEdit={isEdit}
                    value={form.nome}
                    onChange={(v) => setForm({ ...form, nome: v })}
                  />

                  {/* Idade */}
                  <Field
                    label="Idade"
                    isEdit={isEdit}
                    type="number"
                    value={form.idade}
                    onChange={(v) => setForm({ ...form, idade: Number(v) })}
                  />

                  {/* Série */}
                  <Field
                    label="Série"
                    isEdit={isEdit}
                    type="number"
                    value={form.serie}
                    onChange={(v) => setForm({ ...form, serie: Number(v) })}
                  />

                  {/* Nota Média */}
                  <Field
                    label="Nota Média"
                    isEdit={isEdit}
                    type="number"
                    value={form.notaMedia}
                    onChange={(v) => setForm({ ...form, notaMedia: Number(v) })}
                  />

                  {/* Data */}
                  <Field
                    label="Data de Nascimento"
                    isEdit={isEdit}
                    type="date"
                    value={form.dataNascimento}
                    onChange={(v) =>
                      setForm({ ...form, dataNascimento: v })
                    }
                  />

                  {/* Endereço */}
                  <Field
                    label="Endereço"
                    isEdit={isEdit}
                    value={form.endereco}
                    onChange={(v) => setForm({ ...form, endereco: v })}
                    fullWidth
                  />

                  {/* Pai */}
                  <Field
                    label="Nome do Pai"
                    isEdit={isEdit}
                    value={form.nomePai}
                    onChange={(v) => setForm({ ...form, nomePai: v })}
                  />

                  {/* Mãe */}
                  <Field
                    label="Nome da Mãe"
                    isEdit={isEdit}
                    value={form.nomeMae}
                    onChange={(v) => setForm({ ...form, nomeMae: v })}
                  />

                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={!!isBusy}
            >
              Fechar
            </button>

            {isEdit && (
              <button
                className="btn btn-primary"
                disabled={!!isBusy}
                onClick={async () => {
                  if (!onSave) return;

                  await onSave({
                    ...form,
                    dataNascimento: toIsoFromDateInput(form.dataNascimento),
                  });
                }}
              >
                {isBusy ? "Salvando..." : "Salvar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




type FieldProps = {
  label: string;
  value: any;
  isEdit: boolean;
  onChange?: (v: any) => void;
  type?: string;
  fullWidth?: boolean;
};

function Field({
  label,
  value,
  isEdit,
  onChange,
  type = "text",
  fullWidth,
}: FieldProps) {
  return (
    <div className={fullWidth ? "col-12" : "col-md-6"}>
      <label className="form-label text-muted small mb-1">{label}</label>

      {isEdit ? (
        <input
          type={type}
          className="form-control"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      ) : (
        <div className="fw-semibold fs-6">{value}</div>
      )}
    </div>
  );
}

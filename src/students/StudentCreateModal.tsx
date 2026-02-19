import { useEffect, useState } from "react";
import type { StudentCreateRequest } from "./students.types";

type Props = {
  isOpen: boolean;
  isBusy?: boolean;
  onClose: () => void;
  onSubmit: (payload: StudentCreateRequest) => Promise<void> | void;
};

function safeNumber(value: string, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function StudentCreateModal({ isOpen, isBusy, onClose, onSubmit }: Props) {
  const [createError, setCreateError] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("0");
  const [serie, setSerie] = useState("0");
  const [notaMedia, setNotaMedia] = useState("0");
  const [endereco, setEndereco] = useState("");
  const [nomePai, setNomePai] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [dataNascimento, setDataNascimento] = useState(""); // YYYY-MM-DD
  
  useEffect(() => {
    if (!isOpen) return;

    setCreateError(null);
    setNome("");
    setIdade("0");
    setSerie("0");
    setNotaMedia("0");
    setEndereco("");
    setNomePai("");
    setNomeMae("");
    setDataNascimento("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isBusy) onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isBusy, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nomeTrim = nome.trim();
    if (!nomeTrim) return setCreateError("Informe o nome.");
    if (!dataNascimento) return setCreateError("Informe a data de nascimento.");

    const isoBirth = new Date(`${dataNascimento}T00:00:00`).toISOString();

    const payload: StudentCreateRequest = {
      nome: nomeTrim,
      idade: safeNumber(idade, 0),
      serie: safeNumber(serie, 0),
      notaMedia: safeNumber(notaMedia, 0),
      endereco: endereco.trim(),
      nomePai: nomePai.trim(),
      nomeMae: nomeMae.trim(),
      dataNascimento: isoBirth,
    };

    setCreateError(null);

    try {
      await onSubmit(payload);
    } catch (err: any) {
      const msg = err?.userMessage ?? err?.message ?? "Erro ao salvar.";
      setCreateError(msg);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Bootstrap */}
      <div className="modal-backdrop fade show" />

      {/* Modal Bootstrap (sem JS) */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => {
          if (!isBusy && e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content shadow">
            <div className="modal-header">
              <h5 className="modal-title">Novo Student</h5>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
                disabled={!!isBusy}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {createError && (
                  <div className="alert alert-danger" role="alert">
                    {createError}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Nome</label>
                    <input
                      className="form-control"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      disabled={!!isBusy}
                      autoFocus
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Idade</label>
                    <input
                      className="form-control"
                      type="number"
                      value={idade}
                      onChange={(e) => setIdade(e.target.value)}
                      disabled={!!isBusy}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Série</label>
                    <input
                      className="form-control"
                      type="number"
                      value={serie}
                      onChange={(e) => setSerie(e.target.value)}
                      disabled={!!isBusy}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Nota Média</label>
                    <input
                      className="form-control"
                      type="number"
                      step="0.01"
                      value={notaMedia}
                      onChange={(e) => setNotaMedia(e.target.value)}
                      disabled={!!isBusy}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Data de Nascimento</label>
                    <input
                      className="form-control"
                      type="date"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      disabled={!!isBusy}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Endereço</label>
                    <input
                      className="form-control"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      disabled={!!isBusy}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Nome do Pai</label>
                    <input
                      className="form-control"
                      value={nomePai}
                      onChange={(e) => setNomePai(e.target.value)}
                      disabled={!!isBusy}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Nome da Mãe</label>
                    <input
                      className="form-control"
                      value={nomeMae}
                      onChange={(e) => setNomeMae(e.target.value)}
                      disabled={!!isBusy}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={!!isBusy}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn btn-primary" disabled={!!isBusy}>
                  {isBusy ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

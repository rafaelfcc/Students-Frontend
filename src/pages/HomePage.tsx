import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Home</h1>
      <p>Bem-vindo! (Essa página vai virar a lista de alunos.)</p>
      <p>
        <Link to="/students">Ir para alunos</Link>
      </p>
    </div>
  );
}

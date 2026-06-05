import { useNavigate } from 'react-router';
import logoBranca from '../assets/logo-branca.png';

type Usuario = {
  nome: string;
  salario: number;
};

function DashboardPage() {
  const navigate = useNavigate();

  const usuarioSalvo = sessionStorage.getItem('usuario');
  const usuario: Usuario | null = usuarioSalvo
    ? JSON.parse(usuarioSalvo)
    : null;

  function handleLogout() {
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('accessToken');
    navigate('/login');
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-brand">
            <img
                className="dashboard-logo"
                src={logoBranca}
                alt="+Grana - Organização financeira e controle de gastos"
            />

            <nav className="dashboard-nav">
              <span className="nav-item nav-item-active">Visão geral</span>
              <span className="nav-item nav-item-disabled">Gastos</span>
              <span className="nav-item nav-item-disabled">Metas</span>
            </nav>
          </div>

          <div className="dashboard-user">
            <span>Olá, {usuario?.nome}</span>

            <button
              className="logout-button"
              type="button"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <section className="dashboard-content">
        <section className="dashboard-hero">
          <h1>Visão geral</h1>
          <p>Confira o resumo das suas finanças em um só lugar.</p>
        </section>

        <div className="summary-grid">
          <article className="summary-card">
            <span className="summary-label">Salário cadastrado</span>

            <strong>
              {(usuario?.salario ?? 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </strong>

            <small>Valor mensal informado no cadastro</small>
          </article>

          <article className="summary-card">
            <span className="summary-label">Gastos registrados</span>

            <strong>R$ 0,00</strong>

            <small>Total dos gastos cadastrados</small>
          </article>

          <article className="summary-card">
            <span className="summary-label">Metas financeiras</span>

            <strong>0</strong>

            <small>Quantidade de metas cadastradas</small>
          </article>
        </div>

        <section className="dashboard-panel">
          <div>
            <h2>Resumo financeiro</h2>

            <p>
              Seus gastos e metas aparecerão aqui assim que conectarmos os dados
              cadastrados no sistema.
            </p>
          </div>

          <span className="panel-status">Em construção</span>
        </section>
      </section>
    </main>
  );
}

export default DashboardPage;
import { NavLink, useNavigate } from 'react-router';
import logoBranca from '../assets/logo-branca.png';

type AppHeaderProps = {
  paginaAtiva: 'dashboard' | 'gastos' | 'metas';
};

function AppHeader({ paginaAtiva }: AppHeaderProps) {
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('accessToken');
    navigate('/login');
  }

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-content">
        <div className="dashboard-brand">
          <img
            className="dashboard-logo"
            src={logoBranca}
            alt="+Grana - Organização financeira e controle de gastos"
          />

          <nav className="dashboard-nav">
            <NavLink
              className={`nav-item nav-link ${
                paginaAtiva === 'dashboard' ? 'nav-item-active' : ''
              }`}
              to="/dashboard"
            >
              Visão geral
            </NavLink>

            <NavLink
              className={`nav-item nav-link ${
                paginaAtiva === 'gastos' ? 'nav-item-active' : ''
              }`}
              to="/gastos"
            >
              Gastos
            </NavLink>

            <NavLink
              className={`nav-item nav-link ${
                paginaAtiva === 'metas' ? 'nav-item-active' : ''
              }`}
              to="/metas"
            >
              Metas
            </NavLink>
          </nav>
        </div>

        <div className="dashboard-user">
          <span>
            Olá,{' '}
            {JSON.parse(sessionStorage.getItem('usuario') ?? '{}').nome ??
              'usuário'}
          </span>

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
  );
}

export default AppHeader;
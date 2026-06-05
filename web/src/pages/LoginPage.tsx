import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import logoGrana from '../assets/logo.png';
import { login } from '../services/api';

type LocationState = {
  mensagem?: string;
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const mensagemCadastro =
    (location.state as LocationState | null)?.mensagem ?? '';

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensagemErro('');
    setCarregando(true);

    try {
      const response = await login(usuario, senha);

      sessionStorage.setItem(
        'usuario',
        JSON.stringify(response.usuario),
      );

      sessionStorage.setItem('accessToken', response.accessToken);

      navigate('/dashboard');
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Erro inesperado ao realizar o login';

      setMensagemErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <img
          className="login-logo"
          src={logoGrana}
          alt="+Grana - Organização financeira e controle de gastos"
        />

        <div className="login-intro">
          <h1>Entrar</h1>

          <p>
            Acesse sua conta para acompanhar seus gastos e metas.
          </p>
        </div>

        {mensagemCadastro && (
          <p className="success-message">{mensagemCadastro}</p>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Usuário
            <input
              type="text"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              placeholder="Digite seu usuário"
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </label>

          {mensagemErro && (
            <p className="error-message">{mensagemErro}</p>
          )}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          Ainda não possui uma conta?{' '}
          <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
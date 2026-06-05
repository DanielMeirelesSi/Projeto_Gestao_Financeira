import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router';
import '../App.css';
import logoGrana from '../assets/logo.png';
import { login } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensagem('');
    setCarregando(true);

    try {
      const response = await login(usuario, senha);

        sessionStorage.setItem('usuario', JSON.stringify(response.usuario));
        sessionStorage.setItem('accessToken', response.accessToken);

      navigate('/dashboard');
    } catch (error) {
      const mensagemErro =
        error instanceof Error ? error.message : 'Erro inesperado';

      setMensagem(mensagemErro);
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

        <div className="login-header">
          <h1>Entrar</h1>
          <p>Acesse sua conta para acompanhar seus gastos e metas.</p>
        </div>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {mensagem && <p className="message">{mensagem}</p>}
      </section>
    </main>
  );
}

export default LoginPage;
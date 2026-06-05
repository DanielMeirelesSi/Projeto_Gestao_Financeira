import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import logoGrana from '../assets/logo.png';
import { cadastrarUsuario } from '../services/api';
import type { DadosCadastro } from '../services/api';

const estadoInicial: DadosCadastro = {
  nome: '',
  dataNascimento: '',
  endereco: '',
  usuario: '',
  senha: '',
  salario: 0,
};

function CadastroPage() {
  const navigate = useNavigate();

  const [formulario, setFormulario] =
    useState<DadosCadastro>(estadoInicial);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  function atualizarCampo<K extends keyof DadosCadastro>(
    campo: K,
    valor: DadosCadastro[K],
  ) {
    setFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      [campo]: valor,
    }));
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro('');
    setSalvando(true);

    try {
      await cadastrarUsuario(formulario);

      navigate('/login', {
        replace: true,
        state: {
          mensagem: 'Cadastro realizado com sucesso. Entre com sua conta.',
        },
      });
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro inesperado ao realizar o cadastro',
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="register-card">
        <img
          className="register-logo"
          src={logoGrana}
          alt="+Grana - Organização financeira e controle de gastos"
        />

        <div className="register-intro">
          <h1>Criar conta</h1>

          <p>
            Cadastre seus dados para começar a organizar suas finanças.
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-grid">
            <label>
              Nome completo
              <input
                type="text"
                value={formulario.nome}
                onChange={(event) =>
                  atualizarCampo('nome', event.target.value)
                }
                placeholder="Digite seu nome"
                required
              />
            </label>

            <label>
              Data de nascimento
              <input
                type="date"
                value={formulario.dataNascimento}
                onChange={(event) =>
                  atualizarCampo('dataNascimento', event.target.value)
                }
                required
              />
            </label>

            <label>
              Endereço
              <input
                type="text"
                value={formulario.endereco}
                onChange={(event) =>
                  atualizarCampo('endereco', event.target.value)
                }
                placeholder="Digite seu endereço"
                required
              />
            </label>

            <label>
              Usuário
              <input
                type="text"
                value={formulario.usuario}
                onChange={(event) =>
                  atualizarCampo('usuario', event.target.value)
                }
                placeholder="Escolha seu usuário"
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                value={formulario.senha}
                onChange={(event) =>
                  atualizarCampo('senha', event.target.value)
                }
                placeholder="Crie uma senha"
                required
              />
            </label>

            <label>
              Salário mensal
              <input
                type="number"
                min="0"
                step="0.01"
                value={formulario.salario || ''}
                onChange={(event) =>
                  atualizarCampo('salario', Number(event.target.value))
                }
                placeholder="0,00"
                required
              />
            </label>
          </div>

          {erro && <p className="error-message">{erro}</p>}

          <button
            className="register-submit-button"
            type="submit"
            disabled={salvando}
          >
            {salvando ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-footer">
          Já possui uma conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}

export default CadastroPage;
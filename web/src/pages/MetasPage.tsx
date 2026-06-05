import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import AppHeader from '../components/AppHeader';
import {
  atualizarMeta,
  buscarMetas,
  criarMeta,
  excluirMeta,
} from '../services/api';
import type { DadosMeta, Meta } from '../services/api';

const estadoInicial: DadosMeta = {
  nome: '',
  valorObjetivo: 0,
  valorAtual: 0,
  dataLimite: '',
};

function MetasPage() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [formulario, setFormulario] = useState<DadosMeta>(estadoInicial);
  const [metaEmEdicao, setMetaEmEdicao] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function carregarMetas() {
    try {
      setErro('');
      const dados = await buscarMetas();
      setMetas(dados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro inesperado ao carregar metas',
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarMetas();
  }, []);

  function atualizarCampo<K extends keyof DadosMeta>(
    campo: K,
    valor: DadosMeta[K],
  ) {
    setFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      [campo]: valor,
    }));
  }

  function limparFormulario() {
    setFormulario(estadoInicial);
    setMetaEmEdicao(null);
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensagem('');
    setErro('');
    setSalvando(true);

    try {
      if (metaEmEdicao) {
        await atualizarMeta(metaEmEdicao, formulario);
        setMensagem('Meta atualizada com sucesso.');
      } else {
        await criarMeta(formulario);
        setMensagem('Meta cadastrada com sucesso.');
      }

      limparFormulario();
      await carregarMetas();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro inesperado ao salvar meta',
      );
    } finally {
      setSalvando(false);
    }
  }

  function iniciarEdicao(meta: Meta) {
    setMetaEmEdicao(meta._id);

    setFormulario({
      nome: meta.nome,
      valorObjetivo: meta.valorObjetivo,
      valorAtual: meta.valorAtual,
      dataLimite: meta.dataLimite,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  async function handleExcluir(id: string) {
    const confirmou = window.confirm(
      'Deseja realmente excluir esta meta?',
    );

    if (!confirmou) {
      return;
    }

    setMensagem('');
    setErro('');

    try {
      await excluirMeta(id);
      setMensagem('Meta excluída com sucesso.');
      await carregarMetas();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro inesperado ao excluir meta',
      );
    }
  }

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function formatarData(data: string) {
    return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR');
  }

  function calcularProgresso(meta: Meta) {
    if (meta.valorObjetivo <= 0) {
      return 0;
    }

    const progresso = (meta.valorAtual / meta.valorObjetivo) * 100;

    return Math.min(Math.round(progresso), 100);
  }

  return (
    <main className="dashboard-page">
      <AppHeader paginaAtiva="metas" />

      <section className="dashboard-content">
        <section className="dashboard-hero">
          <h1>Metas financeiras</h1>
          <p>Organize seus objetivos e acompanhe o progresso de cada meta.</p>
        </section>

        <section className="expense-summary">
          <span>Total de metas cadastradas</span>
          <strong>{metas.length}</strong>
        </section>

        <section className="form-card">
          <div className="section-header">
            <div>
              <h2>
                {metaEmEdicao ? 'Editar meta' : 'Cadastrar nova meta'}
              </h2>

              <p>Preencha os dados do seu objetivo financeiro.</p>
            </div>
          </div>

          <form className="expense-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Nome da meta
                <input
                  type="text"
                  value={formulario.nome}
                  onChange={(event) =>
                    atualizarCampo('nome', event.target.value)
                  }
                  placeholder="Ex.: Reserva de emergência"
                  required
                />
              </label>

              <label>
                Valor objetivo
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formulario.valorObjetivo || ''}
                  onChange={(event) =>
                    atualizarCampo(
                      'valorObjetivo',
                      Number(event.target.value),
                    )
                  }
                  placeholder="0,00"
                  required
                />
              </label>

              <label>
                Valor atual
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formulario.valorAtual || ''}
                  onChange={(event) =>
                    atualizarCampo(
                      'valorAtual',
                      Number(event.target.value),
                    )
                  }
                  placeholder="0,00"
                />
              </label>

              <label>
                Data limite
                <input
                  type="date"
                  value={formulario.dataLimite}
                  onChange={(event) =>
                    atualizarCampo('dataLimite', event.target.value)
                  }
                  required
                />
              </label>
            </div>

            <div className="form-actions">
              {metaEmEdicao && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={limparFormulario}
                >
                  Cancelar edição
                </button>
              )}

              <button type="submit" disabled={salvando}>
                {salvando
                  ? 'Salvando...'
                  : metaEmEdicao
                    ? 'Salvar alterações'
                    : 'Cadastrar meta'}
              </button>
            </div>
          </form>
        </section>

        {mensagem && <p className="success-message">{mensagem}</p>}
        {erro && <p className="error-message">{erro}</p>}

        <section className="list-card">
          <div className="section-header">
            <div>
              <h2>Metas cadastradas</h2>
              <p>Consulte, atualize ou exclua seus objetivos.</p>
            </div>
          </div>

          {carregando ? (
            <p className="empty-state">Carregando metas...</p>
          ) : metas.length === 0 ? (
            <p className="empty-state">
              Nenhuma meta cadastrada até o momento.
            </p>
          ) : (
            <div className="goals-grid">
              {metas.map((meta) => {
                const progresso = calcularProgresso(meta);

                return (
                  <article className="goal-card" key={meta._id}>
                    <div className="goal-card-header">
                      <div>
                        <h3>{meta.nome}</h3>
                        <p>Prazo: {formatarData(meta.dataLimite)}</p>
                      </div>

                      <span className="goal-percentage">{progresso}%</span>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-bar"
                        style={{ width: `${progresso}%` }}
                      />
                    </div>

                    <div className="goal-values">
                      <span>
                        Atual: <strong>{formatarMoeda(meta.valorAtual)}</strong>
                      </span>

                      <span>
                        Objetivo:{' '}
                        <strong>{formatarMoeda(meta.valorObjetivo)}</strong>
                      </span>
                    </div>

                    <div className="table-actions">
                      <button
                        className="table-button"
                        type="button"
                        onClick={() => iniciarEdicao(meta)}
                      >
                        Editar
                      </button>

                      <button
                        className="table-button danger-button"
                        type="button"
                        onClick={() => handleExcluir(meta._id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default MetasPage;
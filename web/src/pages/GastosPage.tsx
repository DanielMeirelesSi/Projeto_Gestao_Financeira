import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import AppHeader from '../components/AppHeader';
import {
  atualizarGasto,
  buscarGastos,
  criarGasto,
  excluirGasto,
} from '../services/api';
import type { DadosGasto, Gasto } from '../services/api';

const estadoInicial: DadosGasto = {
  descricao: '',
  categoria: '',
  tipo: 'Fixo',
  valor: 0,
  data: '',
};

function GastosPage() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [formulario, setFormulario] = useState<DadosGasto>(estadoInicial);
  const [gastoEmEdicao, setGastoEmEdicao] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function carregarGastos() {
    try {
      setErro('');
      const dados = await buscarGastos();
      setGastos(dados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro inesperado ao carregar gastos',
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarGastos();
  }, []);

  function atualizarCampo<K extends keyof DadosGasto>(
    campo: K,
    valor: DadosGasto[K],
  ) {
    setFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      [campo]: valor,
    }));
  }

  function limparFormulario() {
    setFormulario(estadoInicial);
    setGastoEmEdicao(null);
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensagem('');
    setErro('');
    setSalvando(true);

    try {
      if (gastoEmEdicao) {
        await atualizarGasto(gastoEmEdicao, formulario);
        setMensagem('Gasto atualizado com sucesso.');
      } else {
        await criarGasto(formulario);
        setMensagem('Gasto cadastrado com sucesso.');
      }

      limparFormulario();
      await carregarGastos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro inesperado ao salvar gasto',
      );
    } finally {
      setSalvando(false);
    }
  }

  function iniciarEdicao(gasto: Gasto) {
    setGastoEmEdicao(gasto._id);

    setFormulario({
      descricao: gasto.descricao,
      categoria: gasto.categoria,
      tipo: gasto.tipo,
      valor: gasto.valor,
      data: gasto.data,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  async function handleExcluir(id: string) {
    const confirmou = window.confirm(
      'Deseja realmente excluir este gasto?',
    );

    if (!confirmou) {
      return;
    }

    setMensagem('');
    setErro('');

    try {
      await excluirGasto(id);
      setMensagem('Gasto excluído com sucesso.');
      await carregarGastos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro inesperado ao excluir gasto',
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

  const totalGastos = gastos.reduce(
    (soma, gasto) => soma + gasto.valor,
    0,
  );

  return (
    <main className="dashboard-page">
      <AppHeader paginaAtiva="gastos" />

      <section className="dashboard-content">
        <section className="dashboard-hero">
          <h1>Gastos</h1>
          <p>Cadastre e acompanhe suas despesas financeiras.</p>
        </section>

        <section className="expense-summary">
          <span>Total registrado</span>
          <strong>{formatarMoeda(totalGastos)}</strong>
        </section>

        <section className="form-card">
          <div className="section-header">
            <div>
              <h2>
                {gastoEmEdicao ? 'Editar gasto' : 'Cadastrar novo gasto'}
              </h2>

              <p>Preencha os dados da despesa.</p>
            </div>
          </div>

          <form className="expense-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Descrição
                <input
                  type="text"
                  value={formulario.descricao}
                  onChange={(event) =>
                    atualizarCampo('descricao', event.target.value)
                  }
                  placeholder="Ex.: Conta de energia"
                  required
                />
              </label>

              <label>
                Categoria
                <input
                  type="text"
                  value={formulario.categoria}
                  onChange={(event) =>
                    atualizarCampo('categoria', event.target.value)
                  }
                  placeholder="Ex.: Moradia"
                  required
                />
              </label>

              <label>
                Tipo
                <select
                  value={formulario.tipo}
                  onChange={(event) =>
                    atualizarCampo(
                      'tipo',
                      event.target.value as DadosGasto['tipo'],
                    )
                  }
                >
                  <option value="Fixo">Fixo</option>
                  <option value="Variável">Variável</option>
                  <option value="Obrigatório">Obrigatório</option>
                </select>
              </label>

              <label>
                Valor
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formulario.valor || ''}
                  onChange={(event) =>
                    atualizarCampo('valor', Number(event.target.value))
                  }
                  placeholder="0,00"
                  required
                />
              </label>

              <label>
                Data
                <input
                  type="date"
                  value={formulario.data}
                  onChange={(event) =>
                    atualizarCampo('data', event.target.value)
                  }
                  required
                />
              </label>
            </div>

            <div className="form-actions">
              {gastoEmEdicao && (
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
                  : gastoEmEdicao
                    ? 'Salvar alterações'
                    : 'Cadastrar gasto'}
              </button>
            </div>
          </form>
        </section>

        {mensagem && <p className="success-message">{mensagem}</p>}
        {erro && <p className="error-message">{erro}</p>}

        <section className="list-card">
          <div className="section-header">
            <div>
              <h2>Gastos cadastrados</h2>
              <p>Consulte, edite ou exclua suas despesas.</p>
            </div>
          </div>

          {carregando ? (
            <p className="empty-state">Carregando gastos...</p>
          ) : gastos.length === 0 ? (
            <p className="empty-state">
              Nenhum gasto cadastrado até o momento.
            </p>
          ) : (
            <div className="table-wrapper">
              <table className="expenses-table">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Tipo</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {gastos.map((gasto) => (
                    <tr key={gasto._id}>
                      <td>{gasto.descricao}</td>
                      <td>{gasto.categoria}</td>
                      <td>{gasto.tipo}</td>
                      <td>{formatarData(gasto.data)}</td>
                      <td>{formatarMoeda(gasto.valor)}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="table-button"
                            type="button"
                            onClick={() => iniciarEdicao(gasto)}
                          >
                            Editar
                          </button>

                          <button
                            className="table-button danger-button"
                            type="button"
                            onClick={() => handleExcluir(gasto._id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default GastosPage;
import { useEffect, useState } from 'react';
import AppHeader from '../components/AppHeader';
import { buscarGastos, buscarMetas } from '../services/api';
import type { Usuario } from '../services/api';

function DashboardPage() {
  const [totalGastos, setTotalGastos] = useState(0);
  const [quantidadeMetas, setQuantidadeMetas] = useState(0);
  const [carregandoResumo, setCarregandoResumo] = useState(true);
  const [erroResumo, setErroResumo] = useState('');

  const usuarioSalvo = sessionStorage.getItem('usuario');

  const usuario: Usuario | null = usuarioSalvo
    ? JSON.parse(usuarioSalvo)
    : null;

  useEffect(() => {
    async function carregarResumo() {
      try {
        const [gastos, metas] = await Promise.all([
          buscarGastos(),
          buscarMetas(),
        ]);

        const total = gastos.reduce(
          (soma, gasto) => soma + gasto.valor,
          0,
        );

        setTotalGastos(total);
        setQuantidadeMetas(metas.length);
      } catch (error) {
        const mensagemErro =
          error instanceof Error
            ? error.message
            : 'Erro inesperado ao carregar o resumo';

        setErroResumo(mensagemErro);
      } finally {
        setCarregandoResumo(false);
      }
    }

    carregarResumo();
  }, []);

  return (
    <main className="dashboard-page">
      <AppHeader paginaAtiva="dashboard" />

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

            <strong>
              {carregandoResumo
                ? 'Carregando...'
                : totalGastos.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
            </strong>

            <small>Total dos gastos cadastrados</small>
          </article>

          <article className="summary-card">
            <span className="summary-label">Metas financeiras</span>

            <strong>
              {carregandoResumo ? 'Carregando...' : quantidadeMetas}
            </strong>

            <small>Quantidade de metas cadastradas</small>
          </article>
        </div>

        <section className="dashboard-panel">
          <div>
            <h2>Resumo financeiro</h2>

            <p>
              {erroResumo ||
                'Dados.'}
            </p>
          </div>

          <span className="panel-status">...</span>
        </section>
      </section>
    </main>
  );
}

export default DashboardPage;
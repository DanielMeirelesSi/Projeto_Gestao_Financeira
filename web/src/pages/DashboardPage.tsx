import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AppHeader from '../components/AppHeader';
import { buscarGastos, buscarMetas } from '../services/api';
import type { Gasto, Meta, Usuario } from '../services/api';

type GastoPorCategoria = {
  categoria: string;
  valor: number;
  cor: string;
};

type GastoMensal = {
  mes: string;
  valor: number;
};

const coresCategorias = [
  '#06402b',
  '#0a7a50',
  '#35a873',
  '#7bc8a4',
  '#b8e2d1',
  '#1f5f46',
];

function DashboardPage() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const usuarioSalvo = sessionStorage.getItem('usuario');

  const usuario: Usuario | null = usuarioSalvo
    ? JSON.parse(usuarioSalvo)
    : null;

  useEffect(() => {
    async function carregarDados() {
      try {
        const [gastosCarregados, metasCarregadas] = await Promise.all([
          buscarGastos(),
          buscarMetas(),
        ]);

        setGastos(gastosCarregados);
        setMetas(metasCarregadas);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : 'Erro inesperado ao carregar o dashboard',
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

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

    return Math.min(
      Math.round((meta.valorAtual / meta.valorObjetivo) * 100),
      100,
    );
  }

  const totalGastos = gastos.reduce(
    (soma, gasto) => soma + gasto.valor,
    0,
  );

  const salario = usuario?.salario ?? 0;
  const saldoDisponivel = salario - totalGastos;

  const gastosPorCategoria: GastoPorCategoria[] = Object.entries(
    gastos.reduce<Record<string, number>>((categorias, gasto) => {
      categorias[gasto.categoria] =
        (categorias[gasto.categoria] ?? 0) + gasto.valor;

      return categorias;
    }, {}),
  ).map(([categoria, valor], index) => ({
    categoria,
    valor,
    cor: coresCategorias[index % coresCategorias.length],
  }));

  const mesesReferencia = Array.from({ length: 6 }, (_, index) => {
    const data = new Date();

    data.setMonth(data.getMonth() - (5 - index));

    return {
      chave: `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(
        2,
        '0',
      )}`,
      nome: data.toLocaleDateString('pt-BR', {
        month: 'short',
      }),
    };
  });

  const gastosMensais: GastoMensal[] = mesesReferencia.map((mes) => {
    const valor = gastos
      .filter((gasto) => gasto.data.startsWith(mes.chave))
      .reduce((soma, gasto) => soma + gasto.valor, 0);

    return {
      mes: mes.nome.replace('.', ''),
      valor,
    };
  });

  const metasEmDestaque = metas.slice(0, 3);

  const gastosRecentes = [...gastos]
    .sort(
      (gastoA, gastoB) =>
        new Date(gastoB.data).getTime() - new Date(gastoA.data).getTime(),
    )
    .slice(0, 4);

  return (
    <main className="dashboard-page">
      <AppHeader paginaAtiva="dashboard" />

      <section className="dashboard-content">
        <section className="dashboard-title">
          <div>
            <h1>Visão geral</h1>

            <p>
              Acompanhe suas informações financeiras em um só lugar.
            </p>
          </div>
        </section>

        {erro && <p className="error-message">{erro}</p>}

        <section className="dashboard-summary-grid">
          <article className="summary-card">
            <span className="summary-label">Salário cadastrado</span>

            <strong>{formatarMoeda(salario)}</strong>

            <small>Valor mensal informado no cadastro</small>
          </article>

          <article className="summary-card">
            <span className="summary-label">Gastos registrados</span>

            <strong>
              {carregando ? 'Carregando...' : formatarMoeda(totalGastos)}
            </strong>

            <small>Total das despesas cadastradas</small>
          </article>

          <article className="summary-card">
            <span className="summary-label">Saldo disponível</span>

            <strong className={saldoDisponivel < 0 ? 'negative-value' : ''}>
              {carregando
                ? 'Carregando...'
                : formatarMoeda(saldoDisponivel)}
            </strong>

            <small>Salário menos gastos registrados</small>
          </article>

          <article className="summary-card">
            <span className="summary-label">Metas financeiras</span>

            <strong>{carregando ? 'Carregando...' : metas.length}</strong>

            <small>Quantidade de objetivos cadastrados</small>
          </article>
        </section>

        <section className="charts-grid">
          <article className="dashboard-panel chart-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Gastos por categoria</h2>

                <p>Distribuição das suas despesas cadastradas.</p>
              </div>
            </div>

            {gastosPorCategoria.length === 0 ? (
              <p className="empty-state">
                Cadastre um gasto para visualizar o gráfico.
              </p>
            ) : (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gastosPorCategoria}
                      dataKey="valor"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={84}
                      paddingAngle={3}
                      shape={(props: any) => (
                        <Sector
                          {...props}
                          fill={props.payload.cor}
                        />
                      )}
                    />

                    <Tooltip
                      formatter={(valor) =>
                        formatarMoeda(Number(valor))
                      }
                    />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </article>

          <article className="dashboard-panel chart-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Gastos nos últimos meses</h2>

                <p>Evolução mensal das despesas registradas.</p>
              </div>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gastosMensais}>
                  <CartesianGrid strokeDasharray="4 4" />

                  <XAxis dataKey="mes" />

                  <YAxis
                    width={72}
                    tickFormatter={(valor) =>
                      Number(valor).toLocaleString('pt-BR')
                    }
                  />

                  <Tooltip
                    formatter={(valor) =>
                      formatarMoeda(Number(valor))
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="valor"
                    name="Gastos"
                    stroke="#0a7a50"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="dashboard-lists-grid">
          <article className="dashboard-panel dashboard-list-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Metas em andamento</h2>

                <p>Acompanhe seus objetivos financeiros.</p>
              </div>

              <Link className="panel-link panel-link-top" to="/metas">
                Ver todas →
              </Link>
            </div>

            {metasEmDestaque.length === 0 ? (
              <p className="empty-state">
                Nenhuma meta cadastrada até o momento.
              </p>
            ) : (
              <div className="dashboard-goals-list">
                {metasEmDestaque.map((meta) => (
                  <div className="dashboard-goal-item" key={meta._id}>
                    <div>
                      <strong>{meta.nome}</strong>

                      <small>
                        {formatarMoeda(meta.valorAtual)} de{' '}
                        {formatarMoeda(meta.valorObjetivo)}
                      </small>
                    </div>

                    <span>{calcularProgresso(meta)}%</span>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="dashboard-panel dashboard-list-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Gastos recentes</h2>

                <p>Últimas despesas cadastradas.</p>
              </div>

              <Link className="panel-link panel-link-top" to="/gastos">
                Ver todos →
              </Link>
            </div>

            {gastosRecentes.length === 0 ? (
              <p className="empty-state">
                Nenhum gasto cadastrado até o momento.
              </p>
            ) : (
              <div className="recent-expenses-list">
                {gastosRecentes.map((gasto) => (
                  <div className="recent-expense-item" key={gasto._id}>
                    <div>
                      <strong>{gasto.descricao}</strong>

                      <small>
                        {gasto.categoria} • {formatarData(gasto.data)}
                      </small>
                    </div>

                    <span>{formatarMoeda(gasto.valor)}</span>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>
      </section>
    </main>
  );
}

export default DashboardPage;
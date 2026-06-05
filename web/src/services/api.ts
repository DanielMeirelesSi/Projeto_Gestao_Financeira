const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type Usuario = {
  _id: string;
  nome: string;
  dataNascimento: string;
  endereco: string;
  usuario: string;
  salario: number;
  admin: boolean;
};

export type Gasto = {
  _id: string;
  descricao: string;
  categoria: string;
  tipo: 'Fixo' | 'Variável' | 'Obrigatório';
  valor: number;
  data: string;
  usuarioId: string;
};

export type Meta = {
  _id: string;
  nome: string;
  valorObjetivo: number;
  valorAtual: number;
  dataLimite: string;
  usuarioId: string;
};

export type DadosGasto = {
  descricao: string;
  categoria: string;
  tipo: 'Fixo' | 'Variável' | 'Obrigatório';
  valor: number;
  data: string;
};

export type DadosMeta = {
  nome: string;
  valorObjetivo: number;
  valorAtual: number;
  dataLimite: string;
};

export type DadosCadastro = {
  nome: string;
  dataNascimento: string;
  endereco: string;
  usuario: string;
  senha: string;
  salario: number;
};

type LoginResponse = {
  message: string;
  usuario: Usuario;
  accessToken: string;
};

function getAuthHeaders() {
  const accessToken = sessionStorage.getItem('accessToken');

  if (!accessToken) {
    throw new Error('Sessão expirada. Entre novamente.');
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

async function requestAutenticada<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const textoResposta = await response.text();

  const data = textoResposta ? JSON.parse(textoResposta) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? 'Não foi possível concluir a operação');
  }

  return data as T;
}

export async function login(
  usuario: string,
  senha: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usuario,
      senha,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Não foi possível realizar o login');
  }

  return data;
}

export async function cadastrarUsuario(
  dados: DadosCadastro,
): Promise<Usuario> {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Não foi possível realizar o cadastro');
  }

  return data;
}

export async function buscarGastos(): Promise<Gasto[]> {
  return requestAutenticada<Gasto[]>('/gastos');
}

export async function criarGasto(dados: DadosGasto): Promise<Gasto> {
  return requestAutenticada<Gasto>('/gastos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });
}

export async function atualizarGasto(
  id: string,
  dados: Partial<DadosGasto>,
): Promise<Gasto> {
  return requestAutenticada<Gasto>(`/gastos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });
}

export async function excluirGasto(id: string): Promise<void> {
  return requestAutenticada<void>(`/gastos/${id}`, {
    method: 'DELETE',
  });
}

export async function buscarMetas(): Promise<Meta[]> {
  return requestAutenticada<Meta[]>('/metas');
}

export async function criarMeta(dados: DadosMeta): Promise<Meta> {
  return requestAutenticada<Meta>('/metas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });
}

export async function atualizarMeta(
  id: string,
  dados: Partial<DadosMeta>,
): Promise<Meta> {
  return requestAutenticada<Meta>(`/metas/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });
}

export async function excluirMeta(id: string): Promise<void> {
  return requestAutenticada<void>(`/metas/${id}`, {
    method: 'DELETE',
  });
}
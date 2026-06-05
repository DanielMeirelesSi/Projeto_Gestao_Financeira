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

export async function buscarGastos(): Promise<Gasto[]> {
  const response = await fetch(`${API_URL}/gastos`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Não foi possível carregar os gastos');
  }

  return data;
}

export async function buscarMetas(): Promise<Meta[]> {
  const response = await fetch(`${API_URL}/metas`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Não foi possível carregar as metas');
  }

  return data;
}
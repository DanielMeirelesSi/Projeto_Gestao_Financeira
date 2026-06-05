import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const usuarioSalvo = sessionStorage.getItem('usuario');
  const accessToken = sessionStorage.getItem('accessToken');

  if (!usuarioSalvo || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
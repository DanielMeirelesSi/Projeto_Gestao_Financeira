import { Navigate, Route, Routes } from 'react-router';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import CadastroPage from './pages/CadastroPage';
import DashboardPage from './pages/DashboardPage';
import GastosPage from './pages/GastosPage';
import LoginPage from './pages/LoginPage';
import MetasPage from './pages/MetasPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/gastos"
        element={
          <ProtectedRoute>
            <GastosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/metas"
        element={
          <ProtectedRoute>
            <MetasPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
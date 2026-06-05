import { Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import GastosPage from './pages/GastosPage';
import LoginPage from './pages/LoginPage';
import MetasPage from './pages/MetasPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

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
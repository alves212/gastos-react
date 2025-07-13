// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import DashboardPage from '../pages/DashboardPage'
import PrivateRoute from '../components/PrivateRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      {/* Redireciona qualquer rota desconhecida para "/" */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

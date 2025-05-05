import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Dashboard from './pages/Dashboard';
import DoctorsPage from './pages/DoctorsPage';
import PharmaciesPage from './pages/PharmaciesPage';
import CategoriesPage from './pages/CategoriesPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="pharmacies" element={<PharmaciesPage />} />
            <Route path="categories" element={<CategoriesPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

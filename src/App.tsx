import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import DoctorsPage from './pages/DoctorsPage';
import PharmaciesPage from './pages/PharmaciesPage';
import CategoriesPage from './pages/CategoriesPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="pharmacies" element={<PharmaciesPage />} />
          <Route path="categories" element={<CategoriesPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

import type React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { TemplatePage } from './pages/TemplatePage';
import { DAMPage } from './pages/DAMPage';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './components/commons/Layout';
import { authStorage } from './services/apiClient';

const PrivateRoute: React.FC = () => {
  const token = authStorage.getAccessToken();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/template" element={<TemplatePage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/dam" element={<DAMPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

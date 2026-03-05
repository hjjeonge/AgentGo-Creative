import type React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Layout } from './components/commons/Layout';
import { DAMPage } from './pages/DAMPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { LoginPage } from './pages/LoginPage';
import { TemplatePage } from './pages/TemplatePage';
import { getAccessToken } from './utils/tokenManager';

const PrivateRoute: React.FC = () => {
  const token = getAccessToken();
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
            <Route path="/editor/:projectId" element={<EditorPage />} />
            <Route path="/dam" element={<DAMPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

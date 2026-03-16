import type React from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import { Layout } from '@/commons/components/Layout';
import { getAccessToken } from '@/commons/utils/tokenManager';
import { DAMPage } from '@/pages/DAMPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { EditorPage } from '@/pages/EditorPage';
import { LoginPage } from '@/pages/LoginPage';
import { TemplatePage } from '@/pages/TemplatePage';

const PrivateRoute: React.FC = () => {
  const token = getAccessToken();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import Layout from '../components/Layout';
import { tokenService } from '../api/authService';

// Lazy load components
const LoginPage = lazy(() => import('../pages/login/login'));
const Dashboard = lazy(() => import('../components/Dashboard'));
const TugServices = lazy(()=> import ('../pages/tugServices/tugServices'));

// Loading fallback
const LoadingFallback = () => <div className="loading">Loading...</div>;

// Route Configurations
const routeConfig = [
  { path: 'dashboard', element: <Dashboard /> },
  { path: 'tugservices', element: <TugServices /> },

];

// Sidebar menu redirects (no pages yet)
const sidebarRedirectRoutes = [
  'telemedicine',
  'billing',
];

// Auth Redirect component
const AuthRedirect = () => {
  const isAuthenticated = tokenService.isAuthenticated();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<App />}>
            {/* Redirect root to login */}
            <Route index element={<Navigate to="/login" replace />} />
            
            {/* Login Page */}
            <Route path="login" element={<LoginPage />} />

            {/* Layout Routes */}
            <Route element={<Layout />}>
              {/* Main Pages */}
              {routeConfig.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}

              {/* Sidebar Redirects */}
              {sidebarRedirectRoutes.map((path) => (
                <Route key={path} path={path} element={<Navigate to="/dashboard" replace />} />
              ))}
            </Route>
          </Route>

          {/* Unknown Route Handler */}
          <Route path="*" element={<AuthRedirect />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
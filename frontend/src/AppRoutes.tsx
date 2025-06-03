import NavBar from '@/components/NavBar.tsx';
import ProtectedRoute from '@/components/ProtectedRoute.tsx';
import CoursesManagerPage from '@/pages/CoursesMangerPage.tsx';
import LoginPage from '@/pages/LoginPage.tsx';
import RegisterPage from '@/pages/RegisterPage.tsx';
import WatchLecturePage from '@/pages/WatchLecturePage.tsx';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

const AppRoutes = () => {
  const location = useLocation();
  const hideNavBar =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <WatchLecturePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses-manager"
          element={
            <ProtectedRoute>
              <CoursesManagerPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WatchLecturePage  from "@/pages/WatchLecturePage";
import CoursesManagerPage from "@/pages/CoursesMangerPage";

import LoginPage from '@/components/LoginPage.tsx';
import RegisterPage from '@/components/RegisterPage.tsx';
import ProtectedRoute from '@/components/ProtectedRoute.tsx';


const App = () => (

  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/home"
        element={<ProtectedRoute>
          <WatchLecturePage />
        </ProtectedRoute>} />
      <Route
        path="/courses-manager"
        element={<ProtectedRoute>
          <CoursesManagerPage />
        </ProtectedRoute>} />
    </Routes>
  </Router>
);

export default App;

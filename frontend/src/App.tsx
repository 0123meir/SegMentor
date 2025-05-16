import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AIAssistant } from "@/components/AIAssistant";
import { Collections } from "@/components/Collections";
import LecturePlayer from "@/components/LecturePlayer";
import LoginPage from '@/components/LoginPage.tsx';
import RegisterPage from '@/components/RegisterPage.tsx';
import ProtectedRoute from '@/components/ProtectedRoute.tsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <div className="flex flex-col flex-grow">
                  <LecturePlayer />
                  <AIAssistant />
                </div>
                <Collections />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

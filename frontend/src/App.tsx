import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AIAssistant } from "@/components/AIAssistant";
import { Collections } from "@/components/Collections";
import LecturePlayer from "@/components/LecturePlayer";
import LoginPage from '@/components/LoginPage.tsx';
import RegisterPage from '@/components/RegisterPage.tsx';
import ProtectedRoute from '@/components/ProtectedRoute.tsx';
import useAuthStore from '@/state/AuthStore.tsx';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { GATEWAY_URL } from '@/globals/urls.tsx';

const App = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const token = Cookies.get('authToken');

    if (token) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${GATEWAY_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Cookies.set('authToken', token, { expires: 7, secure: true, sameSite: 'strict' });
          setToken(token);
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          Cookies.remove('authToken');
        }
      };

      fetchUser();
    }
  }, [setUser, setToken]);

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

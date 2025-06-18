import { GATEWAY_URL } from '@/globals/urls.tsx';
import useAuthStore from '@/state/AuthStore.tsx';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import AppRoutes from './AppRoutes';
import { useSnackbar } from '@/context/SnackbarContext.tsx';
import UploadSnackbar from '@/components/UploadSnackbar.tsx';

const App = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const { snackbars } = useSnackbar();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${GATEWAY_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Cookies.set('authToken', token, {
            expires: 7,
            secure: true,
            sameSite: 'strict',
          });
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
    <>
      <Router>
        <AppRoutes />
      </Router>
      <div className="absolute bottom-0 right-0 flex flex-col-reverse items-end">
        {snackbars.map((snackbar) => (
          <div className="bg-white">
            <UploadSnackbar key={snackbar.title} uploadState={snackbar.state} title={snackbar.title} />
          </div>
        ))}
      </div>
    </>
  );
};

export default App;

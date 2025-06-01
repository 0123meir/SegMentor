import useAuthStore, { UserRoles } from '@/state/AuthStore.tsx';
import Cookies from 'js-cookie';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearState } = useAuthStore();
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    Cookies.remove('authToken');
    clearState();
    navigate('/login');
  };

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white px-6 py-2.5 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg tracking-wide text-white group-hover:text-blue-100 transition-colors">
            Segmentor
          </span>

          <Link
            to="/home"
            className={`font-medium text-sm transition-colors duration-200 ${
              isActiveLink('/home')
                ? 'text-white border-b-2 border-white'
                : 'text-blue-100 hover:text-white'
            }`}
          >
            Home
          </Link>
          {(user?.role === UserRoles.Admin ||
            user?.role === UserRoles.Lecturer) && (
            <Link
              to="/courses-manager"
              className={`font-medium text-sm transition-colors duration-200 ${
                isActiveLink('/courses-manager')
                  ? 'text-white border-b-2 border-white'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Courses Manager
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-blue-50 text-sm">
                Welcome,{' '}
                <span className="font-medium text-white">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm rounded-md bg-white/10 text-white border border-white/20
                         hover:bg-white/20 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1 focus:ring-offset-blue-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

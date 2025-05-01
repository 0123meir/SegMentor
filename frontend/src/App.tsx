import { useEffect } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

import { useApi } from './hooks/useApi';
import CoursesManagerPage from './pages/CoursesMangerPage';
import { WatchLecturePage } from './pages/WatchLecturePage';
import { useCoursesStore } from './state/CoursesStore';

const App = () => {
  const { fetchCourses, initState } = useCoursesStore();
  const api = useApi();

  useEffect(() => {
    initState(api)
    fetchCourses();
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<WatchLecturePage />} />
          <Route path="/courses-manager" element={<CoursesManagerPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

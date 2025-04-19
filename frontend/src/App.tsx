import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import CoursesManagerPage from "./pages/CoursesMangerPage";
import { WatchLecturePage } from "./pages/WatchLecturePage";

const App = () => {

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

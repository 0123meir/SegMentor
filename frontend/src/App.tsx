import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import CoursesManagerPage from "./pages/CoursesMangerPage";
import { WatchLecturePage } from "./pages/WatchLecturePage";
import { useCoursesStore } from "./state/CoursesStore";

const App = () => {
  //dev
  const a = useCoursesStore();
  a.setCources([
    {
      id: "1",
      name: "React Basics",
      lectures: ["Introduction", "Components", "Props and State", "Hooks"],
      currentLecture: 2,
      lecturers: [
        { id: "lecturer123", name: "John Doe" },
        { id: "lecturer456", name: "Jane Smith" },
      ],
    },
    {
      id: "2",
      name: "Advanced JavaScript",
      lectures: ["Closures", "Promises", "Async/Await", "Event Loop"],
      currentLecture: 1,
      lecturers: [{ id: "lecturer123", name: "John Doe" }],
    },
    {
      id: "3",
      name: "בדידה 2",
      lectures: ["מבוא", "הוכחות", "אלגברה", "קומבינטוריקה"],
      currentLecture: 0,
      lecturers: [{ id: "lecturer789", name: "David Cohen" }],
    },
  ]);

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

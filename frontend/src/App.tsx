import { useEffect } from "react";
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
  console.log("App component rendered");
  const { setCourses } = useCoursesStore();

  useEffect(() => {
    // Initialize courses only once on mount
    console.log("Initializing courses");
    setCourses([
      {
        id: "1",
        name: "React Basics",
        lectures: [
          { id: "lecture1", title: "Introduction", date: "2023-10-01" },
          { id: "lecture2", title: "Components", date: "2023-10-01" },
          { id: "lecture3", title: "Props and State", date: "2023-10-01" },
          { id: "lecture4", title: "Hooks", date: "2023-10-01" },
        ],
        currentLectureId: "lecture1",
        lecturers: [
          { id: "lecturer123", name: "John Doe" },
          { id: "lecturer456", name: "Jane Smith" },
        ],
      },
      {
        id: "2",
        name: "Advanced JavaScript",
        lectures: [
          { id: "lecture9", title: "מבוא", date: "2023-10-01" },
          { id: "lecture10", title: "הוכחות", date: "2023-10-01" },
          { id: "lecture11", title: "אלגברה", date: "2023-10-01" },
          { id: "lecture12", title: "קומבינטוריקה", date: "2023-10-01" },
        ],
        currentLectureId: "lecture9",
        lecturers: [{ id: "lecturer123", name: "John Doe" }],
      },
      {
        id: "3",
        name: "בדידה 2",
        lectures: [
          { id: "lecture13", title: "מבוא", date: "2023-10-01" },
          { id: "lecture14", title: "הוכחות", date: "2023-10-01" },
          { id: "lecture15", title: "אלגברה", date: "2023-10-01" },
          { id: "lecture16", title: "קומבינטוריקה", date: "2023-10-01" },
        ],
        currentLectureId: "lecture16",
        lecturers: [{ id: "lecturer789", name: "David Cohen" }],
      },
    ]);
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

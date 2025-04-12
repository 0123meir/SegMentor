import { useState } from "react";

export interface Course {
  id: string;
  name: string;
  lectures: string[];
  currentLecture: number;
}

export const useCourses = () => {
  const [courses] = useState<Course[]>([
    {
      id: "1",
      name: "React Basics",
      lectures: ["Introduction", "Components", "Props and State", "Hooks"],
      currentLecture: 2,
    },
    {
      id: "2",
      name: "Advanced JavaScript",
      lectures: ["Closures", "Promises", "Async/Await", "Event Loop"],
      currentLecture: 1,
    },
    {
      id: "3",
      name: "בדידה 2",
      lectures: ["מבוא", "הוכחות", "אלגברה", "קומבינטוריקה"],
      currentLecture: 0,
    },
  ]);

  return courses;
};

import { Course } from "@/types/Course";
import { create } from "zustand";

interface CoursesStore {
  courses: Course[];
  activeCourseId: string | null;
  setCourses: (courses: Course[]) => void;
  setActiveCourse: (courseId: string) => void;
  setCurrentLecture: (courseId: string, lectureIndex: number) => void;
}

export const useCoursesStore = create<CoursesStore>((set) => ({
  courses: [],
  activeCourseId: null,
  setCourses: (courses) => set({ courses }),
  setActiveCourse: (courseId) => set({ activeCourseId: courseId }),
  setCurrentLecture: (courseId, lectureIndex) =>
    set((state) => ({
      courses: state.courses.map((course) => {
        if (course.id === courseId) {
          return {
            ...course,
            currentLectureId: course.lectures[lectureIndex].id,
          };
        }
        return course;
      }),
    })),
}));

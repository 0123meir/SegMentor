import { Course } from '@/types/Course';
import { create } from 'zustand';

interface CoursesState {
  courses: Course[];
  activeCourseId: string | null;
  activeLectureId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchCourses: (fetchFn: () => Promise<Course[]>) => Promise<void>;
  setCourses: (courses: Course[]) => void;
  setActiveCourse: (courseId: string) => void;
  setActiveLecture: (lectureId: string) => void;
}

export const useCoursesStore = create<CoursesState>((set) => ({
  courses: [],
  activeCourseId: null,
  activeLectureId: null,
  isLoading: false,
  error: null,
  fetchCourses: async (fetchFn) => {
    set({ isLoading: true, error: null });
    try {
      const courses = await fetchFn();
      set({ courses, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error: couldn't get courses, if this persists, please contact your administrator",
        isLoading: false,
      });
    }
  },
  setCourses: (courses) => set({ courses }),
  setActiveCourse: (courseId) => set({ activeCourseId: courseId }),
  setActiveLecture: (lectureId) => set({ activeLectureId: lectureId }),
}));

import { UseApiType } from '@/hooks/useApi';
import { Course, Lecture } from '@/types/Course';
import { create } from 'zustand';

const MOCK_USER_ID = '661e1c2f9b1e8a001f0e1234';

interface CoursesState {
  courses: Course[];
  activeCourseId: string | null;
  activeLectureId: string | null;
  isLoading: boolean;
  error: string | null;
  api:  null | UseApiType;
  initState: (api: UseApiType) => void;
  fetchCourses: () => Promise<void>;
  markLectureWatched: (
    courseId: string,
    lectureId: string
  ) => Promise<void>;
  setCourses: (courses: Course[]) => void;
  addLecture: (courseId: string, lectureData: Partial<Lecture>) => void;
  deleteLecture: (courseId: string, lectureId: string) => void;
  setActiveCourse: (courseId: string) => void;
  setActiveLecture: (lectureId: string) => void;
}

export const useCoursesStore = create<CoursesState>((set, get) => ({
  courses: [],
  activeCourseId: null,
  activeLectureId: null,
  isLoading: false,
  error: null,
  api: null,
  initState: (api) => set({ api }),
  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      if(!get().api) {
        throw new Error('API not initialized. Please call initState first.');
      }
      
      const data = await get().api!.get<Course[]>(
        `/courses-service/courses?userId=${MOCK_USER_ID}`
      );
      set({ courses: data, isLoading: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error: couldn't get courses, if this persists, please contact your administrator";
      set({ error: errorMessage, courses: [], isLoading: false });
      console.error('Error fetching courses:', errorMessage);
    }
  },
  markLectureWatched: async (courseId, lectureId) => {
    if(!get().api) {
      throw new Error('API not initialized. Please call initState first.');
    }

    const { courses } = get();
    const course = courses.find((c) => c._id === courseId);
    if (!course) return;
    if (course.watchedLectures?.includes(lectureId)) return;

    // Optimistic update
    set({
      courses: courses.map((c) =>
        c._id === courseId
          ? {
              ...c,
              watchedLectures: [...(c.watchedLectures || []), lectureId],
            }
          : c
      ),
    });

    try {
      await get().api!.post('/courses-service/watched-lectures', {
        userId: MOCK_USER_ID,
        courseId,
        lectureId,
      });
    } catch (err) {
      // Rollback on error
      set({
        courses: courses.map((c) =>
          c._id === courseId
            ? {
                ...c,
                watchedLectures: (c.watchedLectures || []).filter(
                  (id: string) => id !== lectureId
                ),
              }
            : c
        ),
      });
      console.error('Failed to mark lecture as watched', err);
    }
  },
  addLecture: async (courseId: string, lectureData: Partial<Lecture>) => {
    // Optimistically update UI
    set((state) => {
      const courseIdx = state.courses.findIndex(c => c._id === courseId);
      if (courseIdx === -1) return state;
      const newLecture = { ...lectureData };
      const updatedCourses = [...state.courses];
      updatedCourses[courseIdx].lectures = [
        ...updatedCourses[courseIdx].lectures,
        newLecture,
      ];
      return { ...state, courses: updatedCourses };
    });

    try {
      if(!get().api) {
        throw new Error('API not initialized. Please call initState first.');
      }

      await get().api!.post(`/courses-service/lectures`, {
        ...lectureData,
        courseId,
      });
    } catch (e) {
      // Rollback optimistic update
      set((state) => {
        const courseIdx = state.courses.findIndex(c => c._id === courseId);
        if (courseIdx === -1) return state;
        const updatedCourses = [...state.courses];
        updatedCourses[courseIdx].lectures = updatedCourses[courseIdx].lectures.filter(
          (lecture) => lecture._id !== lectureData._id
        );
        return { ...state, courses: updatedCourses };
      });
      console.error('Failed to add lecture', e);
    }
  },
  deleteLecture: async (courseId: string, lectureId: string) => {
    // Optimistically update UI
    set((state) => {
      const courseIdx = state.courses.findIndex(c => c._id === courseId);
      if (courseIdx === -1) return state;
      const updatedCourses = [...state.courses];
      updatedCourses[courseIdx].lectures = updatedCourses[courseIdx].lectures.filter(
        (lecture) => lecture._id !== lectureId
      );
      return { ...state, courses: updatedCourses };
    });

    try {
      if(!get().api) {
        throw new Error('API not initialized. Please call initState first.');
      }

      await get().api!.delete(`/courses-service/lectures/${lectureId}`);
    } catch (e) {
      // Rollback optimistic update
      set((state) => {
        const courseIdx = state.courses.findIndex(c => c._id === courseId);
        if (courseIdx === -1) return state;
        const updatedCourses = [...state.courses];
        updatedCourses[courseIdx].lectures.push({ _id: lectureId } as Lecture); // Add back the deleted lecture
        return { ...state, courses: updatedCourses };
      });
      console.error('Failed to delete lecture', e);
    }
  },
  setCourses: (courses) => set({ courses }),
  setActiveCourse: (courseId) => set({ activeCourseId: courseId }),
  setActiveLecture: (lectureId) => set({ activeLectureId: lectureId }),
}));

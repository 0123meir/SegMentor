import { UseApiType } from '@/hooks/useApi';
import {
  AddCourseRequest,
  Course,
  Lecture,
} from '@/types/Course';
import { create } from 'zustand';

interface CoursesState {
  courses: Course[] | null;
  activeCourseId: string | null;
  activeLectureId: string | null;
  isLoading: boolean;
  error: string | null;
  api: null | UseApiType;
  userId: string | null;
  initState: (api: UseApiType, userId: string) => void;
  fetchCourses: () => Promise<void>;
  markLectureWatched: (courseId: string, lectureId: string) => Promise<void>;
  setCourses: (courses: Course[]) => void;
  addLecture: (courseId: string, lectureData: Lecture) => void;
  deleteLecture: (courseId: string, lectureId: string) => void;
  setActiveCourse: (courseId: string) => void;
  setActiveLecture: (lectureId: string) => void;
  addCourse: (courseData: AddCourseRequest) => Promise<void>;
}

function optimisticMarkLectureWatched(
  courses: Course[],
  courseId: string,
  lectureId: string
) {
  return courses.map((c) =>
    c._id === courseId
      ? {
          ...c,
          watchedLectures: [...(c.watchedLectures || []), lectureId],
        }
      : c
  );
}

function rollbackMarkLectureWatched(
  courses: Course[],
  courseId: string,
  lectureId: string
) {
  return courses.map((c) =>
    c._id === courseId
      ? {
          ...c,
          watchedLectures: (c.watchedLectures || []).filter(
            (id: string) => id !== lectureId
          ),
        }
      : c
  );
}

function optimisticDeleteLecture(
  state: CoursesState,
  courseId: string,
  lectureId: string
) {
  const courseIdx =
    state.courses && state.courses.findIndex((c) => c._id === courseId);
  if (courseIdx === -1) return state;
  const updatedCourses = [...state.courses!];
  updatedCourses[courseIdx!].lectures = updatedCourses[
    courseIdx!
  ].lectures.filter((lecture) => lecture._id !== lectureId);
  return { ...state, courses: updatedCourses };
}

function rollbackDeleteLecture(
  state: CoursesState,
  courseId: string,
  lectureId: string
) {
  const courseIdx =
    state.courses && state.courses.findIndex((c) => c._id === courseId);
  if (courseIdx === -1) return state;
  const updatedCourses = [...state.courses!];
  updatedCourses[courseIdx!].lectures.push({ _id: lectureId } as Lecture);
  return { ...state, courses: updatedCourses };
}

export const useCoursesStore = create<CoursesState>((set, get) => ({
  courses: null,
  activeCourseId: null,
  activeLectureId: null,
  isLoading: false,
  error: null,
  api: null,
  userId: null,
  initState: (api, userId) => set({ api, userId }),
  fetchCourses: async () => {
    try {
      if (!get().api) {
        throw new Error('API not initialized. Please call initState first.');
      }
      set({ isLoading: true, error: null });
      const data = await get().api!.get<Course[]>(
        `/courses-service/courses?userId=${get().userId}`
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
    if (!get().api) {
      throw new Error('API not initialized. Please call initState first.');
    }
    const { courses } = get();
    const course = courses && courses.find((c) => c._id === courseId);
    if (!course) return;
    if (course.watchedLectures?.includes(lectureId)) return;

    set({
      courses: optimisticMarkLectureWatched(courses, courseId, lectureId),
    });

    try {
      await get().api!.post('/courses-service/watched-lectures', {
        userId: get().userId,
        courseId,
        lectureId,
      });
    } catch (err) {
      set({
        courses: rollbackMarkLectureWatched(courses, courseId, lectureId),
      });
      console.error('Failed to mark lecture as watched', err);
    }
  },
  addLecture: async (courseId: string, lectureData: Lecture) => {
    try {
      set((state) => {
        const courseIdx = state.courses?.findIndex((c) => c._id === courseId);
        if (courseIdx === undefined || courseIdx === -1) return state;
        const updatedCourses = [...state.courses!];
        updatedCourses[courseIdx].lectures = [
          ...updatedCourses[courseIdx].lectures,
          lectureData,
        ];
        return { ...state, courses: updatedCourses };
      });
    } catch (e) {
      console.error('Failed to add lecture', e);
      set({ error: 'Failed to add lecture' });
    }
  },
  deleteLecture: async (courseId: string, lectureId: string) => {
    set((state) => optimisticDeleteLecture(state, courseId, lectureId));
    try {
      if (!get().api) {
        throw new Error('API not initialized. Please call initState first.');
      }
      await get().api!.delete(`/courses-service/lectures/${lectureId}`);
    } catch (e) {
      set((state) => rollbackDeleteLecture(state, courseId, lectureId));
      console.error('Failed to delete lecture', e);
    }
  },
  setCourses: (courses) => set({ courses }),
  setActiveCourse: (courseId) => set({ activeCourseId: courseId }),
  setActiveLecture: (lectureId) => set({ activeLectureId: lectureId }),
  addCourse: async (courseData: AddCourseRequest) => {
    try {
      if (!get().api) {
        throw new Error('API not initialized. Please call initState first.');
      }
      const created = await get().api!.post<Course>(
        '/courses-service/courses',
        {
          ...courseData,
          userId: get().userId,
        }
      );
      set((state) => ({
        courses: [...state.courses!, created],
      }));
    } catch (e) {
      console.error('Failed to add course', e);
    }
  },
}));

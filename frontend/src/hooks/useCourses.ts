import { Course } from '@/types/Course';
import { useCallback, useState } from 'react';

import { useApi } from './useApi';

interface UseCoursesReturn {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  markLectureWatched: (courseId: string, lectureId: string) => Promise<void>;
}

const MOCK_USER_ID = '661e1c2f9b1e8a001f0e1234';

export const useCourses = (): UseCoursesReturn => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  const fetchCourses = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<Course[]>(`/courses?userId=${MOCK_USER_ID}`);
      setCourses(data);
      setIsLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error: couldn't get courses, if this persists, please contact your administrator";
      setError(errorMessage);
      setCourses([]);
      setIsLoading(false);
      console.error('Error fetching courses:', errorMessage);
    }
  }, [isLoading, api]);

  // Optimistic update for marking lecture as watched
  const markLectureWatched = useCallback(
    async (courseId: string, lectureId: string) => {
      const course = courses.find((c) => c._id === courseId);
      if (!course) return;

      // If already watched, do nothing
      if (course.watchedLectures?.includes(lectureId)) return;

      // Optimistic update
      setCourses(
        courses.map((c) =>
          c._id === courseId
            ? {
                ...c,
                watchedLectures: [...(c.watchedLectures || []), lectureId],
              }
            : c
        )
      );

      try {
        await api.post('/courses/watched-lectures', {
          userId: MOCK_USER_ID,
          courseId,
          lectureId,
        });
      } catch (err) {
        // Rollback on error
        setCourses(
          courses.map((c) =>
            c._id === courseId
              ? {
                  ...c,
                  watchedLectures: (c.watchedLectures || []).filter(
                    (id: string) => id !== lectureId
                  ),
                }
              : c
          )
        );
        console.error('Failed to mark lecture as watched', err);
      }
    },
    [courses, api]
  );

  return {
    courses,
    isLoading,
    error,
    fetchCourses,
    markLectureWatched,
  };
};

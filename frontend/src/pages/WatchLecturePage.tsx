import lecturesImage from '@/assets/lectures.svg';
import AIAssistant from '@/components/AIAssistant';
import LecturePlayer from '@/components/LecturePlayer';
import { LeftSideMenu } from '@/components/LeftSideMenu';
import { useApi } from '@/hooks/useApi';
import useAuthStore from '@/state/AuthStore';
import { useCoursesStore } from '@/state/CoursesStore';
import { useEffect } from 'react';

const WatchLecturePage = () => {
  const { fetchCourses, initState, courses, activeLectureId } =
    useCoursesStore();
  const { token, user } = useAuthStore();
  const api = useApi();

  useEffect(() => {
    if (token && user && !courses) {
      initState(api, user.id);
      fetchCourses();
    }
  }, [user?.id, token]);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col w-full flex-grow min-w-0">
        {activeLectureId ? (
          <>
            <LecturePlayer />
            <AIAssistant />
          </>
        ) : (
            <div className="flex flex-1 items-center justify-center">
            <div className="max-w-xl p-4 text-center text-blue-600">
              <p className="text-2xl">Please select a lecture to watch</p>
              <img
              src={lecturesImage}
              alt="No Lecture Selected"
              className="mb-10 mx-auto"
              style={{ width: '300px', height: 'auto' }}
              />
            </div>
            </div>
        )}
      </div>
      <LeftSideMenu />
    </div>
  );
};

export default WatchLecturePage;

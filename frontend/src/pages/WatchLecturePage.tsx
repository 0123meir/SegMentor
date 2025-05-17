import { AIAssistant } from '@/components/AIAssistant';
import LecturePlayer from '@/components/LecturePlayer';
import { LeftSideMenu } from '@/components/LeftSideMenu';
import { useApi } from '@/hooks/useApi';
import useAuthStore from '@/state/AuthStore';
import { useCoursesStore } from '@/state/CoursesStore';
import { useEffect } from 'react';

const WatchLecturePage = () => {
  const { fetchCourses, initState, courses } = useCoursesStore();
  const { token, user } = useAuthStore();

  const api = useApi();

  useEffect(() => {
    console.log('watchLecture: ', token, user);
    if (token && user && !courses) {
      console.log('watchLecture: inside if: ', token, user);
      initState(api, user.id);
      fetchCourses();
    }
  }, [user?.id, token]);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col flex-grow min-w-0">
        <LecturePlayer />
        <AIAssistant />
      </div>
      <LeftSideMenu />
    </div>
  );
};

export default WatchLecturePage;

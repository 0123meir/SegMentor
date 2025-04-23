import { AIAssistant } from '@/components/AIAssistant';
import LecturePlayer from '@/components/LecturePlayer';
import { LeftSideMenu } from '@/components/LeftSideMenu';

export const WatchLecturePage = () => {
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

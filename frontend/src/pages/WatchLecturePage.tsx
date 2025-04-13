import { AIAssistant } from "@/components/AIAssistant";
import LecturePlayer from "@/components/LecturePlayer";
import { LeftSideMenu } from "@/components/LeftSideMenu";

export const WatchLecturePage = () => {
  console.log("WatchLecturePage rendered");
  
  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-grow">
        <LecturePlayer />

        <AIAssistant />
      </div>

      <LeftSideMenu />
    </div>
  );
};

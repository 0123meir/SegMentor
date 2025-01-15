import { AIAssistant } from "@/components/AIAssistant";
import { Collections } from "@/components/Collections";
import LecturePlayer from "@/components/LecturePlayer";

const App = () => {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-grow">
       <LecturePlayer/>

        <AIAssistant/>
      </div>

      <Collections/>
    </div>
  );
};

export default App;

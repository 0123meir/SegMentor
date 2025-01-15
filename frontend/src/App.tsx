import { useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { AIAssistant } from "@/components/AIAssistant";
import { Collections } from "@/components/Collections";
import FileDropZone from "./components/FileDropZone";

const App = () => {


  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-grow">
       <FileDropZone/>

        <AIAssistant/>
      </div>

      <Collections/>
    </div>
  );
};

export default App;

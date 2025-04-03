import { useState } from "react";
import axios from "axios";
import { useSegmentsStore } from "@/state/SegmentsStore";
import { SegmentDto } from "@/types/dtos/SegmentDto";
import { segmentsColors } from "@/utils/Colors";
import { timeToSeconds } from "@/utils/Time";
import { Segment } from "@/types/Segment";

export const useFileUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { setSegments } = useSegmentsStore()
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const response = await axios.post("http://localhost:3000/segments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const segments : SegmentDto[] = response.data.segments.segments

      console.log("Upload successful:", segments);

      const segmentsForTimeline: Segment[] = segments.map((segment, index) => ({
        ...segment,
        color: segmentsColors[index % segmentsColors.length],
        description: segment.summary,
        start: timeToSeconds(segment.start),
        end: timeToSeconds(segment.end)
}))

      setSegments(segmentsForTimeline)

      return segments;

    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
};


import { UseApiType } from '@/hooks/useApi';
import { Segment } from '@/types/Segment';
import { SegmentDto } from '@/types/dtos/SegmentDto';
import { segmentsColors } from '@/utils/Colors';
import { timeToSeconds } from '@/utils/Time';
import { create } from 'zustand';

interface VideoPlayerStore {
  segments: Segment[];
  videoUrl: string | null;
  api: UseApiType | null;
  isVideoLoading: boolean;
  isSegmentsLoading: boolean;
  videoError: string | null;
  segmentError: string | null;
  fetchVideoData: (videoId: string) => void;
  initState: (api: UseApiType) => void;
}

export const useVideoPlayerStore = create<VideoPlayerStore>((set, get) => ({
  videoUrl: null,
  segments: [],
  isVideoLoading: false,
  isSegmentsLoading: false,
  videoError: null,
  segmentError: null,
  api: null,
  initState: (api) => set({ api }),
  fetchVideoData: async (videoId: string) => {
    console.log('videoId', videoId);
    
    try {
      if (!get().api) throw new Error('store not initialized');
      set({ isVideoLoading: true, isSegmentsLoading: true });
console.log('videoId', videoId);
      const videoUrl = await get().api!.get<string>(
        `/videos-service/video/${videoId}`
      );
      console.log('videoUrl', videoUrl);
      set({ videoUrl, isVideoLoading: false });
    } catch (error) {
      console.log(error);
      set({
        videoError: 'Error fetching video url',
        isVideoLoading: false,
        isSegmentsLoading: false,
      });
    }

    try {
      const data = await get().api!.get<SegmentDto[]>(
        `/courses-service/segments/${videoId}`
      );
      const segments: Segment[] = data.map(
        (segment: SegmentDto, index: number) => ({
          ...segment,
          color: segmentsColors[index % segmentsColors.length],
          description: segment.summary,
          start: timeToSeconds(segment.start),
          end: timeToSeconds(segment.end),
        })
      );

      set({ segments, isSegmentsLoading: false });
    } catch (error) {
      console.log(error);
      set({
        segmentError: 'Error fetching segments',
        isSegmentsLoading: false,
      });
    }
  },
}));

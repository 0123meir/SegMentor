import { create } from 'zustand';
import { UseApiType } from '@/hooks/useApi';

interface TranscriptStore {
  api?: UseApiType;
  expandedSummary?: string;
  summaryTitle?: string;
  isLoading: boolean;
  error?: string;
  initState: (api: UseApiType) => void;
  expandSummary: (shortSummary: string, topic?: string) => Promise<void>;
}

export const useTranscriptStore = create<TranscriptStore>((set, get) => ({
  api: undefined,
  expandedSummary: undefined,
  isLoading: false,
  error: undefined,

  initState: (api) => set({ api }),

  expandSummary: async (shortSummary: string, topic?: string) => {
    try {
      if (!get().api) throw new Error('API not initialized');
      set({ isLoading: true, error: undefined });

      const { expandedSummary } = await get().api!.post<{ expandedSummary: string }>(
        '/transcript-service/expand-summary',
        { shortSummary, topic }
      );

      set({ expandedSummary, summaryTitle: topic, isLoading: false });
    } catch (error) {
      console.error(error);
      set({
        error: 'Failed to expand summary',
        isLoading: false,
      });
    }
  },
}));

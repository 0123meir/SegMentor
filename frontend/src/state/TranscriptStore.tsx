import { UseApiType } from '@/hooks/useApi';
import { create } from 'zustand';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface TranscriptStore {
  api?: UseApiType;
  expandedSummary?: string;
  summaryTitle?: string;
  isLoading: boolean;
  error?: string;

  chatHistory: ChatMessage[];
  isChatLoading: boolean;

  initState: (api: UseApiType) => void;
  expandSummary: (shortSummary: string, topic?: string) => Promise<void>;
  chatWithTranscript: (message: string, transcriptId: string) => Promise<void>;
}

export const useTranscriptStore = create<TranscriptStore>((set, get) => ({
  api: undefined,
  expandedSummary: undefined,
  summaryTitle: undefined,
  isLoading: false,
  error: undefined,

  chatHistory: [],
  isChatLoading: false,

  initState: (api) => set({ api }),

  expandSummary: async (shortSummary: string, topic?: string) => {
    try {
      if (!get().api) throw new Error('API not initialized');
      set({ isLoading: true, error: undefined });

      const { expandedSummary } = await get().api!.post<{
        expandedSummary: string;
      }>('/transcript-service/expand-summary', { shortSummary, topic });

      set({ expandedSummary, summaryTitle: topic, isLoading: false });
    } catch (error) {
      console.error(error);
      set({
        error: 'Failed to expand summary',
        isLoading: false,
      });
    }
  },

  chatWithTranscript: async (message: string, transcriptId: string) => {
    try {
      const { api, chatHistory } = get();
      if (!api) throw new Error('API not initialized');

      set({
        chatHistory: [...chatHistory, { role: 'user', content: message }],
        isChatLoading: true,
        error: undefined,
      });

      const response = await api.post<{ answer: string }>(
        '/transcript-service/chat',
        {
          transcriptId,
          history: chatHistory,
          message,
        }
      );

      set({
        chatHistory: [
          ...chatHistory,
          { role: 'user', content: message },
          { role: 'assistant', content: response.answer },
        ],
        isChatLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({
        error: 'Failed to get chat response',
        isChatLoading: false,
      });
    }
  },
}));

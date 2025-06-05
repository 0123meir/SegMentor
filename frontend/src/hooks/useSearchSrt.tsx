import { SearchResultDto } from '@/types/dtos/SearchDto';
import { useApi } from './useApi';
import { useCallback } from 'react';

export const useSearchSrt = () => {
  const { get } = useApi();

  const searchSrt = useCallback(async (fileId: string, prompt: string) => {
    const endpoint = `/transcript-service/search/${fileId}?prompt=${encodeURIComponent(prompt)}`;
    return await get<SearchResultDto[]>(endpoint);
  },[get]);

  return { searchSrt };
};
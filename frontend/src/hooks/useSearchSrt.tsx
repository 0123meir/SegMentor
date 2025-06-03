import { SearchResultDto } from '@/types/dtos/SearchDto';
import { useApi } from './useApi';

export const useSearchSrt = () => {
  const { get } = useApi();

  const searchSrt = async (fileId: string, prompt: string) => {
    const endpoint = `/transcript-service/search/${fileId}?prompt=${encodeURIComponent(prompt)}`;
    return await get<SearchResultDto[]>(endpoint);
  };

  return { searchSrt };
};
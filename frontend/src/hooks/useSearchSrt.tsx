import { useApi } from './useApi'; // adjust path as needed

export const useSearchSrt = () => {
  const { get } = useApi();

  const searchSrt = async (fileId: string, prompt: string) => {
    const endpoint = `/transcript-service/search/${fileId}?prompt=${encodeURIComponent(prompt)}`;
    return await get<{ result: string }>(endpoint);
  };

  return { searchSrt };
};
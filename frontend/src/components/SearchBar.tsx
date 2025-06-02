import { useEffect, useState } from 'react';
import { useSearchSrt } from '@/hooks/useSearchSrt'; // adjust path if needed
import { useCoursesStore } from '@/state/CoursesStore';
import { timeToSeconds } from '@/utils/Time';

export const SearchBar = (props: {onResultClick: (seekTime: number)=> void}) => {
  const { searchSrt } = useSearchSrt();
  const { activeLectureId } = useCoursesStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<
    { index: number; start: string; end: string; text: string }[]
  >([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const run = async () => {
        if (activeLectureId && query.trim().length > 1) {
          try {
            const res = await searchSrt(activeLectureId, query);
            setResults(res);
          } catch (err) {
            console.error('Error searching SRT:', err);
            setResults([]);
          }
        } else {
          setResults([]);
        }
      };
      run();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, activeLectureId]);

  return (
    <div className="w-full max-w-xl mx-auto mt-10 px-4 justify-self-center self-start">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search subtitles..."
          className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white transition"
        />

        {results.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl max-h-64 overflow-y-auto text-white">
            {results.map(res => (
              <li key={res.index} className="px-4 py-2 hover:bg-white/20 transition" onClick={() =>props.onResultClick(timeToSeconds(res.start))}>
                <div className="text-sm text-white/70">
                  {res.start} → {res.end}
                </div>
                <div className="text-base">{res.text}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

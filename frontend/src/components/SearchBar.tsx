import { useEffect, useState } from 'react';
import { useSearchSrt } from '@/hooks/useSearchSrt'; // adjust path if needed
import { useCoursesStore } from '@/state/CoursesStore';
import { timeToSeconds } from '@/utils/Time';
import { SearchResultDto } from '@/types/dtos/SearchDto';
import ProgressBar from './ProgressBar';


export const SearchBar = (props: {onResultClick: (seekTime: number)=> void}) => {
  const { searchSrt } = useSearchSrt();
  const { activeLectureId } = useCoursesStore();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SearchResultDto[]>([]);

  useEffect(() => {
    const DEBOUNCE_TIME_MS = 300;

    const delayDebounce = setTimeout(() => {
      const run = async () => {
        if (activeLectureId && query.trim().length > 1) {
          try {
            setIsLoading(true);
            const res = await searchSrt(activeLectureId, query);
            setResults(res);
          } catch (err) {
            console.error('Error searching SRT:', err);
            setResults([]);
          }
        } else {
          setResults([]);
        }
        setIsLoading(false);
      };
      run();
    }, DEBOUNCE_TIME_MS);

    return () => clearTimeout(delayDebounce);
  }, [query, activeLectureId]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 justify-self-center self-start">
      <div className="relative">
        <div>
      <div className="relative w-full">
  <input
    dir="ltr"
    type="text"
    value={query}
    onChange={e => setQuery(e.target.value)}
    onFocus={() => setShowResults(true)}
    onBlur={() => setShowResults(false)}
    placeholder="Search subtitles..."
    className="w-full mt-5 pr-12 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-white/70 border border-white/20 focus:outline-none transition hover:bg-white/20"
  />

  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none mt-5">
    <svg
      className="w-5 h-5 text-white/70"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
  </div>
</div>

        {isLoading && <ProgressBar/>}
          </div>

{results.length > 0 && showResults && (
  <>
    <ul
      dir="ltr"
      className="custom-scrollbar absolute left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl max-h-64 overflow-y-auto text-white cursor-pointer focus:outline-none"
    >
      {results.map(res => (
        <li
          key={res.index}
          className="px-4 py-2 hover:bg-white/20 transition"
          onClick={() => {
            props.onResultClick(timeToSeconds(res.start));
            setShowResults(false);
          }}
        >
          <div className="text-sm text-white/70">
            {res.start} → {res.end}
          </div>
          <div className="text-base">{res.text}</div>
        </li>
      ))}
    </ul>

    <style>{`
      .custom-scrollbar {
        scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 2rem;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2rem;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2rem;
        border: 0.5rem solid transparent;
        background-clip: padding-box;
      }
    `}</style>
  </>
)}

      </div>
    </div>
  );
};

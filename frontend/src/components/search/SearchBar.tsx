import { useSearchSrt } from '@/hooks/useSearchSrt';
import { useCoursesStore } from '@/state/CoursesStore';
import { SearchResultDto } from '@/types/dtos/SearchDto';
import { timeToSeconds } from '@/utils/Time';
import { detectTextDirection } from '@/utils/detectTextDirection';
import { useEffect, useState } from 'react';

import ProgressBar from '../ProgressBar';
import './SearchBar.css';

const DEBOUNCE_TIME_MS = 300;

export const SearchBar = (props: {
  onResultClick: (seekTime: number) => void;
  handleFocusChange: (value: boolean) => void;
  isFocused: boolean;
}) => {
  const { searchSrt } = useSearchSrt();
  const { activeLectureId } = useCoursesStore();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResultDto[]>([]);

  useEffect(() => {
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
  }, [query, activeLectureId, searchSrt]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 justify-self-center self-start">
      <div className="relative">
        {/* Search input container */}
        <div className="relative flex items-center">
          <div className="absolute left-3 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            dir="ltr"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => props.handleFocusChange(true)}
            onClick={() => props.handleFocusChange(true)} // Add onClick handler
            placeholder="Search in video..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm 
                 text-gray-800 placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300
                 transition-all duration-200"
          />
        </div>

        {isLoading && <ProgressBar />}

        {/* Dropdown container */}
        {results.length > 0 && props.isFocused && (
          <div
            className="absolute w-full mt-2 py-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[33vh] overflow-y-auto"
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* Dropdown items */}
            {results.map((res) => (
              <div
                key={res.index}
                dir={detectTextDirection(res.text)}
                className="hover:bg-blue-50 px-4 py-2 cursor-pointer text-gray-700 select-none"
                onClick={() => {
                  props.onResultClick(timeToSeconds(res.start));
                  props.handleFocusChange(false);
                }}
              >
                <div className="text-sm text-gray-500">
                  {res.start} → {res.end}
                </div>
                <div className="text-base">{res.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import { useCoursesStore } from '@/state/CoursesStore';
import { useTranscriptStore } from '@/state/TranscriptStore';
import useKeyboardLockStore from '@/stores/KeyboardLockStore';
import { detectTextDirection } from '@/utils/detectTextDirection';
import { renderTextWithMath } from '@/utils/renderTextWithMath';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { IoSend as SendIcon } from 'react-icons/io5';

export const AIChat = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const setInputFocused = useKeyboardLockStore((s) => s.setInputFocused);
  const [chatInput, setChatInput] = useState('');
  const [dots, setDots] = useState('');

  const { activeLectureId } = useCoursesStore();
  const { chatHistory, chatWithTranscript, isChatLoading } =
    useTranscriptStore();

  const isChatEmpty = chatHistory.length === 0;

  useEffect(() => {
    if (!isChatLoading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, [isChatLoading]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (isNearBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    setChatInput('');
    await chatWithTranscript(chatInput, activeLectureId!);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-auto space-y-2 mb-2"
      >
        {!isChatEmpty ? (
          chatHistory.map((msg, idx) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={idx}
                className={`flex ${
                  isUser ? 'justify-end' : 'justify-start'
                } w-full px-2 my-1`}
              >
                <div
                  dir={detectTextDirection(msg.content)}
                  className={`px-4 py-2 rounded-xl shadow-sm whitespace-pre-wrap break-words text-sm ${
                    isUser
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-black rounded-bl-none'
                  }`}
                  style={{
                    maxWidth: '75%',
                    width: 'fit-content',
                  }}
                >
                  {renderTextWithMath(msg.content)}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 flex-col">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h2 className="text-lg font-medium text-gray-700">AI Assistant</h2>
            <p className="text-gray-500 text-center">How can i help you?</p>
          </div>
        )}
        {isChatLoading && (
          <div className="self-start text-gray-500 text-3xl">{dots}</div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          className="border rounded-full shadow-sm px-4 py-2 focus:outline-none bg-gray-50 flex-grow"
          placeholder="Type your message..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />
        <button
          type="submit"
          disabled={chatInput.trim() === ''}
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none font-medium rounded-full text-sm px-4 py-4 text-center"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

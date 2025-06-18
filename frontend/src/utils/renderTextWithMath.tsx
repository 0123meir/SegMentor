import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export const renderTextWithMath = (text: string) => {
  const parts = text.split(/(\\\(.+?\\\))/g);

  return parts.map((part, i) => {
    const match = part.match(/\\\((.+)\\\)/);
    if (match) {
      return <InlineMath key={i} math={match[1]} />;
    } else {
      return <span key={i}>{part}</span>;
    }
  });
};

import { Injectable } from '@nestjs/common';
import Fuse from 'fuse.js';

export interface SrtMatch {
  index: number;
  start: string;
  end: string;
  text: string;
}

@Injectable()
export class SearchService {
  private parseSrt(content: string): SrtMatch[] {
    const entries = content.split(/\n{2,}/);
    const matches: SrtMatch[] = [];

    for (const entry of entries) {
      const lines = entry.trim().split('\n');
      if (lines.length >= 3) {
        const index = parseInt(lines[0]);
        const [start, end] = lines[1].split(' --> ');
        const text = lines.slice(2).join(' ');
        matches.push({ index, start, end, text });
      }
    }

    return matches;
  }

  findMatches(content: string, prompt: string, fuzzy = false): SrtMatch[] {
    const entries = this.parseSrt(content);

    if (!fuzzy) {
      return entries.filter((entry) =>
        entry.text.toLowerCase().includes(prompt.toLowerCase()),
      );
    }

    const fuse = new Fuse(entries, {
      keys: ['text'],
      threshold: 0.3,
    });

    return fuse.search(prompt).map(result => result.item);
  }
}

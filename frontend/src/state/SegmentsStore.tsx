import { Segment } from '@/types/Segment'
import { create } from 'zustand'

interface SegmentsStore {
    segments: Segment[],
    setSegments: (value: Segment[]) => void
}

export const useSegmentsStore = create<SegmentsStore>((set) => ({
  segments: [],
  setSegments: (value) => set(() => ({ segments: value })),
}))
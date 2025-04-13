import { Course } from "@/types/Course";
import { create } from "zustand";

interface CourseStore {
  courses: Course[];
  setCources: (value: Course[]) => void;
}

export const useCoursesStore = create<CourseStore>((set) => ({
  courses: [],
  setCources: (value) => set(() => ({ courses: value })),
}));

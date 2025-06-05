export const LectureStatus = {
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
} as const;
export type LectureStatus = (typeof LectureStatus)[keyof typeof LectureStatus];

export interface Lecture {
  _id: string;
  date: string;
  title: string;
  description: string;
  status: LectureStatus;
}

export interface LectureUpdate {
  title: string;
  description: string;
}

export interface Lecturer {
  _id: string;
  username: string;
}

export interface AddCourseRequest {
  name: string;
  lectures: Partial<Lecture>[];
  lecturer: string;
}

export interface Course {
  _id: string;
  name: string;
  lectures: Lecture[];
  lecturer: Lecturer[];
  watchedLectures: string[];
}

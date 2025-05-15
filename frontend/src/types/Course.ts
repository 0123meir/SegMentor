export interface Lecture {
  _id: string;
  date: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
}

export interface Lecturer {
  _id: string;
  name: string;
}

export interface Course {
  _id: string;
  name: string;
  lectures: Partial<Lecture>[];
  lecturer: Partial<string>[];
  watchedLectures: string[];
}

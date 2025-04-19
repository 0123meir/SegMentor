export interface Lecture {
  _id: string;
  title: string;
  date: string;
}

export interface Lecturer {
  _id: string;
  name: string;
}

export interface Course {
  _id: string;
  name: string;
  lectures: Lecture[];
  lecturer: Lecturer;
  watchedLectures: string[];
}

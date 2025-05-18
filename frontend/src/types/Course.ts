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

export interface Lecture {
    id: string;
    title: string;
    date: string;
  }

  export interface Lecturer {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  name: string;
  lectures: Lecture[];
  currentLectureId?: string;
  lecturers: Lecturer[];
}
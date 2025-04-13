interface Lecturer {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  name: string;
  lectures: string[];
  currentLecture: number;
  lecturers: Lecturer[];
}
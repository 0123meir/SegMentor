import { LectureStatus } from './lecture-status.type';

export type Lecture = {
  _id: string;
  title: string;
  date: string;
  description?: string;
  status: LectureStatus;
};

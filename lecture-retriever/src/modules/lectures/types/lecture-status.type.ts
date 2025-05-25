export const LectureStatus = ['In Progress', 'Done'] as const;
export type LectureStatus = (typeof LectureStatus)[number];

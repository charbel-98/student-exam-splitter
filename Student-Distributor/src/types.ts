export interface CourseInputState {
  courseName: string;
  openForm: boolean;
}

export interface ScheduleCourse {
  id: string;
  courseName: string;
  date: string;
  code: string;
  duration: string;
  program: string;
  session: string;
  time: string;
}
export interface Place {
  placeNumber: number;
  roomName: string;
  courseName: string;
}
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  place?: Place;
}
export interface StudentList {
  courseName: string;
  students: Student[];
}
export interface ExamsAtSameTime {
  courseNames: string[];
  date: string;
}

export interface Room {
  id: string;
  roomName: string;
  rows: number | null;
  columns: number | null;
  exams: ExamsAtSameTime[];
}

export interface RoomDownloadData {
  ID: string;
  "First Name": string;
  "Last Name": string;
  Place: string;
  Course: string;
}

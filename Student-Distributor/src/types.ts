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
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  place?: string;
}
export interface StudentList {
  courseName: string;
  courseCode: string;
  students: Student[];
}
export interface Room {
  id: string;
  roomName: string;
  rows: number | null;
  columns: number | null;
  courses: {
    courseName: string;
    date: string;
  }[];
}

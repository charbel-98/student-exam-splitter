import { useState } from 'react';
import nextId from 'react-id-generator';
import * as XLSX from 'xlsx';
import {
  CourseInputState,
  ScheduleCourse,
  StudentList,
  Room,
  Student,
  Place,
  ExamsAtSameTime,
} from '../types';

type ExcelDataStudentState = StudentList[] | [];

export const useExcelHandling = () => {
  //schedule state
  const [excelFileSchedule, setExcelFileSchedule] = useState<
    string | ArrayBuffer | null
  >(null);
  const [excelDataSchedule, setExcelDataSchedule] = useState<
    ScheduleCourse[] | null
  >(null);
  //student state
  const [excelFileStudent, setExcelFileStudent] = useState<
    string | ArrayBuffer | null
  >(null);
  const [excelDataStudent, setExcelDataStudent] =
    useState<ExcelDataStudentState>([]);

  const [typeError, setTypeError] = useState<string | null>(null);

  //? rooms state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [openRoomInput, setOpenRoomInput] = useState<CourseInputState[] | []>(
    [],
  );
  const [showRoomModel, setShowRoomModel] = useState<boolean>(false);
  // onchange event
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];

    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        if (e.target.name === 'Schedule') {
          setTypeError(null);
          const reader = new FileReader();
          reader.readAsArrayBuffer(selectedFile);
          reader.onload = (e) => {
            if (e.target && e.target.result !== null)
              setExcelFileSchedule(e.target.result as string | ArrayBuffer);
          };
        } else if (e.target.name === 'Student') {
          setTypeError(null);
          const reader = new FileReader();
          reader.readAsArrayBuffer(selectedFile);
          reader.onload = (e) => {
            if (e.target && e.target.result !== null)
              setExcelFileStudent(e.target.result as string | ArrayBuffer);
          };
        } else {
          setTypeError('Please select only excel file types');
          setExcelFileSchedule(null);
        }
      } else {
        console.log('Please select your file');
      }
    }
  };
  // submit event

  const handleScheduleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (excelFileSchedule !== null) {
      const workbook = XLSX.read(excelFileSchedule, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      //rename data keys to match the ScheduleCourse type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.forEach((item: any, index: number) => {
        item.id = nextId('course-');
        item.courseName = item['Course Name'];
        item.date =
          item['Date'] ||
          (index > 0 ? (data[index - 1] as ScheduleCourse).date : undefined);
        item.code = item['Code'];
        item.duration = item['Duration'];
        item.program = item['Program'];
        item.session =
          item['Session'] ||
          (index > 0 ? (data[index - 1] as ScheduleCourse).session : undefined);
        item.time = new Date(
          item['Start Time'] * 24 * 60 * 60 * 1000,
        ).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC',
        });
        delete item['Course Name'];
        delete item['Date'];
        delete item['Code'];
        delete item['Duration'];
        delete item['Program'];
        delete item['Session'];
        delete item['Start Time'];

        setOpenRoomInput((prev) => {
          return [
            ...prev,
            {
              courseName: item.courseName,
              openForm: false,
            } as CourseInputState,
          ];
        });

        setExcelDataSchedule(data as ScheduleCourse[]);
      });
    }
  };
  console.log(excelDataSchedule);
  const handleStudentSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setExcelDataStudent([]);
    if (excelFileStudent !== null) {
      const workbook = XLSX.read(excelFileStudent, { type: 'buffer' });
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        const course = excelDataSchedule?.find(
          (course) => course.courseName === sheetName,
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.forEach((item: any) => {
          item.id = item['ID'];
          item.firstName = item['First Name'];
          item.lastName = item['Last Name'];

          delete item['ID'];
          delete item['First Name'];
          delete item['Last Name'];
        });
        setExcelDataStudent((prev) => {
          return [
            ...prev,
            {
              courseName: course?.courseName,
              students: data as Student[],
            },
          ] as ExcelDataStudentState;
        });
      });
    }
  };
  console.log(rooms);
  console.log(excelDataStudent);
  const splitStudents = () => {
    rooms.forEach((room) => {
      const rows = room.rows;
      const columns = room.columns;
      if (!rows || !columns) return;
      room.exams?.forEach((exam) => {
        console.error(rooms);
        if (exam.courseNames.length === 1) {
          handleSingleCourse(exam, room);
        } else if (exam.courseNames.length === 2) {
          handleDoubleCourse(exam, room);
        }
      });
    });
    setShowRoomModel(true);
  };

  const handleSingleCourse = (exam: ExamsAtSameTime, room: Room) => {
    setExcelDataStudent((prev) => {
      return prev.map((studentList) => {
        if (studentList.courseName === exam.courseNames[0]) {
          //slice the studentList into 2 arrays one that has places and one that doesn't
          const studentsWithPlaces = studentList.students.filter(
            (student) => student.place,
          );
          const studentsWithoutPlaces = studentList.students.filter(
            (student) => !student.place,
          );
          console.error(studentsWithPlaces);
          console.error(studentsWithoutPlaces);
          if (room.columns! % 2 === 0) {
            handleEvenColumns(
              studentsWithoutPlaces,
              room.columns!,
              room.rows!,
              exam.courseNames,
              room.roomName!,
              false,
              false,
            );
          } else {
            handleOddColumns(
              studentsWithoutPlaces,
              room.columns!,
              room.rows!,
              exam.courseNames,
              room.roomName!,
              false,
              false,
            );
          }
          return {
            courseName: studentList.courseName,
            students: [...studentsWithPlaces, ...studentsWithoutPlaces],
          } as StudentList;
        } else {
          console.log('Course not found');
          return studentList as StudentList;
        }
      }) as StudentList[];
    });
  };
  const handleDoubleCourse = (exam: ExamsAtSameTime, room: Room) => {
    setExcelDataStudent((prev) => {
      return prev.map((studentList) => {
        if (studentList.courseName === exam.courseNames[0]) {
          const studentsWithPlaces = studentList.students.filter(
            (student) => student.place,
          );
          const studentsWithoutPlaces = studentList.students.filter(
            (student) => !student.place,
          );

          if (room.columns! % 2 === 0) {
            handleEvenColumns(
              studentsWithoutPlaces,
              room.columns!,
              room.rows!,
              exam.courseNames,
              room.roomName!,
              false,
              true,
            );
          } else {
            handleOddColumns(
              studentsWithoutPlaces,
              room.columns!,
              room.rows!,
              exam.courseNames,
              room.roomName!,
              false,
              true,
            );
          }
          return {
            courseName: studentList.courseName,
            students: [...studentsWithPlaces, ...studentsWithoutPlaces],
          } as StudentList;
        } else if (studentList.courseName === exam.courseNames[1]) {
          const studentsWithPlaces = studentList.students.filter(
            (student) => student.place,
          );
          const studentsWithoutPlaces = studentList.students.filter(
            (student) => !student.place,
          );
          const isSecondCourse = true;
          if (room.columns! % 2 === 0) {
            handleEvenColumns(
              studentsWithoutPlaces,
              room.columns!,
              room.rows!,
              exam.courseNames,
              room.roomName!,
              isSecondCourse,
              true,
            );
          } else {
            handleOddColumns(
              studentsWithoutPlaces,
              room.columns!,
              room.rows!,
              exam.courseNames,
              room.roomName!,
              isSecondCourse,
              true,
            );
          }
          return {
            courseName: studentList.courseName,
            students: [...studentsWithPlaces, ...studentsWithoutPlaces],
          } as StudentList;
        } else {
          console.log('Course not found');
          return studentList as StudentList;
        }
      }) as StudentList[];
    });
  };

  const handleEvenColumns = (
    students: Student[],
    columns: number,
    rows: number,
    courseNames: string[],
    roomName: string,
    isSecondCourse?: boolean,
    isDoubleCourse?: boolean,
  ) => {
    let counter = isSecondCourse ? 2 : 1;
    let edgeCounter = 0;
    return students.map((student, index) => {
      if (
        ((index + 1) * 2) % columns! === 0 &&
        index < (rows! * columns!) / 2
      ) {
        student.place = {
          placeNumber: counter,
          roomName: roomName,
          courseName: courseNames[0],
        } as Place;
        if (isSecondCourse) {
          edgeCounter % 2 !== 0 ? (counter += 3) : (counter += 1);
        } else if (!isSecondCourse && isDoubleCourse) {
          edgeCounter % 2 === 0 ? (counter += 3) : (counter += 1);
        } else counter += 2;
        edgeCounter++;
      }

      if (
        ((index + 1) * 2) % columns! !== 0 &&
        index < (rows! * columns!) / 2
      ) {
        student.place = {
          placeNumber: counter,
          roomName: roomName,
          courseName: courseNames[0],
        } as Place;
        counter += 2;
      }
    });
  };
  const handleOddColumns = (
    students: Student[],
    columns: number,
    rows: number,
    courseNames: string[],
    roomName: string,
    isSecondCourse?: boolean,
    isDoubleCourse?: boolean,
  ) => {
    let counter = isSecondCourse ? 2 : 1;
    let edgeCounter = 1;
    students.map((student, index) => {
      if (isDoubleCourse && index < (rows! * columns!) / 2) {
        student.place = {
          placeNumber: counter,
          roomName: roomName,
          courseName: courseNames[0],
        } as Place;
        counter += 2;
      } else if (index < (rows! * columns!) / 2) {
        student.place = {
          placeNumber: counter,
          roomName: roomName,
          courseName: courseNames[0],
        } as Place;
        if (((index + 1) * 2) % columns! === edgeCounter) {
          counter += 1;
          edgeCounter++;
        } else {
          counter += 2;
        }
      }
    });
  };

  return {
    excelFileSchedule,
    setExcelFileSchedule,
    excelDataSchedule,
    setExcelDataSchedule,
    excelFileStudent,
    setExcelFileStudent,
    excelDataStudent,
    typeError,
    setTypeError,
    rooms,
    setRooms,
    openRoomInput,
    setOpenRoomInput,
    showRoomModel,
    setShowRoomModel,
    handleFile,
    handleScheduleSubmit,
    handleStudentSubmit,
    splitStudents,
  };
};

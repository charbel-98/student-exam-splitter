import { ScheduleCourse, Student, StudentList } from '../types.ts';

const universityName = 'University Antonine';
const facultyName = 'Faculty of Engineering';
const semester = 'Final S2 2023-2024';

const defaultBorderStyle = {
  top: { style: 'thick' },
  bottom: { style: 'thick' },
  left: { style: 'thick' },
  right: { style: 'thick' },
};
const createEmptyCell = () => {
  return { v: '', t: 's' };
};

const createCell = (
  value: string,
  bold = false,
  italic = false,
  border = false,
  alignment: any = { horizontal: 'left' },
) => {
  return {
    v: value,
    t: 's',
    s: {
      font: { bold, italic },
      alignment,
      ...(border && { border: defaultBorderStyle }),
    },
  };
};

function splitStudentListByRoom(studentList: StudentList) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const splitedStudents: any = {};
  studentList.students.forEach((student) => {
    if (student.place) {
      const value = student.place.roomName;

      if (!splitedStudents[value]) {
        splitedStudents[value] = {
          courseName: studentList.courseName,
          students: [],
        }; // Create a new array for the value if it doesn't exist
      }

      splitedStudents[value].students.push(student); // Push the object to the array corresponding to the value
    } else {
      if (!splitedStudents.noPlace) {
        splitedStudents['noPlace'] = {
          courseName: studentList.courseName,
          students: [],
        }; // Create a new array for the value if it doesn't exist
      }

      splitedStudents['noPlace'].students.push(student);
    }
  });

  return Object.values(splitedStudents);
}

const getHeaderInfo = (exam: ScheduleCourse) => {
  const dateObj = new Date(exam.date);
  const date =
    'Date: ' +
    dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  const courseCode = `Course: ${exam.code}`;
  const courseName = exam.courseName;
  const timeString = exam?.time.split(':');
  const durationString = exam?.duration.split('h');
  const time = `${timeString?.[0]}h${timeString?.[1].split(' ')[0]}-${parseInt(timeString?.[0]) + parseInt(durationString?.[0])}h${+timeString?.[1].split(' ')[0] + +durationString?.[1].slice(0, -1)}`;

  return { date, courseCode, courseName, time };
};

const createHeaderRows = (
  courseCode: string,
  courseName: string,
  date: string,
  time: string,
  room: string,
  isRoom?: boolean,
) => {
  if (!isRoom) {
    return [
      [
        {
          v: universityName,
          t: 's',
          s: {
            font: { bold: true, sz: 24 },
            alignment: { horizontal: 'left' },
          },
        },
        { v: '', t: 's' },
        { v: '', t: 's' },
      ],
      [createCell(facultyName, false, true)],
      [createCell(semester, false, true)],
      [],
      [
        createCell(date),
        createEmptyCell(),
        createEmptyCell(),
        createEmptyCell(),
        createEmptyCell(),
        createCell(time),
      ],
      [
        createCell(courseCode, false, true),
        createEmptyCell(),
        createEmptyCell(),
        createEmptyCell(),
        createEmptyCell(),
        createCell(courseName),
      ],
      [createCell(room, false, true)],
      [],
    ];
  }

  return [
    [
      {
        v: universityName,
        t: 's',
        s: {
          font: { bold: true, sz: 24 },
          alignment: { horizontal: 'left' },
        },
      },
      { v: '', t: 's' },
      { v: '', t: 's' },
    ],
    [createCell(facultyName, false, true)],
    [createCell(semester, false, true)],
    [],
    [
      createCell(date),
      createEmptyCell(),
      createEmptyCell(),
      createEmptyCell(),
      createEmptyCell(),
      createCell(time),
    ],
    [
      createCell(courseCode, false, true),
      createEmptyCell(),
      createEmptyCell(),
      createEmptyCell(),
      createEmptyCell(),
      createCell(courseName),
    ],
    [createCell(room, false, true)],
    [],
  ];
};

const createExcelFooter = () => {
  return [
    [],
    [
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('Proctor Name And Signature', true, true, true),
      createCell('', false, false, true),
    ],
    [
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('Number Of Copies', true, true, true),
      createCell('', false, false, true),
    ],
    [
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('Number Of Absences', true, true, true),
      createCell('', false, false, true),
    ],
    [
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('', false, false, false),
      createCell('Special Notes', true, true, true),
      createCell('', false, false, true),
    ],
  ];
};

const createStudentRows = (students: Student[], isRoom: boolean) => {
  const headerCells = [
    createCell('NO', true, true, true),
    createCell('ID', true, true, true),
    createCell('First Name', true, true, true),
    createCell('Last Name', true, true, true),
    createCell('Place', true, true, true),
    !isRoom ? createCell('Signature', true, true, true) : createEmptyCell(),
  ];

  const rows = [
    headerCells,
    ...students.map((student, index) => [
      createCell(String(index + 1), false, false, true),
      createCell(student.id, false, false, true),
      createCell(student.firstName, false, false, true),
      createCell(student.lastName, false, false, true),
      createCell(
        String(student?.place?.placeNumber || 'unplaced'),
        false,
        false,
        true,
      ),
      createCell('', false, false, true),
    ]),
    ...createExcelFooter(),
  ];

  return rows;
};

export {
  createCell,
  createEmptyCell,
  createExcelFooter,
  createHeaderRows,
  createStudentRows,
  getHeaderInfo,
  splitStudentListByRoom,
};

import { useState } from 'react';
import * as XLSX from 'xlsx-js-style';
import {
  createCell,
  createHeaderRows,
  createStudentRows,
  getHeaderInfo,
  splitStudentListByRoom,
} from './excelDownloaderHelper';
import { StudentList, ScheduleCourse, Room } from '../types.ts';

interface ExcelDownloaderProps {
  excelDataStudent: StudentList[];
  excelDataSchedule: ScheduleCourse[] | null;
  rooms: Room[];
}

export const useExcelDownloader = ({
  excelDataStudent,
  excelDataSchedule,
  rooms,
}: ExcelDownloaderProps) => {
  const [faculty, setFaculty] = useState<string>('');
  const [semester, setSemester] = useState<string>('');

  const handleCourseDownload = () => {
    const wb = XLSX.utils.book_new();
    excelDataStudent.forEach((studentList) => {
      const exam = excelDataSchedule?.find(
        (c) => c.courseName === studentList.courseName,
      );
      const { date, courseCode, courseName, time } = getHeaderInfo(exam!);

      (splitStudentListByRoom(studentList) as StudentList[]).forEach((list) => {
        const roomName = `Room: ${list.students[0].place?.roomName || 'No Room'}`;
        const rows = createHeaderRows(
          faculty,
          semester,
          courseCode,
          courseName,
          date,
          time,
          roomName,
          false,
        );
        // const processedStudents = processStudents(list.students);
        rows.push(...createStudentRows(list.students, false));
        const merges = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Merge university name
          { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Merge faculty
          { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }, // Merge semester
          { s: { r: 4, c: 0 }, e: { r: 4, c: 2 } }, // Merge date
          { s: { r: 5, c: 0 }, e: { r: 5, c: 3 } }, // Merge program
          { s: { r: 6, c: 0 }, e: { r: 6, c: 3 } }, // Merge room
        ];

        const colWidths = [
          { wch: 4 },
          { wch: 9 },
          { wch: 20 },
          { wch: 20 },
          { wch: 10 },
          { wch: 25 },
          { wch: 20 },
          // Add more objects for additional columns if needed
        ];

        const ws = XLSX.utils.aoa_to_sheet(rows);
        // Merge cells

        ws['!merges'] = merges;
        ws['!cols'] = colWidths;
        // const ws = XLSX.utils.json_to_sheet(processedStudents);
        const roomInExcelTitle = list.students[0].place?.roomName || 'unplaced';
        XLSX.utils.book_append_sheet(
          wb,
          ws,
          list.courseName + '  ' + roomInExcelTitle,
        );
      });
    });
    XLSX.writeFile(wb, 'Courses.xlsx');
  };

  const handleRoomDownload = () => {
    const wb = XLSX.utils.book_new();

    rooms.forEach((roomData) => {
      roomData.exams.forEach((exam) => {
        const course = excelDataSchedule?.find(
          (s) => s.courseName === exam.courseNames[0],
        );

        const { date, time } = getHeaderInfo(course!);
        const room = `Room: ${roomData.roomName}`;

        const rows = createHeaderRows(
          faculty,
          semester,
          course?.code || '',
          course?.courseName || '',
          date,
          time,
          room,
          true,
        );
        const examDate = new Date(exam.date)
          .toLocaleDateString()
          .split('/')
          .join('-');

        const wsName = `${roomData.roomName} ${examDate} ${exam.time.split(':').join('-')}`;
        rows.push([
          createCell('No.', true, true, true),
          createCell('ID', true, true, true),
          createCell('First Name', true, true, true),
          createCell('Last Name', true, true, true),
          createCell('Place', true, true, true),
          createCell('Course', true, true, true),
        ]);
        exam.courseNames.forEach((course) => {
          const studentsInThisCourse = excelDataStudent.find(
            (studentList) => studentList.courseName === course,
          );

          studentsInThisCourse?.students.forEach((student, i) => {
            if (student.place?.roomName === roomData.roomName) {
              rows.push([
                createCell(String(++i), false, false, true),
                createCell(student.id, false, false, true),
                createCell(student.firstName || '', false, false, true),
                createCell(student.lastName || '', false, false, true),
                createCell(
                  String(student.place?.placeNumber),
                  false,
                  false,
                  true,
                ),
                createCell(course, false, false, true),
              ]);
            }
          });
        });
        // rows.push(...createExcelFooter());
        const merges = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Merge university name
          { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Merge faculty
          { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }, // Merge semester
          { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } }, // Merge room
          { s: { r: 6, c: 2 }, e: { r: 6, c: 3 } }, // Merge room
          { s: { r: 6, c: 4 }, e: { r: 6, c: 5 } }, // Merge room
        ];

        const colWidths = [
          { wch: 4 },
          { wch: 9 },
          { wch: 20 },
          { wch: 20 },
          { wch: 6 },
          { wch: 25 },
          { wch: 20 },
        ];

        const ws = XLSX.utils.aoa_to_sheet(rows);

        ws['!merges'] = merges;
        ws['!cols'] = colWidths;
        XLSX.utils.book_append_sheet(wb, ws, wsName);
      });
    });

    XLSX.writeFile(wb, 'Rooms.xlsx');
  };

  return { handleCourseDownload, handleRoomDownload, setFaculty, setSemester };
};

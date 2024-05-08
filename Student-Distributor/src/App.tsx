import Nav from "./components/Nav";
import { DownloadButton, UploadButton } from "./components/UploadButton";
import { CourseInputState, RoomDownloadData, StudentList } from "./types";
import Course from "./components/Course";
import RoomRow from "./components/Room";
import RoomModel from "./components/RoomModel";
import { AnimatePresence } from "framer-motion";
import { useExcelHandling } from "./hooks/useExcelHandling";
import { Show } from "./components/Show";
import * as XLSX from "xlsx-js-style";
function App() {
  const {
    excelFileSchedule,
    // setExcelFileSchedule,
    excelDataSchedule,
    setExcelDataSchedule,
    excelFileStudent,
    // setExcelFileStudent,
    excelDataStudent,
    typeError,
    // setTypeError,
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
  } = useExcelHandling();
  const handleCourseDownload = () => {
    const universityName = "University Antonine";
    const facultyName = "Faculty of Engineering";
    const semester = "Final S2 2023-2024";
    const date = "Date: 25/3/2021";
    const time = "8h30-9h30";
    const course1 = "Prog 305";
    const course2 = "Web multimedia technologies";
    const room = "Room: C1.8";
    const wb = XLSX.utils.book_new();
    excelDataStudent.forEach((studentList) => {
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
              splitedStudents["noPlace"] = {
                courseName: studentList.courseName,
                students: [],
              }; // Create a new array for the value if it doesn't exist
            }

            splitedStudents["noPlace"].students.push(student);
          }
        });

        return Object.values(splitedStudents);
      }
      (splitStudentListByRoom(studentList) as StudentList[]).forEach((list) => {
        let rows = [
          [
            { v: universityName, t: "s", s: { font: { bold: true, sz: 24 }, alignment: { horizontal: "left" } } },
            { v: "", t: "s" },
            { v: "", t: "s" }
          ],
          [
            { v: facultyName, t: "s", s: { font: { italic: true }, alignment: { horizontal: "left" } } },
            { v: "", t: "s" },
            { v: "", t: "s" }
          ],
          [
            { v: semester, t: "s", s: { font: { italic: true }, alignment: { horizontal: "left" } } },
            { v: "", t: "s" },
            { v: "", t: "s" }
          ],
          [],
          [
            { v: date, t: "s", s: { alignment: {  horizontal: "left" } } },

          ],

          [
            { v: course1, t: "s", s: { font: { italic: true }, alignment: { horizontal: "left" } } },
            { v: "", t: "s" },
            { v: "", t: "s" },
            { v: "", t: "s" },
            { v: "", t: "s" },
            { v: time, t: "s", s: { alignment: {  horizontal: "left" } } },

          ],

          [
            { v: room, t: "s", s: { font: { italic: true }, alignment: { horizontal: "left" } } },
            { v: "", t: "s" },
            { v: "", t: "s" },
            { v: "", t: "s" },
            { v: "", t: "s" },
            { v: course2, t: "s", s: { font: { italic: true }, alignment: { horizontal: "left" } } },
          ],
          [],
          [
            { v: "NO", t: "s", s: { font: { bold: true, italic: true }, border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },

            { v: "ID", t: "s", s: { font: { bold: true, italic: true }, border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
            { v: "Last Name", t: "s", s: { font: { bold: true, italic: true }, border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
            { v: "First Name", t: "s", s: { font: { bold: true, italic: true }, border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
            { v: "Place", t: "s", s: { font: { bold: true, italic: true }, border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
            { v: "Signature", t: "s", s: { font: { bold: true, italic: true }, border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } }
          ]
        ];
        const processedStudents = list.students.map((student) => ({
          ID: student.id,
          "Last Name": student.lastName || "",
          "First Name": student.firstName || "",
          Place: student?.place?.placeNumber ?? "unplaced", // Use placeNumber from the nested place object
          Signature: "",
        }));
        processedStudents.forEach((student,i) => {
          rows.push([
            { v: String(++i), t: "s", s: { border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },

            { v: student.ID, t: "s", s: { border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
            { v: student["Last Name"] || "", t: "s", s: { border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
            { v: student["First Name"], t: "s", s: { border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
            { v: String(student.Place), t: "s", s: { border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
            { v: "", t: "s", s: { border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } }
          ]);
        });
        // Merge cells for university name, faculty, semester, date, program, and room
        const merges = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Merge university name
          { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Merge faculty
          { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }, // Merge semester
          { s: { r: 4, c: 0 }, e: { r: 4, c: 2 } }, // Merge date
          { s: { r: 5, c: 0 }, e: { r: 5, c: 3 } }, // Merge program
          { s: { r: 6, c: 0 }, e: { r: 6, c: 3 } } // Merge room
        ];

        const colWidths = [
          { wch: 4 }, // width of column A
          { wch: 9 }, // width of column B
          { wch: 20 }, // width of column C
          { wch: 20 }, // width of column D
          { wch: 10 },  // width of column E
          { wch: 20},
          // Add more objects for additional columns if needed
        ];

        const ws = XLSX.utils.aoa_to_sheet(rows);
        // Merge cells

        ws["!merges"] = merges;
        ws["!cols"]= colWidths;
        // const ws = XLSX.utils.json_to_sheet(processedStudents);
        const roomInExcelTitle = list.students[0].place?.roomName || "unplaced";
        XLSX.utils.book_append_sheet(
          wb,
          ws,
          list.courseName + "  " + roomInExcelTitle
        );
      });
    });
    XLSX.writeFile(wb, "Students.xlsx");
  };
  const handleRoomDownload = () => {
    const universityName = "University Antonine";
    const facultyName = "Faculty of Engineering";
    const semester = "Final S2 2023-2024";
    const date = "Date: 25/3/2021";
    const time = "8h30-9h30";
    const course1 = "Prog 305";
    const course2 = "Web multimedia technologies";
    const room = "Room: C1.8";

    const wb = XLSX.utils.book_new();

    rooms.forEach((roomData) => {
      roomData.exams.forEach((exam, i) => {
        const examDate = new Date(exam.date).toLocaleDateString().split("/").join("-");
        const wsName = `${roomData.roomName} ${examDate} ${exam.time.split(":").join("-")}`;

        let rows = [
          [
            { v: universityName, t: "s", s: { font: { bold: true, sz: 24 }, alignment: { horizontal: "left" } } },
            { v: "", t: "s" },
            { v: "", t: "s" }
          ],
          [
            { v: facultyName, t: "s", s: { font: { italic: true }, alignment: { horizontal: "left" } } },
            { v: "", t: "s" },
            { v: "", t: "s" }
          ],
          [
            { v: semester, t: "s", s: { font: { italic: true }, alignment: { horizontal: "left" } } },
            { v: "", t: "s" },
            { v: "", t: "s" }
          ],
          [],
          [
            { v: date, t: "s", s: { alignment: {  horizontal: "left" } } },

          ],

          [
            { v: course1, t: "s", s: { font: { italic: true }, alignment: { horizontal: "left" } } },
            { v: "", t: "s" },
            { v: "", t: "s" },
            { v: "", t: "s" },
            { v: "", t: "s" },
            { v: time, t: "s", s: { alignment: {  horizontal: "left" } } },

          ],

          [
            { v: room, t: "s", s: { font: { italic: true }, alignment: { horizontal: "left" } } },
            { v: "", t: "s" },
            { v: "", t: "s" },
            { v: "", t: "s" },
            { v: "", t: "s" },
            { v: course2, t: "s", s: { font: { italic: true }, alignment: { horizontal: "left" } } },
          ],
          [],
          [
            { v: "NO", t: "s", s: { font: { bold: true, italic: true }, border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },

            { v: "ID", t: "s", s: { font: { bold: true, italic: true }, border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
            { v: "Last Name", t: "s", s: { font: { bold: true, italic: true }, border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
            { v: "First Name", t: "s", s: { font: { bold: true, italic: true }, border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
            { v: "Place", t: "s", s: { font: { bold: true, italic: true }, border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
            // { v: "Course", t: "s", s: { font: { bold: true, italic: true }, border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } }
          ]
        ];

        exam.courseNames.forEach(course => {
          const studentsInThisCourse = excelDataStudent.find((studentList) => studentList.courseName === course);
          studentsInThisCourse?.students.forEach((student, i) => {
            if (student.place?.roomName === roomData.roomName) {
              rows.push([
                { v: String(++i), t: "s", s: { border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },

                { v: student.id, t: "s", s: { border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
                { v: student.lastName, t: "s", s: { border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
                { v: student.firstName, t: "s", s: { border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
                { v: String(student.place?.placeNumber), t: "s", s: { border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } },
                // { v: course, t: "s", s: { border: { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thick" }, right: { style: "thick" } } } }
              ]);
            }
          });
        });

        // Merge cells for university name, faculty, semester, date, program, and room
        const merges = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Merge university name
          { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Merge faculty
          { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }, // Merge semester
          { s: { r: 4, c: 0 }, e: { r: 4, c: 2 } }, // Merge date
          { s: { r: 5, c: 0 }, e: { r: 5, c: 3 } }, // Merge program
          { s: { r: 6, c: 0 }, e: { r: 6, c: 3 } } // Merge room
        ];

        const colWidths = [
          { wch: 4 }, // width of column A
          { wch: 9 }, // width of column B
          { wch: 20 }, // width of column C
          { wch: 20 }, // width of column D
          { wch: 6 }  // width of column E
          // Add more objects for additional columns if needed
        ];

        const ws = XLSX.utils.aoa_to_sheet(rows);
        // Merge cells

        ws["!merges"] = merges;
        ws["!cols"]= colWidths;
        XLSX.utils.book_append_sheet(wb, ws, wsName);
      });
    });

    XLSX.writeFile(wb, "Rooms.xlsx");
  };



  return (
    <>
      <Nav></Nav>
      <div className="flex justify-around mt-12">
        <UploadButton
          handleFile={handleFile}
          excelFileSchedule={excelFileSchedule}
          excelFileStudent={excelFileStudent}
          text="Upload Schedule"
          submit={
            handleScheduleSubmit as (
              e: React.FormEvent<HTMLFormElement>
            ) => void
          }
        ></UploadButton>
        {typeError && <p className="text-red-500">{typeError}</p>}

        <UploadButton
          text="Upload Student List"
          excelFileSchedule={excelFileSchedule}
          excelFileStudent={excelFileStudent}
          handleFile={handleFile}
          submit={
            handleStudentSubmit as (e: React.FormEvent<HTMLFormElement>) => void
          }
        ></UploadButton>
        {typeError && <p className="text-red-500">{typeError}</p>}
      </div>
      <div>
        <h2 className="mt-12 font-roboto ms-16 text-3xl">Detected Courses</h2>
        <ul className="px-10 py-8 flex flex-col items-center gap-4 ">
          <Show>
            <Show.When
              isTrue={
                excelDataSchedule !== null &&
                excelDataSchedule !== undefined &&
                Array.isArray(excelDataSchedule) &&
                excelDataSchedule.length > 0
              }
            >
              {excelDataSchedule?.map((course, index) => (
                <Course
                  time={course.time}
                  key={index}
                  courseName={course.courseName}
                  date={course.date + " " + course.time}
                  duration={course.duration}
                  session={course.session}
                  students={
                    excelDataStudent?.find(
                      (student) => student.courseName === course.courseName
                    )?.students.length || 0
                  }
                  openRoomInput={
                    openRoomInput.filter(
                      (item) => item.courseName === course.courseName
                    )[0] as CourseInputState
                  }
                  setOpenRoomInput={setOpenRoomInput}
                  rooms={rooms}
                  setRooms={setRooms}
                  setCourse={setExcelDataSchedule}
                ></Course>
              ))}
            </Show.When>
            <Show.Else>
              <p className="font-roboto text-gray-400 text-opacity-90 text-md px-12  self-start">
                No courses detected
              </p>
            </Show.Else>
          </Show>
        </ul>
      </div>
      <div>
        <h2 className="mt-12 font-roboto ms-16 text-3xl">Rooms</h2>
        <ul className="px-10 py-8 flex flex-col items-center gap-4 ">
          <Show>
            <Show.When isTrue={rooms.length > 0}>
              {rooms.map((room, index) => (
                <RoomRow
                  key={index}
                  roomName={room?.roomName}
                  courseName={room?.exams
                    ?.map((exam) => exam.courseNames)
                    .join()}
                  rows={room?.rows || 0}
                  columns={room?.columns || 0}
                  editRoom={setRooms}
                  hideModel={() => setShowRoomModel(!showRoomModel)}
                >
                  <div className="flex gap-5">
                    <AnimatePresence>
                      {room.exams?.map((exam, index) => {
                        return (
                          <RoomModel
                            key={index}
                            exam={exam}
                            roomName={room.roomName}
                            students={excelDataStudent.filter((studentList) =>
                              exam.courseNames.includes(studentList.courseName)
                            )}
                            rows={room.rows!}
                            columns={room.columns!}
                            showRoomModel={showRoomModel}
                          ></RoomModel>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </RoomRow>
              ))}
            </Show.When>
            <Show.Else>
              <p className="font-roboto text-gray-400 text-opacity-90 text-md px-12  self-start">
                No rooms detected
              </p>
            </Show.Else>
          </Show>
        </ul>

        <button
          onClick={splitStudents}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Place Students
        </button>
      </div>
      <div className=" flex justify-around w-full">
        <DownloadButton
          text="Download Course Sheets"
          onClick={handleCourseDownload}
        ></DownloadButton>
        <DownloadButton
          text="Download Room Sheets"
          onClick={handleRoomDownload}
        ></DownloadButton>
      </div>
    </>
  );
}

export default App;

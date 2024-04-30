import Nav from "./components/Nav";
import { DownloadButton, UploadButton } from "./components/UploadButton";
import { CourseInputState, RoomDownloadData, StudentList } from "./types";
import Course from "./components/Course";
import RoomRow from "./components/Room";
import RoomModel from "./components/RoomModel";
import { AnimatePresence } from "framer-motion";
import { useExcelHandling } from "./hooks/useExcelHandling";
import { Show } from "./components/Show";
import * as XLSX from "xlsx";
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
        const processedStudents = list.students.map((student) => ({
          ID: student.id,
          "Last Name": student.lastName,
          "First Name": student.firstName,
          Place: student?.place?.placeNumber, // Use placeNumber from the nested place object
          Signature: "",
        }));
        const ws = XLSX.utils.json_to_sheet(processedStudents);
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
    const wb = XLSX.utils.book_new();

    rooms.forEach((room) => {
      room.exams.forEach((exam, i) => {
        let result = [];

        exam.courseNames.forEach((course) => {
          const studentsInThisCourse = excelDataStudent.find(
            (studentList) => studentList.courseName === course
          );

          studentsInThisCourse?.students.forEach((student) => {
            if (student.place?.roomName === room.roomName) {
              result.push({
                ID: student.id,
                "Last Name": student.lastName,
                "First Name": student.firstName,
                Place: String(student?.place?.placeNumber),
                Course: course,
              });
            }
          });
        });

        const date = new Date(exam.date)
          .toLocaleDateString()
          .split("/")
          .join("-");
        const wsName = `${room.roomName} ${date} ${exam.time}`;
        const ws = XLSX.utils.json_to_sheet(result, {
          header: ["ID", "Last Name", "First Name", "Place", "Course"],
        });

        // Add university name and faculty as text before table
        // ws["A1"] = {
        //   t: "s",
        //   v: "University Name: YourUniversity",
        //   s: { font: { bold: true } },
        // };
        // ws["A2"] = {
        //   t: "s",
        //   v: "Faculty: YourFaculty",
        //   s: { font: { bold: true } },
        // };

        // Merge cells for university name and faculty text
        // ws["!merges"] = [
        //   { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Merge for University Name
        //   { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Merge for Faculty
        //   // Add empty merged cells for spacing
        //   { s: { r: 2, c: 0 }, e: { r: 4, c: 4 } }, // Empty merged cells between university name/faculty and the table
        // ];

        // Set print options
        // const wsPrintOptions = {
        //   printTitles: "$A$1:$E$5", // Set the print title to include the first four rows
        //   printArea: `A6:E${result.length + 6}`, // Set the print area to include the table and text, starting from row 5
        // };
        // ws["!printOptions"] = wsPrintOptions;

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

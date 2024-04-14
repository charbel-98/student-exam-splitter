import Nav from "./components/Nav";
import { DownloadButton, UploadButton } from "./components/UploadButton";
import { CourseInputState, RoomDownloadData } from "./types";
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
      const processedStudents = studentList.students.map((student) => ({
        ID: student.id,
        "First Name": student.firstName,
        "Last Name": student.lastName,
        Place:
          student?.place?.roomName + "      " + student?.place?.placeNumber, // Use placeNumber from the nested place object
        Signature: "",
      }));
      const ws = XLSX.utils.json_to_sheet(processedStudents);
      XLSX.utils.book_append_sheet(wb, ws, studentList.courseName);
    });
    XLSX.writeFile(wb, "Students.xlsx");
  };
  const handleRoomDownload = () => {
    console.log("heloooooooooooooooooooooooooooooooo");
    const wb = XLSX.utils.book_new();
    rooms.forEach((room) => {
      //one sheet per exam
      room.exams.forEach((exam, i) => {
        let result: RoomDownloadData[] | [] = [];
        //find the student list for each exam
        exam.courseNames.forEach((course) => {
          const studentsInThisCourse = excelDataStudent.find(
            (studentList) => studentList.courseName === course
          );
          studentsInThisCourse?.students.forEach((student) => {
            if (student.place?.roomName === room.roomName) {
              result = [
                ...result,
                {
                  ID: student.id,
                  "First Name": student.firstName,
                  "Last Name": student.lastName,
                  Place:
                    student?.place?.roomName +
                    "\t" +
                    student?.place?.placeNumber, // Use placeNumber from the nested place object
                  Course: course,
                },
              ];
            }
          });
        });
        //excel handling
        const ws = XLSX.utils.json_to_sheet(result);
        XLSX.utils.book_append_sheet(wb, ws, `${room.roomName} ${i}`);
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

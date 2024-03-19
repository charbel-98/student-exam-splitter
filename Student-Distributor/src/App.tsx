import { useState } from "react";
import Nav from "./components/Nav";
import { DownloadButton, UploadButton } from "./components/UploadButton";
import {
  CourseInputState,
  Place,
  Room,
  ScheduleCourse,
  Student,
  StudentList,
} from "./types";
import * as XLSX from "xlsx";
import Course from "./components/Course";
import RoomRow from "./components/Room";
import nextId from "react-id-generator";
import RoomModel from "./components/RoomModel";
import { AnimatePresence } from "framer-motion";
type ExcelDataStudentState = StudentList[] | [];
function App() {
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
    []
  );
  const [showRoomModel, setShowRoomModel] = useState<boolean>(false);
  // onchange event
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        if (e.target.name === "Schedule") {
          setTypeError(null);
          const reader = new FileReader();
          reader.readAsArrayBuffer(selectedFile);
          reader.onload = (e) => {
            if (e.target && e.target.result !== null)
              setExcelFileSchedule(e.target.result as string | ArrayBuffer);
          };
        } else if (e.target.name === "Student") {
          setTypeError(null);
          const reader = new FileReader();
          reader.readAsArrayBuffer(selectedFile);
          reader.onload = (e) => {
            if (e.target && e.target.result !== null)
              setExcelFileStudent(e.target.result as string | ArrayBuffer);
          };
        } else {
          setTypeError("Please select only excel file types");
          setExcelFileSchedule(null);
        }
      } else {
        console.log("Please select your file");
      }
    }
  };
  // submit event

  const handleScheduleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (excelFileSchedule !== null) {
      const workbook = XLSX.read(excelFileSchedule, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      //rename data keys to match the ScheduleCourse type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.forEach((item: any, index: number) => {
        item.id = nextId("course-");
        item.courseName = item["Course Name"];
        item.date =
          item["Date"] ||
          (index > 0 ? (data[index - 1] as ScheduleCourse).date : undefined);
        item.code = item["Code"];
        item.duration = item["Duration"];
        item.program = item["Program"];
        item.session =
          item["Session"] ||
          (index > 0 ? (data[index - 1] as ScheduleCourse).session : undefined);
        item.time = new Date(
          item["Start Time"] * 24 * 60 * 60 * 1000
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        });
        delete item["Course Name"];
        delete item["Date"];
        delete item["Code"];
        delete item["Duration"];
        delete item["Program"];
        delete item["Session"];
        delete item["Start Time"];

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
      const workbook = XLSX.read(excelFileStudent, { type: "buffer" });
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        const course = excelDataSchedule?.find(
          (course) => course.courseName === sheetName
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.forEach((item: any) => {
          item.id = item["ID"];
          item.firstName = item["First Name"];
          item.lastName = item["Last Name"];

          delete item["ID"];
          delete item["First Name"];
          delete item["Last Name"];
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
      room.exams?.forEach((exam) => {
        console.error(rooms);
        if (exam.courseNames.length === 1) {
          if (!room.rows || !room.columns) return;
          setExcelDataStudent((prev) => {
            //25 seat if I have 50 student I want to take only first 25

            return prev.map((studentList) => {
              if (studentList.courseName === exam.courseNames[0]) {
                //slice the studentList into 2 arrays one that has places and one that doesn't
                const studentsWithPlaces = studentList.students.filter(
                  (student) => student.place
                );
                const studentsWithoutPlaces = studentList.students.filter(
                  (student) => !student.place
                );
                console.error(studentsWithPlaces);
                console.error(studentsWithoutPlaces);
                let counter = 1;
                let edgeCounter = 0;
                studentsWithoutPlaces.map((student, index) => {
                  if (
                    ((index + 1) * 2) % room.columns! === 0 &&
                    index < (room.rows! * room.columns!) / 2
                  ) {
                    student.place = {
                      placeNumber: counter,
                      roomName: room.roomName,
                      courseName: exam.courseNames[0],
                    } as Place;
                    edgeCounter % 2 === 0 ? (counter += 3) : (counter += 1);
                    edgeCounter++;
                  }
                  if (
                    ((index + 1) * 2) % room.columns! !== 0 &&
                    index < (room.rows! * room.columns!) / 2
                  ) {
                    student.place = {
                      placeNumber: counter,
                      roomName: room.roomName,
                      courseName: exam.courseNames[0],
                    } as Place;
                    counter += 2;
                  }
                });
                return {
                  courseName: studentList.courseName,
                  students: [...studentsWithPlaces, ...studentsWithoutPlaces],
                } as StudentList;
              } else {
                console.log("Course not found");
                return studentList as StudentList;
              }
            }) as StudentList[];
          });
        } else {
          if (exam.courseNames.length === 2) {
            if (!room.rows || !room.columns) return;
            setExcelDataStudent((prev) => {
              return prev.map((studentList) => {
                if (studentList.courseName === exam.courseNames[0]) {
                  const studentsWithPlaces = studentList.students.filter(
                    (student) => student.place
                  );
                  const studentsWithoutPlaces = studentList.students.filter(
                    (student) => !student.place
                  );
                  let counter = 1;
                  let edgeCounter = 0;
                  studentsWithoutPlaces.map((student, index) => {
                    if (
                      ((index + 1) * 2) % room.columns! === 0 &&
                      index < (room.rows! * room.columns!) / 2
                    ) {
                      student.place = {
                        placeNumber: counter,
                        roomName: room.roomName,
                        courseName: exam.courseNames[0],
                      } as Place;
                      edgeCounter % 2 === 0 ? (counter += 3) : (counter += 1);
                      edgeCounter++;
                    }
                    if (
                      ((index + 1) * 2) % room.columns! !== 0 &&
                      index < (room.rows! * room.columns!) / 2
                    ) {
                      student.place = {
                        placeNumber: counter,
                        roomName: room.roomName,
                        courseName: exam.courseNames[0],
                      } as Place;
                      counter += 2;
                    }
                  });
                  return {
                    courseName: studentList.courseName,
                    students: [...studentsWithPlaces, ...studentsWithoutPlaces],
                  } as StudentList;
                } else if (studentList.courseName === exam.courseNames[1]) {
                  const studentsWithPlaces = studentList.students.filter(
                    (student) => student.place
                  );
                  const studentsWithoutPlaces = studentList.students.filter(
                    (student) => !student.place
                  );
                  let counter = 2;
                  let edgeCounter = 0;
                  studentsWithoutPlaces.map((student, index) => {
                    if (
                      ((index + 1) * 2) % room.columns! === 0 &&
                      index < (room.rows! * room.columns!) / 2
                    ) {
                      student.place = {
                        placeNumber: counter,
                        roomName: room.roomName,
                        courseName: exam.courseNames[0],
                      } as Place;
                      edgeCounter % 2 !== 0 ? (counter += 3) : (counter += 1);
                      edgeCounter++;
                    }
                    if (
                      ((index + 1) * 2) % room.columns! !== 0 &&
                      index < (room.rows! * room.columns!) / 2
                    ) {
                      student.place = {
                        placeNumber: counter,
                        roomName: room.roomName,
                        courseName: exam.courseNames[0],
                      } as Place;
                      counter += 2;
                    }
                  });
                  return {
                    courseName: studentList.courseName,
                    students: [...studentsWithPlaces, ...studentsWithoutPlaces],
                  } as StudentList;
                } else {
                  console.log("Course not found");
                  return studentList as StudentList;
                }
              }) as StudentList[];
            });
          }
        }
      });
    });
    setShowRoomModel(true);
  };
  return (
    <>
      <Nav></Nav>
      <div className="flex justify-around mt-12">
        <UploadButton
          handleFile={handleFile}
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
          {excelDataSchedule &&
            excelDataSchedule.map((course, index) => (
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
        </ul>
      </div>
      <div>
        <h2 className="mt-12 font-roboto ms-16 text-3xl">Rooms</h2>
        <ul className="px-10 py-8 flex flex-col items-center gap-4 ">
          {rooms.map((room, index) => (
            <RoomRow
              key={index}
              roomName={room?.roomName}
              courseName={room?.exams?.map((exam) => exam.courseNames).join()}
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
        </ul>

        <button
          onClick={splitStudents}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Place Students
        </button>
      </div>
      <div className=" flex justify-around w-full">
        <DownloadButton text="Download Course Sheets"></DownloadButton>
        <DownloadButton text="Download Room Sheets"></DownloadButton>
      </div>
    </>
  );
}

export default App;

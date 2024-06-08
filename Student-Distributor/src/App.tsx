import { AnimatePresence } from 'framer-motion';
import Course from './components/Course';
import Nav from './components/Nav';
import RoomRow from './components/Room';
import RoomModel from './components/RoomModel';
import { Show } from './components/Show';
import { DownloadButton, UploadButton } from './components/UploadButton';
import { useExcelDownloader } from './hooks/useExcelDownloader.ts';
import { useExcelHandling } from './hooks/useExcelHandling';
import { CourseInputState } from './types';

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
  const { handleCourseDownload, handleRoomDownload } = useExcelDownloader({
    excelDataSchedule,
    excelDataStudent,
    rooms,
  });

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
              e: React.FormEvent<HTMLFormElement>,
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
                  date={course.date + ' ' + course.time}
                  duration={course.duration}
                  session={course.session}
                  students={
                    excelDataStudent?.find(
                      (student) => student.courseName === course.courseName,
                    )?.students.length || 0
                  }
                  openRoomInput={
                    openRoomInput.filter(
                      (item) => item.courseName === course.courseName,
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
                              exam.courseNames.includes(studentList.courseName),
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

import { AnimatePresence, motion } from 'framer-motion';
import { Show } from './Show';
import { ExamsAtSameTime, StudentList } from '../types';

interface RoomModelProps {
  rows: number;
  columns: number;
  exam: ExamsAtSameTime;
  students: StudentList[];
  showRoomModel: boolean;
  roomName: string;
}
function RoomModel({
  rows,
  columns,
  exam,
  students,
  showRoomModel,
  roomName,
}: RoomModelProps) {
  console.log('--------------------------------');
  console.log(exam);
  console.log(students);
  const variants = {
    hidden: {
      opacity: 0,
      y: -80,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: -80,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <AnimatePresence>
      {rows !== undefined && columns !== undefined && showRoomModel && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit={'exit'}
          className="flex"
        >
          <div className="flex flex-col gap-3 border p-4">
            <div className="flex flex-col gap-2 justify-center items-center">
              <p className="font-roboto  font-semibold">
                {exam.courseNames[0]}
              </p>
              <Show>
                <Show.When isTrue={exam.courseNames[1] !== undefined}>
                  <p className="font-roboto  font-semibold">
                    {exam.courseNames[1]}
                  </p>
                </Show.When>
              </Show>
              <p>{exam.date}</p>
            </div>
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex gap-4">
                {Array.from({ length: columns }).map((_, j) => {
                  const student0 =
                    students[0]?.students?.find(
                      (student) =>
                        student.place?.placeNumber === i * columns + j + 1 &&
                        roomName === student.place?.roomName,
                    ) || undefined;
                  const student1 =
                    students[1]?.students.find(
                      (student) =>
                        student.place?.placeNumber === i * columns + j + 1 &&
                        roomName === student.place?.roomName,
                    ) || undefined;

                  return (
                    <div
                      className={`size-8  ${
                        student1 && !student0
                          ? 'bg-amber-600 text-white'
                          : student0 && !student1
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-200 text-black'
                      } rounded-md shadow-md p-2 flex justify-center items-center`}
                      data-toggle="buttons"
                      style={{ marginLeft: 'auto' }}
                    >
                      {i * columns + j + 1}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RoomModel;

import { AnimatePresence, motion } from 'framer-motion';
import React, { SetStateAction, useState } from 'react';
import { createPortal } from 'react-dom';
import RoomInput from './RoomInput';
import { PlusIcon } from '../assets';
import CloseIcon from '../assets/CloseIcon';
import TrashIcon from '../assets/TrashIcon';
import { CourseInputState, Room, ScheduleCourse } from '../types';

interface CourseProps {
  courseName: string;
  date: string;
  duration: string;
  session: string;
  students?: number;
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  openRoomInput: CourseInputState;
  setOpenRoomInput: React.Dispatch<React.SetStateAction<CourseInputState[]>>;
  rooms: Room[] | [];
  time: string;
  setCourse: React.Dispatch<SetStateAction<ScheduleCourse[] | null>>;
}
function Course({
  courseName,
  date,
  duration,
  session,
  students,
  openRoomInput,
  time,
  setOpenRoomInput,
  rooms,
  setRooms,
}: CourseProps) {
  return (
    <li className="flex  border shadow-sm p-4  relative rounded-lg w-11/12">
      <p className="text-lg font-semibold flex-0.75">{courseName}</p>
      <div
        className="flex gap-4 flex-2
        items-center justify-center text-gray-500"
      >
        <p className="flex-4">Date: {date}</p>
        <p className="flex-1">Duration: {duration}</p>
        <p className="flex-1">Session: {session}</p>
        <p className="flex-1">Students: {students}</p>
        <div className="flex flex-2 max-w-52 flex-wrap font-roboto text-md text-black  gap-2">
          {rooms.map(
            (room, index) =>
              //check if the room has the courseName in it's array if yes render the div
              room?.exams?.some((exam) =>
                exam.courseNames.some((course) => course === courseName),
              ) && (
                <RoomCard
                  key={index}
                  roomName={room.roomName}
                  setRooms={setRooms}
                  courseName={courseName}
                />
              ),
          )}
        </div>
      </div>
      <div className="flex gap-4 flex-0.25 justify-end">
        <PlusIcon
          openHandler={() => {
            //make all other inputs false and this one true
            setOpenRoomInput((prev) => {
              return prev.map((item) => {
                if (item.courseName === courseName) {
                  return { ...item, openForm: true };
                }

                return { ...item, openForm: false };
              });
            });
          }}
        />
        <TrashIcon />
      </div>

      {openRoomInput.openForm && (
        <>
          {createPortal(
            <div
              className="bg-gray-500/25 h-full w-full fixed z-10 top-0 left-0 "
              onClick={() => {
                //make all inputs false
                setOpenRoomInput((prev) => {
                  return prev.map((item) => {
                    return { ...item, openForm: false };
                  });
                });
              }}
            />,
            document.getElementById('portal') as HTMLElement,
          )}
          <RoomInput
            setRooms={setRooms}
            courseName={courseName}
            date={date}
            time={time}
          />
        </>
      )}
    </li>
  );
}

function RoomCard({
  roomName,
  setRooms,
  courseName,
}: {
  roomName: string;
  courseName: string;
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}) {
  const [showIcon, setShowIcon] = useState(false);
  const pvariants = {
    initial: { x: 0 },
    animate: {
      x: 7,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className={`rounded-md border-2 border-primary flex items-center gap-2  bg-gray-200 p-2 text-center w-20 h-10`}
      onMouseEnter={() => {
        setShowIcon(true);
      }}
      onMouseLeave={() => {
        setShowIcon(false);
      }}
    >
      <AnimatePresence>
        {showIcon && (
          <CloseIcon
            classes="cursor-pointer"
            onClick={() => {
              setRooms((prev) => {
                // remove the course from rhe room or remove the room if it has only one exam
                console.log('charbel', courseName);

                return prev.map((room) => {
                  if (
                    room.roomName === roomName &&
                    room.exams?.length === 1 &&
                    room.exams[0].courseNames.length === 1
                  ) {
                    return { ...room, exams: [] };
                  } else if (room.roomName === roomName) {
                    return {
                      ...room,
                      exams: room.exams?.map((exam) => {
                        console.log('charbel', exam.courseNames, courseName);

                        return {
                          ...exam,
                          courseNames: exam.courseNames.filter(
                            (c) => c !== courseName,
                          ),
                        };
                      }),
                    };
                  } else {
                    return room;
                  }
                });
              });
            }}
          />
        )}
      </AnimatePresence>

      <motion.p
        className="flex flex-1 justify-center"
        variants={pvariants}
        initial="initial"
        animate={showIcon ? 'animate' : 'exit'}
      >
        {roomName}
      </motion.p>
    </motion.div>
  );
}

export default Course;

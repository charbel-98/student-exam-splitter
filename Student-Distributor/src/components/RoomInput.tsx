import React, { useEffect, useRef, useState } from "react";
import { Room } from "../types";
import nextId from "react-id-generator";

interface RoomInputProps {
  setRooms: React.Dispatch<React.SetStateAction<Room[] | []>>;
  courseName: string;
  date: string;
}

const RoomInput: React.FC<RoomInputProps> = ({
  setRooms: setValues,
  courseName,
  date,
}: RoomInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Focus the input element on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setInputValue(event.target.value);
  };
  console.log(courseName);
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      console.log(event.key);
      const regex = /D\d\.\d+/;

      if (inputValue.trim() !== "" && regex.test(inputValue)) {
        setValues((prev) => {
          const roomExists = prev.some((room) => room.roomName === inputValue);
          console.log(roomExists);
          if (roomExists) {
            // If a room with the same roomName exists, update it
            const courseExistInRoom = prev.some((room) =>
              room.courses?.some((course) => course.courseName === courseName)
            );
            if (courseExistInRoom) {
              setError("Course already exists in this room");
              return prev;
            }

            return prev.map((room) => {
              if (room.roomName === inputValue) {
                return {
                  ...room,
                  courses: [
                    ...(room.courses || []),
                    { courseName: courseName, date: date },
                  ],
                } as Room;
              } else {
                return room as Room;
              }
            }) as Room[];
          } else {
            console.log(courseName);
            // If no room with the same roomName exists, add a new room
            return [
              ...prev,
              {
                id: nextId("room-"),
                roomName: inputValue,
                courses: [{ courseName: courseName, date: date }],
              } as Room,
            ] as Room[];
          }
        });
        setInputValue("");
      } else {
        setError("Please enter a valid room name");
      }
    }
  };
  return (
    <div
      className={`absolute right-[0] top-12 bg-white z-50 max-w-80 flex flex-col border rounded-md shadow-md w-2/12 p-4 gap-5 ${
        error && "border-l-2 border-l-red-500"
      }`}
    >
      <label>Room</label>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className={`border shadow-sm ps-3 rounded-lg focus:outline-none ${
          error && "border-l-4 border-l-red-500"
        }`}
        placeholder="eg. D1.1"
      />
      {error && <p className="text-red-500 font-roboto text-xs">{error}</p>}
    </div>
  );
};

export default RoomInput;

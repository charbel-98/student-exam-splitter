import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { EditIcon } from "../assets";
import { Show } from "./Show";
import { Room } from "../types";

interface RoomProps {
  roomName: string;
  courseName: string;
  studentsLength?: number;
  rows: number;
  columns: number;
  editRoom: Dispatch<SetStateAction<Room[]>>;
}
function RoomRow({ roomName, courseName, rows, columns, editRoom }: RoomProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newRows, setNewRows] = useState<number | null>(rows);
  const [newColumns, setNewColumns] = useState<number | null>(columns);
  const rowRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (editMode && rowRef.current) rowRef.current.focus();
  }, [editMode]);
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "row") {
      setNewRows(Number(e.target.value));
    }
    if (e.target.name === "column") {
      setNewColumns(Number(e.target.value));
    }
  };

  //on input lose focus update the rooms
  const inputBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.name === "row") {
      //add or edit the field row of the room we are editing
      editRoom((prev) => {
        return prev.map((room) =>
          room.roomName === roomName ? { ...room, rows: Number(newRows) } : room
        ) as Room[];
      });
      rowRef.current = null;
    }
    if (e.target.name === "column") {
      //add or edit the field column of the room we are editing
      editRoom((prev) => {
        return prev.map((room) =>
          room.roomName === roomName
            ? { ...room, columns: Number(newColumns) }
            : room
        ) as Room[];
      });
      setEditMode(false);
    }
    //checl if both inputs are blured setEditmode to false
  };
  return (
    <li className="flex  border shadow-sm p-4  rounded-lg w-11/12">
      <p className="text-lg font-semibold flex-1">{roomName}</p>
      <div className="flex gap-4 flex-3 justify-center items-center text-gray-500">
        <p className="flex-4">Courses: {courseName || "none"}</p>

        <p className="flex-2 flex gap-1">
          Rows:
          <Show>
            <Show.When isTrue={editMode}>
              <input
                ref={rowRef}
                type="number"
                className="max-w-[80px]  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none border-b-2 ps-2"
                value={newRows || ""}
                onChange={inputChangeHandler}
                onBlur={inputBlurHandler}
                name="row"
              />
            </Show.When>
            <Show.Else>{rows}</Show.Else>
          </Show>{" "}
        </p>
        <p className="flex-2 flex gap-1">
          Columns:
          <Show>
            <Show.When isTrue={editMode}>
              <input
                type="number"
                //remove the arrows the input type number in className

                className="max-w-[80px]  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none border-b-2 ps-2"
                value={newColumns || ""}
                onChange={inputChangeHandler}
                name="column"
                onBlur={inputBlurHandler}
              />
            </Show.When>
            <Show.Else>{columns}</Show.Else>
          </Show>
        </p>
      </div>
      <div className="flex gap-4 flex-1 justify-end">
        <EditIcon toggleEditMode={() => setEditMode(!editMode)} />
      </div>
    </li>
  );
}
export default RoomRow;

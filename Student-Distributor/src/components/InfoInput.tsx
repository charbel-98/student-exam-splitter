import React from 'react';

function InfoInput({
  label,
  changeHandler,
}: {
  label: string;
  changeHandler: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex p-4 mt-12">
      <label
        className="font-roboto flex align-center gap-3 text-lg"
        htmlFor="schedule"
      >
        {label}
      </label>
      <input
        type="text"
        id="schedule"
        className="border border-gray-300 rounded-lg p-2 ml-4"
        onChange={(e) => {
          changeHandler(e.target.value);
        }}
      />
    </div>
  );
}

export default InfoInput;

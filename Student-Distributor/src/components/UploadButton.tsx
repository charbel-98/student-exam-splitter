import { ExcelIcon } from '../assets';

interface UploadButtonProps {
  text: string;
  handleFile?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submit?: (e: React.FormEvent<HTMLFormElement>) => void;
  excelFileSchedule?: string | ArrayBuffer | null;
  excelFileStudent?: string | ArrayBuffer | null;
}
export function UploadButton({
  text,
  submit,
  handleFile,
  excelFileSchedule,
  excelFileStudent,
}: UploadButtonProps) {
  return (
    <form onSubmit={submit}>
      {/*<label*/}
      {/*  className="block mb-2 text-sm font-medium text-gray-900"*/}
      {/*  htmlFor="file_input"*/}
      {/*>*/}
      {/*  Upload File*/}
      {/*</label>*/}

      <input
        type="file"
        name={text.split(' ')[1]}
        accept=".xlsx, .xls"
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none bg-gray"
        onChange={handleFile}
      />
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        .XLSX, .XLS.
      </p>
      <button
        type="submit"
        disabled={
          (text === 'Upload Schedule' && !excelFileSchedule) ||
          (text === 'Upload Student List' &&
            !excelFileStudent &&
            !excelFileSchedule)
        }
        className="border shadow-lg px-2 py-4 rounded-lg flex justify-around items-center disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-400 disabled:shadow-none"
      >
        <ExcelIcon />
        <p className="font-roboto text-md ms-4">{text}</p>
      </button>
    </form>
  );
}

interface downloadButtonProps {
  text: string;
  onClick: () => void;
}

export function DownloadButton({ text, onClick }: downloadButtonProps) {
  return (
    <button
      type="submit"
      onClick={onClick}
      //disabled={text.startsWith("Download")}
      className="border shadow-lg px-2 py-4 rounded-lg flex justify-around items-center disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-400 disabled:shadow-none"
    >
      <ExcelIcon />
      <p className="font-roboto text-md ms-4">{text}</p>
    </button>
  );
}

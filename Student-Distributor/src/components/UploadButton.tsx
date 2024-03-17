import { ExcelIcon } from "../assets";
interface UploadButtonProps {
  text: string;
  handleFile?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submit?: (e: React.FormEvent<HTMLFormElement>) => void;
}
export function UploadButton({ text, submit, handleFile }: UploadButtonProps) {
  return (
    <form onSubmit={submit}>
      <input
        type="file"
        name={text.split(" ")[1]}
        accept=".xlsx, .xls"
        className=""
        onChange={handleFile}
      />
      <button
        type="submit"
        disabled={text.startsWith("Download")}
        className="border shadow-lg px-2 py-4 rounded-lg flex justify-around items-center disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-400 disabled:shadow-none"
      >
        <ExcelIcon />
        <p className="font-roboto text-md ms-4">{text}</p>
      </button>
    </form>
  );
}
export function DownloadButton({ text }: UploadButtonProps) {
  return (
    <button
      type="submit"
      disabled={text.startsWith("Download")}
      className="border shadow-lg px-2 py-4 rounded-lg flex justify-around items-center disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-400 disabled:shadow-none"
    >
      <ExcelIcon />
      <p className="font-roboto text-md ms-4">{text}</p>
    </button>
  );
}

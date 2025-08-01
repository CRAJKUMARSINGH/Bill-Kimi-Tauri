import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { FiUpload } from "react-icons/fi";

interface UploadZoneProps {
  onFile: (file: File) => void;
}

export default function UploadZone({ onFile }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFile(acceptedFiles[0]);
      }
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <FiUpload className="w-12 h-12 text-gray-400" />
        <div>
          <p className="text-lg font-medium text-gray-700">
            {isDragActive ? "Drop the Excel file here" : "Drag & drop Excel file here"}
          </p>
          <p className="text-sm text-gray-500">or click to browse files</p>
          <p className="text-xs text-gray-400 mt-2">Supports .xlsx, .xls</p>
        </div>
      </div>
    </div>
  );
}

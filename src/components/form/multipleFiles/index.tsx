/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FileInput, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const theme = {
  field: {
    base: "relative w-full",
    input: {
      base: "block w-full overflow-hidden rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 ps-4 ",
      sizes: {
        sm: "sm:text-xs",
        md: "text-sm",
        lg: "sm:text-base",
      },
    },
  },
};

export function MultipleFiles({
  setValue,
  label,
  name,
  error,
}: {
  setValue: any;
  label: string;
  name: string;
  setError?: any;
  error?: any;
}) {
  const { t } = useTranslation("validation");
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];

    for (let i = 0; i < files?.length || 0; i++) {
      setFiles((prev) => [...prev, files![i]]);
    }
  };

  const removeHandle = (itemIndx: number) => {
    setFiles((prev) => prev.filter((_, ind) => ind !== itemIndx));
  };

  useEffect(() => {
    setValue(name, files, true);
  }, [files, name, setValue]);
  return (
    <div>
      <div className="text-start">
        <Label htmlFor="multiple-file-upload" value={label} />
      </div>
      <FileInput
        id="multiple-file-upload"
        multiple
        onChange={handleChange}
        name={name}
        theme={theme}
        helperText={<span className="text-red-500">{t(error)}</span>}
      />

      <div className="flex gap-2">
        {files.map((file, index) => (
          <div
            className="flex  items-center gap-2 rounded-full border border-gray-500 px-2 py-1"
            key={index}
          >
            <span>{file.name}</span>
            <button
              title="delete file"
              className="text-red-500"
              onClick={() => removeHandle(index)}
            >
              <XMarkIcon className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

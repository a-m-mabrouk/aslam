/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileInput, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";

export function UploadFile({
  setValue,
  label,
  name,
  error,
  setTouch,
}: {
  setValue: any;
  setTouch: any;
  label: string;
  name: string;
  setError?: any;
  error?: any;
}) {
  const { t } = useTranslation("validation");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setValue(name, file, true);
  };

  return (
    <div>
      <div className="text-start">
        <Label htmlFor="multiple-file-upload" value={label} />
      </div>
      <FileInput
        id="multiple-file-upload"
        onChange={handleChange}
        name={name}
        helperText={<span className="text-red-500">{t(error)}</span>}
        onBlur={setTouch}
      />
    </div>
  );
}

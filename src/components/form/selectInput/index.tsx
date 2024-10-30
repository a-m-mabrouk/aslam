/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, Select } from "flowbite-react";
import { useTranslation } from "react-i18next";

export default function SelectInput({
  error,
  list,
  label,
  name,
  setValue,
  handleBlur,
  value,
}: {
  setValue: any;
  label: string;
  value: string;
  name: string;
  list: {
    id: number;
    title: string;
  }[];
  error: string;
  handleBlur: any;
}) {
  const { t } = useTranslation("validation");
  return (
    <div className="grid gap-2">
      <div className="text-start">
        <Label value={label} />
      </div>
      <Select
        name={name}
        onChange={setValue}
        onBlur={handleBlur}
        helperText={
          <span className="inline-block w-full text-start text-red-500">
            {t(error)}
          </span>
        }
        value={value}
      >
        <option value="" disabled selected>
          {label}
        </option>
        {list.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title}
          </option>
        ))}
      </Select>
    </div>
  );
}

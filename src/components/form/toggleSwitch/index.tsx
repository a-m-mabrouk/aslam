/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToggleSwitch } from "flowbite-react";
import { useCallback } from "react";

export function ToggleSwitchInput({
  label,
  onChange,
  value = false,
  name,
}: {
  label: string;
  onChange: any;
  value: boolean;
  name: string;
}) {
  const handleChange = useCallback(
    (value: boolean) => {
      onChange(name, value, true);
    },
    [name, onChange],
  );
  return (
    <div className="flex max-w-md flex-col items-start gap-4">
      <ToggleSwitch checked={value} label={label} onChange={handleChange} />
    </div>
  );
}

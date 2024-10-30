/* eslint-disable @typescript-eslint/ban-ts-comment */
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Label, TextInput, TextInputProps } from "flowbite-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
const themeInput = {
  base: "flex",
  addon:
    "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400",
  field: {
    base: "relative w-full",
    icon: {
      base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
      svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
    },
    rightIcon: {
      base: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
      svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
    },
    input: {
      base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
      sizes: {
        sm: "p-2 sm:text-xs",
        md: "p-2.5 text-sm",
        lg: "p-4 sm:text-base",
      },
      colors: {
        gray: "border-gray-300 bg-transparent text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
        info: "border-cyan-500 bg-cyan-50 text-cyan-900 placeholder-cyan-700 focus:border-cyan-500 focus:ring-cyan-500 dark:border-cyan-400 dark:bg-cyan-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
        failure:
          "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500",
        warning:
          "border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500",
        success:
          "border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500",
      },
      withRightIcon: {
        on: "pr-10",
        off: "",
      },
      withIcon: {
        on: "pl-10",
        off: "",
      },
      withAddon: {
        on: "rounded-r-lg",
        off: "rounded-lg",
      },
      withShadow: {
        on: "shadow-sm dark:shadow-sm-light",
        off: "",
      },
    },
  },
};
export function InputText({
  label,
  className,
  ...props
}: TextInputProps &
  React.RefAttributes<HTMLInputElement> & { label?: string }) {
  const { t, i18n } = useTranslation("validation");
  const [show, setShow] = useState(false);

  const icon =
    props.type === "password" ? (
      !show ? (
        <EyeIcon
          onClick={() => setShow(!show)}
          className="size-6 cursor-pointer"
        />
      ) : (
        <EyeSlashIcon
          onClick={() => setShow(!show)}
          className="size-6 cursor-pointer"
        />
      )
    ) : undefined;

  return (
    <div className="max-w-full">
      <div className="relative mb-2 block capitalize">
        <div className="text-start">
          <Label htmlFor={props.id} value={label} />
        </div>
        <div className="relative">
          <TextInput
            {...props}
            theme={themeInput}
            helperText={t((props.helperText || "") as string)}
            color={props.helperText ? "failure" : "gray"}
            className={` ${className}`}
            type={
              props.type === "password"
                ? show
                  ? "text"
                  : "password"
                : props.type
            }
          />
          <span
            className={`absolute ${i18n.language === "ar" ? "left-[10px]" : "right-[10px]"} top-[10px] flex items-center`}
          >
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}

import { PlusIcon } from "@heroicons/react/24/solid";
import { Button, ButtonProps } from "flowbite-react";

const customTheme = {
  base: "group flex items-stretch items-center justify-center p-0 text-center font-medium relative focus:z-10 focus:outline-none transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] disabled:opacity-70 w-fit disabled:pointer-events-none rounded-lg border font-bold min-w-[150px]",

  color: {
    primary:
      "bg-primary enabled:hover:bg-primary/10 enabled:hover:text-primary border-primary  text-white",
    white:
      "bg-white enabled:hover:bg-transparent enabled:hover:text-white border-white  text-primary",
    primaryOutLine:
      "bg-transparent enabled:hover:bg-primary enabled:hover:text-white border-primary  text-primary",
    primaryCancel:
      "bg-white  border-primary  text-primary opacity-50 hover:opacity-100",
    success:
      "bg-success-color enabled:hover:bg-success-color/10 enabled:hover:text-success-color border-success-color text-white",
    successOutLine:
      "enabled:hover:bg-success-color bg-success-color/10 text-success-color border-success-color  enabled:hover:text-white",
    failure:
      "bg-error-color enabled:hover:bg-error-color/10 enabled:hover:text-error-color border-error-color  text-white",
    failureOutLine:
      "enabled:hover:bg-error-color bg-error-color/10 text-error-color border-error-color  enabled:hover:text-white",
    transparent: "text-primary border-0",
  },
  disabled: "cursor-wait opacity-50 pointer-events-none",
  spinnerSlot: "absolute top-0 flex h-full items-center main-spinner",
  pill: {
    off: "rounded-lg",
    on: "rounded-full",
  },
  size: {
    md: "text-base px-4 py-2",
    lg: "text-2xl px-5 py-2.5",
  },
};

export default function PrimaryBtn({
  children,
  color = "primary",
  pluse,
  ...props
}: ButtonProps & {
  color?: colorTypes;
  pluse?: boolean;
}) {
  return (
    <Button
      theme={customTheme}
      {...props}
      color={color}
      disabled={props.isProcessing}
    >
      <span className="flex items-center gap-2 capitalize ">
        {pluse && <PlusIcon className="size-5" />}
        {children}
      </span>
    </Button>
  );
}

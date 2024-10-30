import { PencilSquareIcon } from "@heroicons/react/24/solid";
import PrimaryBtn from "../primaryBtn";
import { ButtonProps } from "flowbite-react";

export default function EditBtn({
  ...props
}: ButtonProps & {
  color?: colorTypes;
  pluse?: boolean;
}) {
  return (
    <PrimaryBtn
      type="button"
      {...props}
      color="primaryOutLine"
      className="w-fit min-w-fit"
    >
      <PencilSquareIcon className="size-6" />
    </PrimaryBtn>
  );
}

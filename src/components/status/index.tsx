import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Status({ state }: { state: boolean }) {
  return state ? (
    <span className="grid size-6 place-content-center rounded-full bg-[#5C980F]  text-white">
      <CheckIcon className="size-5 rotate-12" />
    </span>
  ) : (
    <span className="grid size-6 place-content-center rounded-full bg-error-color  text-white">
      <XMarkIcon className="size-5 " />
    </span>
  );
}

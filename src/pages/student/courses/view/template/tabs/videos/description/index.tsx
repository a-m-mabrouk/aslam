import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import PopupModal from "../../../../../../../../components/popupModal";
import { useTranslation } from "react-i18next";

export default function DescriptionLesson({
  desc,
  title,
}: {
  title: string;
  desc: string;
}) {
  const { t } = useTranslation("viewCourse");
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);
  return (
    <>
      <PopupModal
        isOpen={open}
        closeModal={toggle}
        title={`${t("description")}: ${title}`}
      >
        <p>{desc}</p>
      </PopupModal>

      <span
        className="hover:cursor-pointer hover:text-primary"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        <QuestionMarkCircleIcon className="size-6" />
      </span>
    </>
  );
}

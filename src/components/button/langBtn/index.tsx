import { GlobeAltIcon } from "@heroicons/react/24/solid";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function LangBtn({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { i18n } = useTranslation();

  const handleLangChange = useCallback(() => {
    i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar");
    localStorage.setItem("lang", i18n.language === "ar" ? "en" : "ar");
  }, [i18n]);
  return (
    <div
      className={`ms-auto flex cursor-pointer items-center gap-2 capitalize ${className}`}
      onClick={handleLangChange}
    >
      <GlobeAltIcon className="size-6 cursor-pointer" />
      <p>{i18n.language}</p>
    </div>
  );
}

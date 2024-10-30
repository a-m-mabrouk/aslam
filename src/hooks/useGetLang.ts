import { useTranslation } from "react-i18next";

export default function useGetLang() {
  const { i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";
  return {
    lang,
    t: i18n.t,
    dir: lang === "ar" ? "rtl" : "ltr",
  };
}

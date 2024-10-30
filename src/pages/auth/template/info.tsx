import { motion } from "framer-motion";
import PrimaryBtn from "../../../components/button/primaryBtn";
import { useTranslation } from "react-i18next";
import Logo from "../../../components/logo";

export default function Info({
  setView,
  view,
}: {
  setView: React.Dispatch<React.SetStateAction<boolean>>;
  view: boolean;
}) {
  const { t, i18n } = useTranslation("auth");
  const checkLang = i18n.language === "en";
  return (
    <motion.div
      // eslint-disable-next-line tailwindcss/classnames-order
      className={`absolute inset-y-0  left-0 hidden  w-1/2 place-content-center place-items-center gap-4 bg-primary p-4 md:grid `}
      animate={{
        x: view ? (checkLang ? "100%" : "0%") : checkLang ? 0 : "100%",
      }}
    >
      <h1 className="text-2xl text-white">
        <Logo logoType="light" className="max-w-[200px]" />
      </h1>
      <p className="max-w-[450px] px-4 text-center text-white">
        {/* Welcome to our platform we will help you to increase your knowledge and
        take you to the next level */}
        {t("desc")}
      </p>
      <PrimaryBtn onClick={() => setView(!view)} color="white">
        {view ? t("register") : t("login")}
      </PrimaryBtn>
    </motion.div>
  );
}

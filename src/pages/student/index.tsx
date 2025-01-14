/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
import cover from "../../assets/images/cover.jpg";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { staggerContainer, textVariant } from "../../utilities/motion";
import useGetLang from "../../hooks/useGetLang";

export default function Student() {
  const { t } = useTranslation("common");
  const { lang } = useGetLang();
  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="relative max-h-[calc(100vh-60px)] min-h-[calc(100vh-60px)] overflow-hidden"
    >
      <img src={cover} alt="cover" className="size-full object-cover opacity-50" />
      <div className="absolute inset-0 size-full bg-black/50" />
      <div className="absolute inset-0 grid place-content-center place-items-center gap-4 drop-shadow-[0_0_1px_rgba(0,0,0,0.75)]">
        <motion.h1
          variants={textVariant(0.5)}
          className="break-words text-center text-5xl font-bold text-white leading-snug"
        >
          <div className={lang === "en"? "flex flex-row-reverse justify-center": ""}>
            <span className="text-primary font-mono">”</span>
            {t("name")}
            <span className="text-primary font-mono">“</span>
          </div>
          {t("welcome")}
        </motion.h1>
        <motion.p
          variants={textVariant(1)}
          className="mb-5 max-w-[600px]  text-balance text-center text-2xl font-medium text-white"
        >
          {t("desc")}
        </motion.p>
        <motion.a
          href="https://wa.me/+201024642124"
          target="_blank"
          variants={textVariant(1.5)}
          className="btn_social flex w-max items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-2 text-xl text-white"
        >
          <i className="fi fi-brands-whatsapp grid" />
          {t("contactUs")}
        </motion.a>
      </div>
    </motion.div>
  );
}

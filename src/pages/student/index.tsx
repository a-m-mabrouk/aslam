/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
import cover from "../../assets/images/cover.jpg";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { staggerContainer, textVariant } from "../../utilities/motion";

export default function Student() {
  const { t } = useTranslation("common");
  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="relative max-h-[calc(100vh-60px)] min-h-[calc(100vh-60px)] overflow-hidden"
    >
      <img src={cover} alt="cover" className="size-full object-cover" />
      <div className="absolute inset-0 size-full bg-black/50" />
      <div className="absolute inset-0 grid place-content-center place-items-center gap-4">
        <motion.h1
          variants={textVariant(0.5)}
          className="break-words text-center text-4xl font-bold text-white"
        >
          <span className="block first-letter:text-5xl first-letter:text-primary">
            {t("name")}
          </span>
          {t("welcome")}
        </motion.h1>
        <motion.p
          variants={textVariant(1)}
          className="max-w-[600px]  text-balance text-center font-medium text-white"
        >
          {t("desc")}
        </motion.p>
        <motion.a
          href="https://wa.me/01024642124"
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

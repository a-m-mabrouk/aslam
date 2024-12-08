import { useTranslation } from "react-i18next";
import TitleSection from "../../../components/title";
import BgCard from "../../../components/cards/bg";


export default function Whatsapp() {
  
  const { t } = useTranslation("whatsapp");

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap justify-between gap-4">
        <TitleSection title={t("whatsapp")} />
      </div>

      <BgCard>
        <form className="relative min-h-[400px]">
          <input type="number" name="" id="" />
        </form>
      </BgCard>
    </div>
  );
}

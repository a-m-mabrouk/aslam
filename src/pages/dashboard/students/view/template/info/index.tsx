import { Avatar } from "flowbite-react";
import BgCard from "../../../../../../components/cards/bg";
import { useContext } from "react";
import InfoItem from "../../../../../../components/infoItem";
import { useTranslation } from "react-i18next";
import { ViewStudentContext } from "../..";

export default function StudentInfo() {
  const { t } = useTranslation("students");
  const { student } = useContext(ViewStudentContext);
  const { email, first_name, last_name, phone_number, photo } = student || {};
  const name = `${first_name || ""} ${last_name || ""}`;

  return (
    <BgCard>
      <div className="flex items-start justify-between gap-4">
        <Avatar
          bordered
          alt={first_name || ""}
          img={photo || ""}
          size="xl"
          className="flex-col md:flex-row"
        >
          <div className=" ms-4 grid gap-4">
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {name}
            </h5>
            <div className="flex flex-wrap gap-4">
              <InfoItem title={t("email")} value={`${email}`} />
              <InfoItem title={t("phone_number")} value={phone_number} />
            </div>
          </div>
        </Avatar>
      </div>
    </BgCard>
  );
}

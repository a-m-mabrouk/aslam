import { useTranslation } from "react-i18next";

export default function SectionHeader({
  rightEle,
  title,
}: {
  title: string;
  rightEle?: React.ReactNode;
}) {
  const { t } = useTranslation("common");

  return (
    <div className="flex justify-between">
      <h2 className="border-b-2 border-primary text-2xl font-bold">
        {t(title)}
      </h2>
      {rightEle}
    </div>
  );
}

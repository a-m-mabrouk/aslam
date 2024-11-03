import * as XLSX from "xlsx";
import { useState } from "react";
import { Button } from "flowbite-react";
import { useTranslation } from "react-i18next";
import InputFile from "../../../../../../../../components/form/fileInput";

export default function UploadQuestions({
  onAddQuestions,
}: {
  onAddQuestions: (questions: ExcelQuestion[]) => void;
}) {
  const { t } = useTranslation("viewCourse");
  const [file, setFile] = useState<File | undefined>(undefined);
  const handleFileChange = (_: string, value: File | undefined) => {
    setFile(value);
  };
  const handlefileUpload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawQuestions = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
      }) as ExcelQuestion[];

      const questions: ExcelQuestion[] = rawQuestions.map(
        (q: ExcelQuestion) => {
          const queType = q.type?.toLowerCase();
          if (!["mcq", "dragdrop"].includes(queType)) {
            throw new Error("Invalid question type");
          }
          return q;
        },
      );
      onAddQuestions(questions);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="grid gap-4">
      <div className="flex justify-between gap-4">
        {/* <TitleSection title={t("exams")} /> */}
        <InputFile
          label={t("add Excel")}
          name="excel"
          accept=".xls,.xlsx"
          fileType="excel"
          btnText="Add excel sheet"
          acceptDesc="XLSX File"
          onChange={handleFileChange}
          value={undefined}
          error={""}
        />
      </div>
      <Button onClick={handlefileUpload} disabled={!file}>
        {t("Upload Questions")}
      </Button>
    </div>
  );
}

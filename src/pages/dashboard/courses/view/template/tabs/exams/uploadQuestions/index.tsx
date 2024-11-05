import * as XLSX from "xlsx";
import { useState } from "react";
import { Button } from "flowbite-react";
import { useTranslation } from "react-i18next";
import InputFile from "../../../../../../../../components/form/fileInput";

interface ExcelQuestion {
  type: "mcq" | "dragdrop";
  chapter?: string;
  domain?: string;
  questionText: string;
  description: string;
  degree: number;
  a: string;
  b: string;
  c?: string;
  d?: string;
  e?: string;
  f?: string;
  answer: string;
  drag1: string;
  drag2: string;
  drag3?: string;
  drag4?: string;
  drag5?: string;
  drag6?: string;
  drop1: string;
  drop2: string;
  drop3?: string;
  drop4?: string;
  drop5?: string;
  drop6?: string;
}
export default function UploadQuestions({
  onAddQuestions,
}: {
  onAddQuestions: (questions: Question[]) => void;
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

      const questions: Question[] = rawQuestions.map((q: ExcelQuestion) => {
        const queType = q.type?.toLowerCase();
        const customQuestion: Question = {
          type: q.type,
          chapter: q.chapter,
          domain: q.domain,
          name: q.questionText,
          description: q.description,
          degree: q.degree,
          options: [],
        };
        if (queType === "mcq") {
          type charIndex = "a" | "b" | "c" | "d" | "e" | "f";
          ["a", "b", "c", "d", "e", "f"].forEach((opt) => {
            const optText = q[opt as charIndex]?.toString().trim();

            optText &&
              customQuestion.options.push({
                option: optText!,
                answer: q.answer === opt ? "true" : "false",
              });
          });
        } else if (queType === "dragdrop") {
          type dragIndex =
            | "drag1"
            | "drag2"
            | "drag3"
            | "drag4"
            | "drag5"
            | "drag6";
          type dropIndex =
            | "drop1"
            | "drop2"
            | "drop3"
            | "drop4"
            | "drop5"
            | "drop6";
          ["drag1", "drag2", "drag3", "drag4", "drag5", "drag6"].forEach(
            (opt) => {
              const optText = q[opt as dragIndex]?.toString().trim();
              optText &&
                customQuestion.options.push({
                  option: optText!,
                  answer: q[opt.replace("drag", "drop") as dropIndex]!,
                });
            },
          );
        } else {
          throw new Error("Invalid question type");
        }

        return customQuestion;
      });
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

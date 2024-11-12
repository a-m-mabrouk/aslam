import * as XLSX from "xlsx";
import { useState, useMemo } from "react";
import { Button } from "flowbite-react";
import { useTranslation } from "react-i18next";
import InputFile from "../../../../../../../../components/form/fileInput";
// import axiosDefault from "../../../../../../../../utilities/axios";
// import { API_EXAMS } from "../../../../../../../../router/routes/apiRoutes";
import { useParams } from "react-router";
import { useAppSelector } from "../../../../../../../../store";

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
  const {id} = useParams()
  const { t } = useTranslation("viewCourse");
  const [file, setFile] = useState<File | undefined>(undefined);
  const assessment_id = useAppSelector(({exams}) => exams.assessmentId)

  const handleFileChange = (_: string, value: File | undefined) => {
    setFile(value);
  };

  const processedQuestions = useMemo(() => {
    if (!file) return null;

    const reader = new FileReader();

    return new Promise<Question[]>((resolve, reject) => {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];

          const rawQuestions = XLSX.utils.sheet_to_json(sheet, {
            defval: "",
          }) as ExcelQuestion[];

          const questions: Question[] = rawQuestions.map((q) => {
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
                    option: optText,
                    answer: q.answer.replace(" ", "").split("-").includes(opt)
                      ? "true"
                      : "false",
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
                      option: optText,
                      answer: q[opt.replace("drag", "drop") as dropIndex]!,
                    });
                }
              );
            } else {
              throw new Error("Invalid question type");
            }

            return customQuestion;
          });

          resolve(questions);
        } catch (error) {
          reject(error);
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }, [file]);

  const handlefileUpload = async () => {
    if (!processedQuestions || !id || !assessment_id) return;

    try {
      const questions = await processedQuestions;
      // console.log({questions,
      //   assessment_id,
      //   course_id: +id
      // });
      
      // const { data } = await axiosDefault.post(API_EXAMS.questions,
      //   {questions,
      //     assessment_id,
      //     course_id: +id
      //   }
      // );
      // console.log(data);
      
      onAddQuestions(questions);

    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex justify-between gap-4">
        <InputFile
          label={""}
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

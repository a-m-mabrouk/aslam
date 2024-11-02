import { useEffect, useState } from "react";
import ExamsSideAccordion from "./examsSideAccordion";
import UploadQuestions from "./uploadQuestions";
import { useAppDispatch } from "../../../../../../../store";
import { hideSideNav } from "../../../../../../../store/reducers/layout";
import ExamCarousel from "./examCarousel";

export default function Exams() {
  const dispatch = useAppDispatch();

  const [questions, setQuestions] = useState<ExcelQuestion[]>([]);

  const handleSetQuestions = (ques: ExcelQuestion[]) => {
    setQuestions(ques);
  }
  useEffect(() => {
    return () => {
      dispatch(hideSideNav())
    }
  }, [dispatch]);
  return (
    <div>
      <ExamsSideAccordion />
      <ExamCarousel questions={questions} />
      <UploadQuestions onAddQuestions={handleSetQuestions} />
    </div>
  )
}

import { useCallback, useEffect, useState } from "react";
import ExamsSideAccordion from "./examsSideAccordion";
import UploadQuestions from "./uploadQuestions";
import { useAppDispatch } from "../../../../../../../store";
import ExamCarousel from "./examCarousel";
import { hideSideNav } from "../../../../../../../store/reducers/exams";
// import Calculator from "../../../../../../../components/calculator";

export default function Exams() {
  const dispatch = useAppDispatch();

  const [questions, setQuestions] = useState<Question[]>([]);

  const handleSetQuestions = useCallback((ques: Question[]) => {
    setQuestions(ques);
  }, []);

  useEffect(() => {
    return () => {
      dispatch(hideSideNav());
    };
  }, [dispatch]);
  return (
    <div>
      <ExamsSideAccordion />
      <ExamCarousel questions={questions} />
      <UploadQuestions onAddQuestions={handleSetQuestions} />
      {/* <Calculator /> */}
    </div>
  );
}

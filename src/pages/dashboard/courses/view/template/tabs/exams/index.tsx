import { useEffect } from "react";
import ExamsSideAccordion from "./examsSideAccordion";
// import UploadQuestions from "./uploadQuestions";
import { useAppDispatch } from "../../../../../../../store";
import { hideSideNav } from "../../../../../../../store/reducers/layout";
import ExamCarousel from "./examCarousel";

export default function Exams() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(hideSideNav())
    }
  }, [dispatch]);
  return (
    <div>
      <ExamsSideAccordion />
      <ExamCarousel />
      {/* <UploadQuestions /> */}
    </div>
  )
}

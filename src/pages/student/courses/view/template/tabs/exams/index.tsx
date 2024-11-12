import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../../store";
import {
  hideSideNav,
  resetExam,
  setAnswer,
} from "../../../../../../../store/reducers/exams";
import ExamInterface from "./examCarousel/ExamInterface";
import ExamDetails from "./examCarousel/ExamDetails";
import ExamResult from "./examCarousel/examResult";
import TitleSection from "../../../../../../../components/title";
import { useTranslation } from "react-i18next";

const ExamComponentStudent = () => {
  const dispatch = useAppDispatch();
  const {examAnswers, assessmentId, examQuestions: questions} = useAppSelector(({ exams }) => exams);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamEnded, setIsExamEnded] = useState(false);
  const examTime = Math.round(questions.length * 1.33333 * 60);
  const {t} = useTranslation("exams");

  console.log(examAnswers);

  const onStart = () => {
    setIsExamStarted(true);
    dispatch(resetExam());
    questions.forEach((q, questionIndex) =>
      dispatch(
        setAnswer({
          questionIndex,
          queAnsDetails: {
            selectedOpt: "",
            showAnsClicked: false,
            isFlagged: false,
            chapter: q.chapter || "",
            domain: q.domain || "",
            answerstate: "skipped"
          },
        }),
      ),
    );
  };
  const handleEndExam = () => {
    setIsExamEnded(true);
  };

  useEffect(() => {
    return () => {
      dispatch(hideSideNav());
    };
  }, [dispatch]);
  return (
      <div className="mx-auto grid gap-4">
          <TitleSection title={t("exams")} />
      {!assessmentId? "fdgdfg" :!questions.length ? (
        <>
        <h4 className="mx-auto">{t("noQuestions")}</h4>
        </>
      ) : isExamEnded ? (
        <ExamResult />
      ) : isExamStarted ? (
        <ExamInterface
          questions={questions}
          examTime={examTime}
          onEndExam={handleEndExam}
        />
      ) : (
        <ExamDetails
          questions={questions}
          examTime={examTime}
          onStart={onStart}
        />
      )}
    </div>
  );
};

export default ExamComponentStudent;
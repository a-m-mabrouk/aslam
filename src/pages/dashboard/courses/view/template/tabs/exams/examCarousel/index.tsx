import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../../../store";
import {
  resetExam,
  setAnswer,
} from "../../../../../../../../store/reducers/exam";
import ExamInterface from "./ExamInterface";
import ExamDetails from "./ExamDetails";
import ExamResult from "./ExamResult";

const ExamComponent = ({ questions }: { questions: Question[] }) => {
  const dispatch = useAppDispatch();
  const examAnswers = useAppSelector(({ exam }) => exam.examAnswers);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamEnded, setIsExamEnded] = useState(false);
  const examTime = Math.round(questions.length * 1.33333 * 60);

  console.log(examAnswers);

  const onStart = () => {
    setIsExamStarted(true);
    dispatch(resetExam());
    questions.forEach((_, questionIndex) =>
      dispatch(
        setAnswer({
          questionIndex,
          queAnsDetails: {
            isCorrect: false,
            selectedOpt: "",
            showAnsClicked: false,
            isFlagged: false,
          },
        }),
      ),
    );
  };
  const handleEndExam = () => {
    setIsExamEnded(true);
  };
  return (
    <div className="mx-auto my-8 max-w-4xl">
      {!questions.length ? (
        <h4>No exams</h4>
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

export default ExamComponent;

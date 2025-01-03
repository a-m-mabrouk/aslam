import { useAppSelector } from "../../../../../../../../../store";

export default function Report() {
  const {activeAssessment} = useAppSelector(({ exams }) => exams);
  
  const questions = activeAssessment?.questions;
  const answersRatio =
    questions && Math.round(
      (questions.reduce(
        (acc, {answers}) =>
          answers[0]?.answerState === "correct" ? acc + 1 : acc,
        0,
      ) /
      questions.length!) *
        10000,
    ) / 100;
  return (
    <div>
      <h2>نتيجتك هى: {answersRatio}%</h2>
    </div>
  );
}

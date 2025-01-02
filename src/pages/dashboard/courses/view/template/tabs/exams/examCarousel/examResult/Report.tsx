import { useAppSelector } from "../../../../../../../../../store";

export default function Report() {
  const {examAnswers, activeAssessment} = useAppSelector(({ exams }) => exams);
  console.log({examAnswers, activeAssessment});
  
  const quesCount = activeAssessment?.questions.length;
  const answersRatio =
    Math.round(
      (examAnswers.reduce(
        (acc, examAnswer) =>
          examAnswer.answerState === "correct" ? acc + 1 : acc,
        0,
      ) /
      quesCount!) *
        10000,
    ) / 100;
  return (
    <div>
      <h2>نتيجتك هى: {answersRatio}%</h2>
    </div>
  );
}

import { useAppSelector } from "../../../../../../../../../store";

export default function Report() {
  const examAnswers = useAppSelector(({ exam }) => exam.examAnswers);
  const answersRatio =
    Math.round(
      (examAnswers.reduce(
        (acc, examAnswer) =>
          examAnswer.answerstate === "correct" ? acc + 1 : acc,
        0,
      ) /
        examAnswers.length) *
        10000,
    ) / 100;
  return (
    <div>
      <h2>نتيجتك هى: {answersRatio}%</h2>
    </div>
  );
}

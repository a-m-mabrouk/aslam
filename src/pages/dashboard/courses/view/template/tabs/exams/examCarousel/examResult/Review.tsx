import { useState } from "react";
import { useAppSelector } from "../../../../../../../../../store";
import { useTranslation } from "react-i18next";
import Question from "../question";
import { Button } from "flowbite-react";

export default function Review({wrongOnly = false}: {wrongOnly?: boolean}) {
  const { t } = useTranslation("exams");
  const { examAnswers, activeAssessment } = useAppSelector(({ exams }) => exams);
  const { questions } = activeAssessment!;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  type ReviewQuestions = Question & {reviewIndex: number};
  const reviewQuestions: ReviewQuestions[] = [];
   examAnswers.forEach((ans, i) => {
    if (wrongOnly) {
      ans.answerstate === "wrong" && reviewQuestions.push({...questions[i], reviewIndex: i})
    } else {
      reviewQuestions.push({...questions[i], reviewIndex: i})
    }
  });
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < reviewQuestions?.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-[10px] border-2`}
    >
      {/* Header */}
      <header className="grid gap-2 bg-gray-200 p-4">
        <div className="flex justify-between">
          <p>
          {`${t(examAnswers[reviewQuestions[currentQuestionIndex].reviewIndex].answerstate)}: ${t("question")} ${reviewQuestions[currentQuestionIndex].reviewIndex + 1} ${t("of")} ${questions?.length}`}
          </p>
        </div>
      </header>

      {/* Question Content */}
      <section>
        <Question
          question={reviewQuestions[currentQuestionIndex]}
          questionIndex={reviewQuestions[currentQuestionIndex].reviewIndex}
        />
        <div>
          <h3>{t("explanation")}</h3>
          <p>{reviewQuestions[currentQuestionIndex]?.question?.description}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between bg-gray-200 p-4">
        <Button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          color="red"
        >
          {t("prev")}
        </Button>
        <Button
          onClick={goToNextQuestion}
          color="green"
          disabled={currentQuestionIndex === reviewQuestions?.length - 1}
        >
          {t("next")}
        </Button>
      </footer>
    </div>
  );
}

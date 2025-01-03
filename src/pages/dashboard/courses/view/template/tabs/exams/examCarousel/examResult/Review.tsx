import { useAppSelector } from "../../../../../../../../../store";
import { useTranslation } from "react-i18next";
import Question from "../question";
import { Button } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { updateItem } from "../../../../../../../../../utilities/idb";
import useGetLang from "../../../../../../../../../hooks/useGetLang";

export default function Review({ wrongOnly = false }: { wrongOnly?: boolean }) {
  const { t } = useTranslation("exams");
  // const dispatch = useAppDispatch();
  const { activeAssessment } = useAppSelector(({ exams }) => exams);
  const { questions } = activeAssessment!;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const {lang} = useGetLang();

  type ReviewQuestions = Question & { reviewIndex: number };
  const reviewQuestions: ReviewQuestions[] = [];
  questions.forEach(({answers}, i) => {
    if (wrongOnly) {
      answers[0].answerState === "wrong" &&
        reviewQuestions.push({ ...questions[i], reviewIndex: i });
    } else {
      reviewQuestions.push({ ...questions[i], reviewIndex: i });
    }
  });

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < reviewQuestions?.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      activeAssessment && updateItem(activeAssessment?.id, { currentQuestionIndex: currentQuestionIndex + 1 });
    }
  }, [activeAssessment, currentQuestionIndex, reviewQuestions?.length]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      activeAssessment && updateItem(activeAssessment?.id, { currentQuestionIndex: currentQuestionIndex - 1 });
    }
  }, [activeAssessment, currentQuestionIndex]);
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        if (lang === "en") {
          goToNextQuestion();
        } else {
          goToPreviousQuestion();
        }
      } else if (event.key === "ArrowLeft") {
        if (lang === "en") {
          goToPreviousQuestion();
        } else {
          goToNextQuestion();
        }
      }
    },
    [goToNextQuestion, goToPreviousQuestion, lang],
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-[10px] border-2`}
    >
      {/* Header */}
      <header className="grid gap-2 bg-gray-200 p-4">
        <div className="flex justify-between">
          <p>
            {`${t(questions[reviewQuestions[currentQuestionIndex]?.reviewIndex]?.answers[0]?.answerState)}: ${t("question")} ${reviewQuestions[currentQuestionIndex]?.reviewIndex + 1} ${t("of")} ${questions?.length}`}
          </p>
        </div>
      </header>

      {/* Question Content */}
      <section>
        <Question
          question={reviewQuestions[currentQuestionIndex]}
          questionIndex={reviewQuestions[currentQuestionIndex]?.reviewIndex}
        />
        {reviewQuestions[currentQuestionIndex]?.question?.description ? (
          <div className="p-4">
            <h3 className="mb-3 text-xl text-indigo-600">{t("explanation")}</h3>
            <p>
              {reviewQuestions[currentQuestionIndex]?.question?.description}
            </p>
          </div>
        ) : null}
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

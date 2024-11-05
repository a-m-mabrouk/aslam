import { useCallback } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../../../store";
import { setAnswer } from "../../../../../../../../../store/reducers/exam";

export default function QuestionMCQ({
  question,
  questionIndex,
}: {
  question: Question;
  questionIndex: number;
}) {
  const dispatch = useAppDispatch();
  const examAnswers = useAppSelector(({ exam }) => exam.examAnswers);

  const handleRadioChange = useCallback(
    ({ target }: { target: HTMLInputElement }) => {
      const isCorrect =
        target.value.trim() ===
        question.options
          .filter((opt) => opt.answer === "true")[0]
          .option?.trim();
      const selectedOpt = target.value;

      dispatch(
        setAnswer({
          questionIndex,
          queAnsDetails: { isCorrect, selectedOpt, showAnsClicked: false },
        }),
      );
    },
    [dispatch, question, questionIndex],
  );
  return (
    <ul className="mt-4">
      {question.options.map((opt, i) => {
        const selectedOpt = examAnswers[questionIndex]?.selectedOpt;
        const isCorrect = examAnswers[questionIndex]?.isCorrect;
        const checkDisabled = examAnswers[questionIndex]?.showAnsClicked;
        
        const ansClass = !checkDisabled
          ? "border-gray-300" // Default gray if not disabled
          : selectedOpt === opt.option && !isCorrect
            ? "border-red-800 border-2" // Red if selected and not correct
            : selectedOpt === opt.option && isCorrect
              ? "border-green-800 border-2" // Green if selected and correct
              : checkDisabled &&
                  selectedOpt !== opt.option &&
                  opt.answer === "true"
                ? "border-green-800 border-2" // Green if disabled, not selected, but is the correct answer
                : "border-gray-300"; // Gray if none of the above conditions are met
        return (
          <li
            className={`mt-2 border ${ansClass} rounded bg-transparent px-4 py-2 font-semibold ${checkDisabled ? "pointer-events-none opacity-70" : ""}`}
          >
            <input
              type="radio"
              checked={selectedOpt === opt.option}
              name={`question-${questionIndex}`}
              id={`option-${i + 1}`}
              onChange={handleRadioChange}
              value={opt.option}
            />
            <label htmlFor={`option-${i + 1}`} className="ml-2">
              {opt.option}
            </label>
          </li>
        );
      })}
    </ul>
  );
}

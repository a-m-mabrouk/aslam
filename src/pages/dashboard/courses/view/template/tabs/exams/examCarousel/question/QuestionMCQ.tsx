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
      if (question.type === "mcq") {
        const key: "a" | "b" | "c" | "d" | "e" | "f" =
          question.answer as typeof key;
        const isCorrect = target.value.trim() === question[key]?.trim();
        const selectedOpt = target.id[target.id.length - 1];

        dispatch(
          setAnswer({
            questionIndex,
            queAnsDetails: { isCorrect, selectedOpt, showAnsClicked: false },
          }),
        );
      }
    },
    [dispatch, question, questionIndex],
  );

  const addOption = useCallback(
    (optNum: string) => {
      if (question.type === "mcq") {
        const key: "a" | "b" | "c" | "d" | "e" | "f" = optNum as typeof key;

        const selectedOpt = examAnswers[questionIndex]?.selectedOpt;
        const isCorrect = examAnswers[questionIndex]?.isCorrect;
        const checkDisabled = examAnswers[questionIndex]?.showAnsClicked;

        const ansClass = !checkDisabled
          ? "border-gray-300" // Default gray if not disabled
          : selectedOpt === key && !isCorrect
            ? "border-red-800 border-2" // Red if selected and not correct
            : selectedOpt === key && isCorrect
              ? "border-green-800 border-2" // Green if selected and correct
              : checkDisabled && selectedOpt !== key && key === question.answer
                ? "border-green-800 border-2" // Green if disabled, not selected, but is the correct answer
                : "border-gray-300"; // Gray if none of the above conditions are met

        return question[key] && question[key] !== "" ? (
          <li
            className={`mt-2 border ${ansClass} rounded bg-transparent px-4 py-2 font-semibold ${key} ${checkDisabled ? "pointer-events-none opacity-70" : ""}`}
          >
            <input
              type="radio"
              checked={selectedOpt === key}
              name={`question-${questionIndex}`}
              id={`option-${key}`}
              onChange={handleRadioChange}
              value={question[key]}
            />
            <label htmlFor={`option-${key}`} className="ml-2">
              {question[key]}
            </label>
          </li>
        ) : (
          <></>
        );
      }
    },
    [examAnswers, handleRadioChange, question, questionIndex],
  );
  return (
    <ul className="mt-4">
      {addOption("a")}
      {addOption("b")}
      {addOption("c")}
      {addOption("d")}
      {addOption("e")}
      {addOption("f")}
    </ul>
  );
}

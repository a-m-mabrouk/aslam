import { useCallback, useMemo } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../../../../store";
import {
  setIsCorrect,
  setSelectedOpt,
} from "../../../../../../../../../../store/reducers/exam";
import { useTranslation } from "react-i18next";
import { toastifyBox } from "../../../../../../../../../../helper/toastifyBox";

export default function QuestionMCQ({
  question,
  questionIndex,
}: {
  question: Question;
  questionIndex: number;
}) {
  const {t} = useTranslation("exams")
  const dispatch = useAppDispatch();
  const examAnswers = useAppSelector(({ exam }) => exam.examAnswers);
  const selectedOptionsArr = JSON.parse(examAnswers[questionIndex]?.selectedOpt || '[]');
  const correctOptionsArr = useMemo(
    () =>
      question.options
        .filter((opt) => opt.answer === "true")
        .map(({ option }) => option)
        .sort(),
    [question],
  );

  const handleRadioChange = useCallback(
    ({ target }: { target: HTMLInputElement }) => {
      const { value, checked } = target;
      let userAnswers: string[] = [];
      if (correctOptionsArr.length === 1) {
        userAnswers = [value]
      } else {
        if (checked) {
          if (selectedOptionsArr.length < correctOptionsArr.length) {
            userAnswers = [...selectedOptionsArr, value].sort()
          } else {
            toastifyBox("info", t("youCanOnlyChoose") + correctOptionsArr.length)
            return;
          }
        } else {
          userAnswers = selectedOptionsArr.filter((v: string) => v !== value).sort();
        }
      }
      const isCorrect = userAnswers!.join() === correctOptionsArr.join();      
      const selectedOpt = JSON.stringify(userAnswers);
      dispatch(setIsCorrect({ questionIndex, isCorrect }));
      dispatch(setSelectedOpt({ questionIndex, selectedOpt }));
    },
    [correctOptionsArr, dispatch, questionIndex, selectedOptionsArr, t],
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
              key={opt.option} className={`mt-2 border ${ansClass} rounded bg-transparent px-4 py-2 font-semibold ${checkDisabled ? "pointer-events-none opacity-70" : ""}`}
            >
              <input
                type={correctOptionsArr.length > 1 ? "checkbox" : "radio"}
                checked={selectedOptionsArr.includes(opt.option)}
                name={`question-${questionIndex}`}
                id={`option-${i + 1}`}
                onChange={handleRadioChange}
                value={opt.option}
              />
              <label htmlFor={`option-${i + 1}`} className="ms-2">
                {opt.option}
              </label>
            </li>
          );
        })}
    </ul>
  );
}

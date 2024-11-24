import { useCallback, useMemo } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../../../../store";
import {
  setAnswerState,
  setSelectedOpt,
} from "../../../../../../../../../../store/reducers/exams";
import { useTranslation } from "react-i18next";
import { toastifyBox } from "../../../../../../../../../../helper/toastifyBox";

export default function QuestionMCQ({
  question,
  questionIndex,
  imagesArr,
}: {
  question: Question;
  questionIndex: number;
  imagesArr: string[] | null;
}) {
  const { t } = useTranslation("exams");
  const dispatch = useAppDispatch();
  const { examAnswers, review } = useAppSelector(({ exams }) => exams);
  const selectedOptionsArr = JSON.parse(
    examAnswers[questionIndex]?.selectedOpt || "[]",
  );
  const correctOptionsArr = useMemo(
    () =>
      question?.question?.options
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
        userAnswers = [value];
      } else {
        if (checked) {
          if (selectedOptionsArr.length < correctOptionsArr.length) {
            userAnswers = [...selectedOptionsArr, value].sort();
          } else {
            toastifyBox(
              "info",
              t("youCanOnlyChoose") + correctOptionsArr.length,
            );
            return;
          }
        } else {
          userAnswers = selectedOptionsArr
            .filter((v: string) => v !== value)
            .sort();
        }
      }
      const answerstate = !userAnswers.length
        ? "skipped"
        : userAnswers!.join() === correctOptionsArr.join()
          ? "correct"
          : "wrong";
      const selectedOpt = JSON.stringify(userAnswers);
      dispatch(setAnswerState({ questionIndex, answerstate }));
      dispatch(setSelectedOpt({ questionIndex, selectedOpt }));
    },
    [correctOptionsArr, dispatch, questionIndex, selectedOptionsArr, t],
  );
  return (
    <div className={imagesArr? "grid grid-cols-[3fr_2fr]": undefined}>
      <ul className="mt-4">
        {question?.question?.options.map((opt, i) => {
          const selectedOpt = examAnswers[questionIndex]?.selectedOpt;
          const isSelected = selectedOpt?.includes(opt.option);
          const isCorrect = opt.answer === "true";
          const checkDisabled =
            examAnswers[questionIndex]?.showAnsClicked || review;
          const ansClass = !checkDisabled
            ? "border-gray-300"
            : isSelected && !isCorrect
              ? "border-red-800 border-2"
              : isSelected && isCorrect
                ? "border-green-800 border-2"
                : checkDisabled && !isSelected && isCorrect
                  ? "border-green-800 border-2"
                  : "border-gray-300";
          return (
            <li
              key={opt.option}
              className={`mt-2 border ${ansClass} rounded bg-transparent px-4 py-2 font-semibold ${checkDisabled ? "pointer-events-none opacity-70" : ""}`}
            >
              <input
                type={correctOptionsArr.length > 1 ? "checkbox" : "radio"}
                checked={selectedOptionsArr?.includes(opt.option)}
                name={`question-${questionIndex}`}
                id={`option-${i + 1}`}
                onChange={handleRadioChange}
                value={opt.option}
              />
              <label
                htmlFor={`option-${i + 1}`}
                className="ms-2 cursor-pointer"
              >
                {opt.option}
              </label>
            </li>
          );
        })}
      </ul>
      {imagesArr ? (
        <div id="head-imgs-container" className="grid gap-1">
          {imagesArr.map((img) => (
            <img
              className="mx-auto size-4/5 rounded border-2"
              key={img + crypto.randomUUID()}
              src={img}
              alt=""
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

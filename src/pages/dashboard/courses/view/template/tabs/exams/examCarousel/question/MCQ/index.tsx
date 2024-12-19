import { useCallback, useMemo, useRef, useState } from "react";
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

export function OptionEditable({
  opt,
  optIndex,
}: {
  opt: Option;
  optIndex: number;
}) {
  const [optText, setOptText] = useState<string>(opt.option);
  const [isTrue, setIsTrue] = useState<boolean>(opt.answer === "true");
  return (
    <li
      key={opt.option}
      className={`mt-2 flex items-center rounded border bg-transparent px-4 py-2 font-semibold`}
    >
      <input
        type="text"
        hidden
        name={`opt-${optIndex}`}
        onChange={() => {}}
        value={`{"option": "${optText}", "answer": "${isTrue}"}`}
      />
      <input
        type="checkbox"
        checked={isTrue}
        onChange={() => setIsTrue((prev) => !prev)}
        value={isTrue.toString()}
      />
      <textarea
        className="ms-2 grow"
        onInput={({ currentTarget }) => setOptText(currentTarget.value)}
        defaultValue={optText}
      ></textarea>
    </li>
  );
}

export function OptionItem({
  opt,
  optIndex,
  ansClass,
  questionIndex,
  onRadioChange,
  checkDisabled,
  correctOptionsArr,
  selectedOptionsArr,
}: {
  opt: Option;
  optIndex: number;
  ansClass: string;
  questionIndex: number;
  onRadioChange: (value: string, checked: boolean) => void;
  checkDisabled: boolean;
  correctOptionsArr: string[];
  selectedOptionsArr: string[];
}) {
  const buttonType = correctOptionsArr.length > 1 ? "checkbox" : "radio";
  const optRef = useRef<HTMLInputElement | null>(null);
  return (
    <li
      key={opt.option}
      className={`mt-2 border ${ansClass} rounded bg-transparent px-4 py-2 font-semibold ${checkDisabled ? "pointer-events-none opacity-70" : "cursor-pointer"}`}
      onClick={() => optRef.current?.click()}
    >
      <input
        className="cursor-pointer"
        type={buttonType}
        checked={selectedOptionsArr?.includes(opt.option)}
        name={`question-${questionIndex}`}
        id={`option-${optIndex + 1}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={({ target }) => onRadioChange(opt.option, target.checked)}
        value={opt.option}
        ref={optRef}
      />
      <label
        htmlFor={`option-${optIndex + 1}`}
        className="ms-2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {opt.option}
      </label>
    </li>
  );
}

export default function QuestionMCQ({
  question,
  questionIndex,
  imagesArr,
  editable,
  isDescShow,
}: {
  question: Question;
  questionIndex: number;
  imagesArr: string[] | null;
  editable: boolean;
  isDescShow: boolean;
}) {
  const { t } = useTranslation("exams");
  const dispatch = useAppDispatch();
  const { examAnswers, review, activeAssessment } = useAppSelector(({ exams }) => exams);
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
    (value: string, checked: boolean) => {
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
      if (activeAssessment?.id) {
        dispatch(setAnswerState({ assessment_id: activeAssessment?.id, questionIndex, answerstate }));
        dispatch(setSelectedOpt({ assessment_id: activeAssessment?.id, questionIndex, selectedOpt }));
        
      }
    },
    [activeAssessment?.id, correctOptionsArr, dispatch, questionIndex, selectedOptionsArr, t],
  );
  return editable ? (
    <div className={imagesArr ? "grid" : undefined}>
      {imagesArr ? (
        <div id="head-imgs-container" className="grid gap-1">
          <h4 className="text-xl">Image:</h4>
          {imagesArr.map((img, i) => (
            <input
              type="text"
              className="w-full"
              name={`img-${i}`}
              key={img + i}
              defaultValue={img}
            />
          ))}
        </div>
      ) : null}
      <ul className="mt-4">
        <h4 className="text-xl">Options:</h4>
        {question?.question?.options.map((opt, i) => (
          <OptionEditable key={i} opt={opt} optIndex={i} />
        ))}
      </ul>
    </div>
  ) : (
    <div className={imagesArr ? "grid grid-cols-[3fr_2fr]" : undefined}>
      <ul className="mt-4">
        {question?.question?.options.map((opt, i) => {
          const selectedOpt = examAnswers[questionIndex]?.selectedOpt;
          const isSelected = selectedOpt?.includes(opt.option);
          const isCorrect = opt.answer === "true";
          const checkDisabled =
            (examAnswers[questionIndex]?.showAnsClicked && isDescShow) || review;
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
            <OptionItem
              key={opt.option}
              opt={opt}
              optIndex={i}
              questionIndex={questionIndex}
              ansClass={ansClass}
              checkDisabled={checkDisabled}
              onRadioChange={handleRadioChange}
              correctOptionsArr={correctOptionsArr}
              selectedOptionsArr={selectedOptionsArr}
            />
          );
        })}
      </ul>
      {imagesArr ? (
        <div id="head-imgs-container" className="grid gap-1">
          {imagesArr.map((img, i) => (
            <img
              className="mx-auto size-4/5 rounded border-2"
              key={img + i}
              src={img}
              alt=""
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

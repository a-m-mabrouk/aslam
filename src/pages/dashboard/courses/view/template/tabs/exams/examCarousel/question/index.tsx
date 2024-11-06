import { memo } from "react";
import QuestionMCQ from "./MCQ";
import QuestionDragDrop from "./dragDrop";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../../../store";
import { setAnswer } from "../../../../../../../../../store/reducers/exam";

const Question = memo(
  ({
    question,
    questionIndex,
  }: {
    question: Question;
    questionIndex: number;
  }) => {
    const dispatch = useAppDispatch();
    const examAnswers = useAppSelector(({ exam }) => exam.examAnswers);

    if (!examAnswers[questionIndex]) {
      dispatch(
        setAnswer({
          questionIndex,
          queAnsDetails: {
            isCorrect: false,
            selectedOpt: "",
            showAnsClicked: false,
            isFlagged: false,
          },
        }),
      );
    }

    let questionMarkup = <h2>You can only add MCQ & DragDrop question.</h2>;
    if (question.type === "mcq") {
      questionMarkup = (
        <QuestionMCQ question={question} questionIndex={questionIndex} />
      );
    } else if (question.type === "dragdrop") {
      questionMarkup = (
        <QuestionDragDrop question={question} questionIndex={questionIndex} />
      );
    }

    return (
      <main className="grow p-4">
        <h2>{question.name}</h2>
        {questionMarkup}
      </main>
    );
  },
);

export default Question;

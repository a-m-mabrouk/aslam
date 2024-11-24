import { memo, useEffect } from "react";
import QuestionMCQ from "./MCQ";
import QuestionDragDrop from "./dragDrop";
import { setActiveAssessQuestionIndex } from "../../../../../../../../../store/reducers/exams";
import { useAppDispatch } from "../../../../../../../../../store";

const Question = memo(
  ({
    question,
    questionIndex,
  }: {
    question: Question;
    questionIndex: number;
  }) => {
    const dispatch = useAppDispatch();
    const questionName = question?.question?.name.split("<<0>>");
    const questionText = questionName[0];
    const imagesArr = questionName[1] ? questionName[1].split("###") : null;

    useEffect(() => {
      dispatch(setActiveAssessQuestionIndex(questionIndex));
    }, [dispatch, questionIndex])
    
    let questionMarkup = <h2>You can only add MCQ & DragDrop question.</h2>;
    if (question?.question?.type === "mcq") {
      questionMarkup = (
        <QuestionMCQ imagesArr={imagesArr} question={question} questionIndex={questionIndex} />
      );
    } else if (question?.question?.type === "dragdrop") {
      questionMarkup = (
        <QuestionDragDrop question={question} questionIndex={questionIndex} />
      );
    }

    return (
      <main className="grow p-4 md:min-h-[30rem]">
        <h2 className="mb-2">{questionText}</h2>
        {questionMarkup}
      </main>
    );
  },
);

export default Question;

import { memo } from "react";
import QuestionMCQ from "./MCQ";
import QuestionDragDrop from "./dragDrop";

const Question = memo(
  ({
    question,
    questionIndex,
  }: {
    question: Question;
    questionIndex: number;
  }) => {    
    let questionMarkup = <h2>You can only add MCQ & DragDrop question.</h2>;
    if (question?.question?.type === "mcq") {
      questionMarkup = (
        <QuestionMCQ question={question} questionIndex={questionIndex} />
      );
    } else if (question?.question?.type === "dragdrop") {
      questionMarkup = (
        <QuestionDragDrop question={question} questionIndex={questionIndex} />
      );
    }

    return (
      <main className="grow p-4">
        <h2>{question?.question?.name}</h2>
        {questionMarkup}
      </main>
    );
  },
);

export default Question;

import { memo } from "react";
import QuestionMCQ from "./QuestionMCQ";
import QuestionDragDrop from "./QuestionDragDrop";

const Question = memo(
  ({
    question,
    questionIndex,
  }: {
    question: Question;
    questionIndex: number;
  }) => {
    

    let questionMarkup = <h2>You can only add MCQ & DragDrop question.</h2>;
    if (question.type === "mcq") {
      questionMarkup = <QuestionMCQ question={question} questionIndex={questionIndex} />;
    } else if (question.type === "dragdrop") {
      questionMarkup = <QuestionDragDrop question={question} questionIndex={questionIndex} />;
    }

    return (
      <main className="grow p-4">
        <h2>{question.questionText}</h2>
        {questionMarkup}
      </main>
    );
  },
);

export default Question;

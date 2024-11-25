import {
  FormEventHandler,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import QuestionMCQ from "./MCQ";
import QuestionDragDrop from "./dragDrop";
import { setActiveAssessment, setActiveAssessQuestionIndex } from "../../../../../../../../../store/reducers/exams";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../../../store";
import {
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "flowbite-react";
import Cookies from "js-cookie";
import { API_EXAMS } from "../../../../../../../../../router/routes/apiRoutes";
import { toastifyBox } from "../../../../../../../../../helper/toastifyBox";
import axios from "axios";

const Question = memo(
  ({
    question,
    questionIndex,
  }: {
    question: Question;
    questionIndex: number;
  }) => {
    const [editable, setEditable] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const assessment_id = useAppSelector(({ exams }) => exams.activeAssessment?.id);
    const isTeacher = useAppSelector(({ auth }) => auth.role) === "teacher";
    const questionName = question?.question?.name.split("<<0>>");
    const questionText = questionName[0];
    const imagesArr = questionName[1] ? questionName[1].split("###") : null;

    useEffect(() => {
      dispatch(setActiveAssessQuestionIndex(questionIndex));
      setEditable(false);
    }, [dispatch, questionIndex]);

    let questionMarkup = <h2>You can only add MCQ & DragDrop question.</h2>;
    if (question?.question?.type === "mcq") {
      questionMarkup = (
        <QuestionMCQ
          imagesArr={imagesArr}
          question={question}
          questionIndex={questionIndex}
          editable={editable}
        />
      );
    } else if (question?.question?.type === "dragdrop") {
      questionMarkup = (
        <QuestionDragDrop question={question} questionIndex={questionIndex} />
      );
    }

    const handleEditQuestion: FormEventHandler<HTMLFormElement> = useCallback(
      async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const {id, question: que} = question;
        const questionObj: Record<string, unknown> = {};
        const newOptions: unknown[] = [];
        const images: string[] = [];
        formData.forEach((value, key) => {
          if (key.includes("opt-")) {
            newOptions.push(JSON.parse(value as string));            
          } else if (key.includes("img-")) {
            images.push(value as string);
          } else {
            questionObj[key] = value;
          }
        });
        // questionObj.options = newOptions;
        questionObj.questionText += "<<0>>" + images.join("###");
        const requestObj = {question: {...que, name: questionObj.questionText, options: newOptions, description: questionObj.description}, assessment_id}
        try {
          // const {data} = await axiosDefault.put(`${API_EXAMS.questions}/${id}`, requestObj);
          const {data} = await axios.put(`${API_EXAMS.questions}/${id}`, requestObj, {
            headers: {
              'Authorization': `Bearer ${Cookies.get("tk") || ""}`
            }
          });
          toastifyBox("success", data.message);
          setEditable(false);
          dispatch(setActiveAssessment(data.data))
        } catch (error) {
          toastifyBox("error", "couldn't update question!");          
        }
      },
      [assessment_id, dispatch, question],
    );

    return (
      <main className="grow p-4 md:min-h-[30rem]">
        {editable && isTeacher ? (
          <form onSubmit={(event) => handleEditQuestion(event)}>
            <div className="flex justify-center gap-2">
              <Button
                className="size-8 p-0"
                color="red"
                onClick={() => setEditable(false)}
              >
                <XMarkIcon className="size-4" />
              </Button>
              <Button className="size-8 p-0" type="submit" color="green">
                <CheckIcon className="size-4" />
              </Button>
            </div>
            <h4 className="text-xl">chapter:</h4>
            <input type="text" className="mb-2 block w-full" name="chapter" defaultValue={question?.question?.chapter} />
            <h4 className="text-xl">domain:</h4>
            <input type="text" className="mb-2 block w-full" name="domain" defaultValue={question?.question?.domain} />
            <h4 className="text-xl">Question:</h4>
            <textarea className="mb-2 block w-full" name="questionText" defaultValue={questionText}></textarea>
            {questionMarkup}
            <h4 className="text-xl">Description:</h4>
            <textarea className="mb-2 block w-full" name="description" defaultValue={question?.question?.description}></textarea>
          </form>
        ) : (
          <>
            {isTeacher && question.question.type === "mcq" ? (
              <Button className="!m-0 justify-self-center !p-0" onClick={() => setEditable(true)}>
                <PencilSquareIcon className="size-5" />
              </Button>
            ) : null}
            <h2 className="mb-2">{questionText}</h2>
            {questionMarkup}
          </>
        )}
      </main>
    );
  },
);

export default Question;

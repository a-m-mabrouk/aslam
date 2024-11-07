import { useState, useEffect, useRef, useMemo } from "react";
import { Button, Card, Progress, Modal, Popover } from "flowbite-react";
import {
  PauseIcon,
  PlayIcon,
  StopIcon,
  FlagIcon as FlagIconSolid,
  ListBulletIcon,
} from "@heroicons/react/24/solid";
import {
  FlagIcon as FlagIconOutline,
  CalculatorIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import Question from "./question";
import { useAppDispatch, useAppSelector } from "../../../../../../../../store";
import {
  resetExam,
  setIsFlagged,
  setShowAnsClicked,
} from "../../../../../../../../store/reducers/exam";
import { useTranslation } from "react-i18next";
import { Calculator } from "react-advanced-calculator";
import "react-advanced-calculator/dist/styles/calculator.css";
import { createColumnHelper } from "@tanstack/react-table";
import CellRedirect from "../../../../../../../../components/table/cellRedirect";
import { redirect } from "react-router";
// import DrawingBoard from "react-drawing-board";

const columnHelper = createColumnHelper<DataStudent>();

function DrawingBoardContainer() {
  return (
    <div
      className="max-h-60"
      style={{
        width: "60rem",
        maxWidth: "90vw",
        height: "60rem",
        maxHeight: "60vh",
      }}
    >
      {/* <DrawingBoard toolbarPlacement="left" /> */}
    </div>
  );
}

const ExamDetails = ({
  onStart,
  questions,
}: {
  onStart: () => void;
  questions: Question[];
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  return (
    <Card>
      <div className="flex justify-around">
        <div className="text-center">
          <h2 className="text-lg font-bold">الدرجة المطلوبة للنجاح</h2>
          <p>75%</p>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold">سؤال</h2>
          <p>{questions?.length}</p>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold">مدة الاختبار</h2>
          <p>{formatTime(Math.round(questions.length * 1.33333 * 60))}</p>
        </div>
      </div>
      <ul className="ml-5 mt-4 list-disc text-right">
        <li>يمكنك إيقاف الاختبار مؤقتًا...</li>
        <li>يمكنك إعادة إجراء الاختبار...</li>
        {/* Additional instructions */}
      </ul>
      <Button onClick={onStart} className="mt-5">
        ابدأ الاختبار
      </Button>
    </Card>
  );
};

const ExamInterface = ({ questions }: { questions: Question[] }) => {
  const { t } = useTranslation("exams");
  const dispatch = useAppDispatch();
  const examAnswers = useAppSelector(({ exam }) => exam.examAnswers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    Math.round(questions.length * 1.33333 * 60),
  );
  const [isPaused, setIsPaused] = useState(false);
  const [descModal, setDescModal] = useState(false);
  const [flagsModal, setFlagsModal] = useState(false);
  const [allQuestionsModal, setAllQuestionsModal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
  };

  const pauseTimer = () => {
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resumeTimer = () => {
    setIsPaused(false);
    startTimer();
  };

  const stopExam = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeRemaining(0);
  };

  useEffect(() => {
    if (!isPaused) startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  const progress =
    ((Math.round(questions.length * 1.33333 * 60) - timeRemaining) /
      Math.round(questions.length * 1.33333 * 60)) *
    100;

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions?.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };
  const showAns = () => {
    dispatch(setShowAnsClicked(currentQuestionIndex));
    setDescModal(true);
  };
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const flaggedQuestionsArr = examAnswers
    .map((examAnswer, i) => (examAnswer.isFlagged ? i : -1))
    .filter((i) => i !== -1);
    // console.log(flaggedQuestionsArr);

    // const columns = useMemo(
    //   () => [
    //     columnHelper.accessor("id", {
    //       header: t("table.id"),
    //       cell: (info) => (
    //         <CellRedirect url={redirect(info.getValue())}>
    //           {info.getValue()}
    //         </CellRedirect>
    //       ),
    //     }),
    //     columnHelper.accessor("first_name", {
    //       header: t("table.firstName"),
    //       cell: (info) => {
    //         const id = info.row.original.id;
    //         const row = info.row.original;
    //         return (
    //           <CellRedirect url={redirect(id)}>
    //             {row.first_name + " " + row.last_name}
    //           </CellRedirect>
    //         );
    //       },
    //     }),
    //     columnHelper.accessor("phone_number", {
    //       header: t("table.phone_number"),
    //       cell: (info) => {
    //         const id = info.row.original.id;
    //         return (
    //           <CellRedirect url={redirect(id)}>{info.getValue()}</CellRedirect>
    //         );
    //       },
    //     }),
    //     columnHelper.accessor("email", {
    //       header: t("table.email"),
    //       cell: (info) => {
    //         const id = info.row.original.id;
    //         return (
    //           <CellRedirect url={redirect(id)}>{info.getValue()}</CellRedirect>
    //         );
    //       },
    //     }),
    //   ],
    //   [t],
    // );
    

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-gray-200 p-4">
        <div>
          <Popover content={<Calculator />} placement="top">
            <Button>
              <CalculatorIcon className="size-5" />
              {t("calculator")}
            </Button>
          </Popover>
        </div>
        <div>
          <Popover content={<DrawingBoardContainer />} placement="top">
            <Button>
              <PencilSquareIcon className="size-5" />
              {t("board")}
            </Button>
          </Popover>
        </div>
        <div>
          <p>
            {t("remainingTime")} {formatTime(timeRemaining)}
          </p>
          <Progress progress={progress} color="blue" className="mt-2" />
        </div>
        <div>
          <p>
            {t("question")} {currentQuestionIndex + 1} {t("of")}{" "}
            {questions?.length}
          </p>
        </div>
        <div className="flex">
          <span
            onClick={isPaused ? resumeTimer : pauseTimer}
            color="gray"
            className="mr-2"
          >
            {isPaused ? (
              <PlayIcon className="size-8 cursor-pointer" />
            ) : (
              <PauseIcon className="size-8 cursor-pointer" />
            )}
          </span>
          <span onClick={stopExam} color="red">
            <StopIcon className="size-8 cursor-pointer" />
          </span>
          <span onClick={() => dispatch(setIsFlagged(currentQuestionIndex))}>
            {examAnswers[currentQuestionIndex]?.isFlagged ? (
              <FlagIconSolid className="size-8 cursor-pointer fill-red-700" />
            ) : (
              <FlagIconOutline className="size-8 cursor-pointer text-gray-700" />
            )}
          </span>
        </div>
      </header>

      {/* Question Content */}
      <Question
        question={questions[currentQuestionIndex]}
        questionIndex={currentQuestionIndex}
      />

      {/* Footer */}
      <footer className="flex items-center justify-between bg-gray-200 p-4">
        <Button
          onClick={() => setAllQuestionsModal(true)}
          className="bg-indigo-600 text-white"
        >
          <ListBulletIcon className="size-5" /> {t("viewAllQuestions")}
        </Button>
        <Button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          color="red"
        >
          {t("prev")}
        </Button>
        <Button
          onClick={showAns}
          disabled={examAnswers[currentQuestionIndex]?.showAnsClicked}
          color="yellow"
        >
          {t("correctAnswer")}
        </Button>
        <Button
          onClick={() => setFlagsModal(true)}
          disabled={!flaggedQuestionsArr.length}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          <FlagIconOutline className="size-5" /> {t("flaggedQuestions")}
        </Button>
        <Button
          onClick={goToNextQuestion}
          disabled={currentQuestionIndex === questions?.length - 1}
          color="green"
        >
          {t("next")}
        </Button>
      </footer>
      <Modal show={descModal} size="md" onClose={() => setDescModal(false)}>
        <Modal.Header>{t("description")}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 p-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {questions[currentQuestionIndex]?.description}
            </p>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={flagsModal} size="md" onClose={() => setFlagsModal(false)}>
        <Modal.Header>{t("flaggedQuestions")}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 p-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {flaggedQuestionsArr.map((e) => {
                return (
                  <Button
                    onClick={() => {
                      setCurrentQuestionIndex(e);
                      setFlagsModal(false);
                    }}
                  >
                    {e + 1}
                  </Button>
                );
              })}
            </p>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={allQuestionsModal}
        size="md"
        onClose={() => setAllQuestionsModal(false)}
      >
        <Modal.Header>{t("allQuestions")}</Modal.Header>
        <Modal.Body>
          <div className="grid gap-2">
            {/* <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400"> */}
              {questions.map((q, i) => {
                return (
                  <Button
                    onClick={() => {
                      setCurrentQuestionIndex(i);
                      setAllQuestionsModal(false);
                    }}
                  >
                    {i + 1} {q.name}
                  </Button>
                );
              })}
            {/* </p> */}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const ExamComponent = ({ questions }: { questions: Question[] }) => {
  const dispatch = useAppDispatch();
  const [isExamStarted, setIsExamStarted] = useState(false);
  const examAnswers = useAppSelector(({ exam }) => exam.examAnswers);
  console.log(examAnswers);

  return (
    <div className="mx-auto my-8 max-w-4xl">
      {!questions.length ? (
        <h4>No exams</h4>
      ) : isExamStarted ? (
        <ExamInterface questions={questions} />
      ) : (
        <ExamDetails
          questions={questions}
          onStart={() => {
            setIsExamStarted(true);
            dispatch(resetExam());
          }}
        />
      )}
    </div>
  );
};

export default ExamComponent;

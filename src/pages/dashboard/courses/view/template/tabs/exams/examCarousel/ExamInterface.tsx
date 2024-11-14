import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Progress,
  Modal,
  Popover,
  TableHead,
  Table,
  TableRow,
  TableHeadCell,
  TableBody,
  TableCell,
} from "flowbite-react";
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
  ClockIcon,
} from "@heroicons/react/24/outline";
import Question from "./question";
import { useAppDispatch, useAppSelector } from "../../../../../../../../store";
import {
  setIsFlagged,
  setShowAnsClicked,
} from "../../../../../../../../store/reducers/exams";
import { useTranslation } from "react-i18next";
import Calculator from "../../../../../../../../components/calculator";

type FlaggedQuestionType = Question & { queIndex: number };

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

export default function ExamInterface({
  questions,
  examTime,
  onEndExam,
}: {
  questions: Question[];
  examTime: number;
  onEndExam: () => void;
}) {
  const { t } = useTranslation("exams");
  const dispatch = useAppDispatch();
  const examAnswers = useAppSelector(({ exams }) => exams.examAnswers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(examTime);
  const [isPaused, setIsPaused] = useState(false);
  const [endExamModal, setEndExamModal] = useState(false);
  const [descModal, setDescModal] = useState(false);
  const [flagsModal, setFlagsModal] = useState(false);
  const [allQuestionsModal, setAllQuestionsModal] = useState(false);
  const [borderColor, setBorderColor] = useState<string>("border-gray-300");
  const [timerColor, setTimerColor] = useState<string>("");
  const timerIntervalRef = useRef<number | null>(null);
  const overIntervalRef = useRef<number | null>(null);

  const clearTimerInterval = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };
  const clearColorInterval = () => {
    if (overIntervalRef.current) clearInterval(overIntervalRef.current);
  };
  const startTimeoutAnimation = useCallback(() => {
    clearTimerInterval();
    overIntervalRef.current = setInterval(() => {
      setBorderColor((prev) =>
        prev === "border-gray-300" ? "border-red-500" : "border-gray-300",
      );
      setTimerColor((prev) => (prev === "" ? "text-red-500" : ""));
    }, 1000);
  }, []);
  const startTimer = useCallback(() => {
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      timeRemaining === 0 && startTimeoutAnimation();
    }, 1000);
  }, [startTimeoutAnimation, timeRemaining]);

  const pauseTimer = () => {
    setIsPaused(true);
    clearTimerInterval();
    clearColorInterval();
  };

  const resumeTimer = () => {
    setIsPaused(false);
    startTimer();
  };

  const stopExam = () => {
    setEndExamModal(false);
    onEndExam();
  };

  useEffect(() => {
    if (!isPaused) startTimer();
    return () => {
      clearTimerInterval();
      clearColorInterval();
    };
  }, [isPaused, startTimer]);

  const progress = ((examTime - timeRemaining) / examTime) * 100;

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

  const flaggedQuestionsArr: FlaggedQuestionType[] = examAnswers
    .map((examAnswer, i) => (examAnswer.isFlagged ? i : -1))
    .filter((i) => i !== -1)
    .map((e) => ({ ...questions[e], queIndex: e }));

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-[10px] border-2 ${borderColor}`}
    >
      {/* Header */}
      <header className="grid gap-2 bg-gray-200 p-4">
        <div className="flex justify-between">
          <div>
            <p className={`flex ${timerColor}`}>
              <ClockIcon className="size-6" /> {t("remainingTime")}{" "}
              {formatTime(timeRemaining)}
            </p>
            <p className="ps-6">
              {t("question")} {currentQuestionIndex + 1} {t("of")}{" "}
              {questions?.length}
            </p>
          </div>
          <div>
            <Popover content={<DrawingBoardContainer />} placement="top">
              <Button>
                <PencilSquareIcon className="size-5" />
                {t("board")}
              </Button>
            </Popover>
          </div>
          <div id="calc-parent">
            <Popover content={<Calculator />} placement="top">
              <Button>
                <CalculatorIcon className="size-5" />
                {t("calculator")}
              </Button>
            </Popover>
          </div>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-start-1 col-end-3 flex">
            <span
              className="flex cursor-pointer gap-1 text-gray-700"
              onClick={() => dispatch(setIsFlagged(currentQuestionIndex))}
            >
              {examAnswers[currentQuestionIndex]?.isFlagged ? (
                <>
                  <FlagIconSolid className="size-5 fill-red-700" />
                  <span className="text-red-700">{t("unFlagQue")}</span>
                </>
              ) : (
                <>
                  <FlagIconOutline className="size-5 text-gray-700" />
                  <span>{t("flagQue")}</span>
                </>
              )}
            </span>
          </div>
          <div className="col-start-4 col-end-10">
            <Progress
              progress={progress}
              color="indigo"
              className="mt-2 h-auto border-2 border-blue-400"
            />
          </div>
          <div className="col-start-11 col-end-13 flex justify-around">
            <span
              onClick={isPaused ? resumeTimer : pauseTimer}
              color="gray"
              className={`mr-2 size-8 ${!timeRemaining ? "pointer-events-none opacity-50" : ""}`}
            >
              {isPaused ? (
                <PlayIcon className="size-8 cursor-pointer" />
              ) : (
                <PauseIcon className="size-8 cursor-pointer" />
              )}
            </span>
            <span
              onClick={() => {
                setEndExamModal(true);
              }}
              color="red"
              className={`size-8`}
            >
              <StopIcon className="size-8 cursor-pointer" />
            </span>
          </div>
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
        {currentQuestionIndex === questions?.length - 1 ? (
          <Button
            onClick={() => {
              setEndExamModal(true);
            }}
            color="red"
          >
            {t("endExam")}
          </Button>
        ) : (
          <Button onClick={goToNextQuestion} color="green">
            {t("next")}
          </Button>
        )}
      </footer>
      <Modal
        show={endExamModal}
        size="md"
        onClose={() => setEndExamModal(false)}
      >
        <Modal.Header>{t("description")}</Modal.Header>
        <Modal.Body>
          <div className="flex justify-around">
            <Button className="bg-red-700" onClick={stopExam}>
              End
            </Button>
            <Button
              className=""
              onClick={() => {
                setEndExamModal(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
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
          <Table striped className="text-center">
            <TableHead>
              <TableHeadCell>Que num</TableHeadCell>
              <TableHeadCell>Question</TableHeadCell>
            </TableHead>
            <TableBody>
              {flaggedQuestionsArr.map(({ queIndex, name }) => (
                <TableRow
                  onClick={() => {
                    setCurrentQuestionIndex(queIndex);
                    setFlagsModal(false);
                  }}
                  className="hover:cursor-pointer hover:text-indigo-900 hover:underline"
                >
                  <TableCell>{queIndex + 1}</TableCell>
                  <TableCell>{name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Modal.Body>
      </Modal>
      <Modal
        show={allQuestionsModal}
        size="md"
        onClose={() => setAllQuestionsModal(false)}
      >
        <Modal.Header>{t("allQuestions")}</Modal.Header>
        <Modal.Body>
          <Table striped className="text-center">
            <TableHead>
              <TableHeadCell>Que num</TableHeadCell>
              <TableHeadCell>Question</TableHeadCell>
            </TableHead>
            <TableBody>
              {questions.map(({ name }, queIndex) => (
                <TableRow
                  onClick={() => {
                    setCurrentQuestionIndex(queIndex);
                    setAllQuestionsModal(false);
                  }}
                  className="hover:cursor-pointer hover:text-indigo-900 hover:underline"
                >
                  <TableCell>{queIndex + 1}</TableCell>
                  <TableCell>{name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
}

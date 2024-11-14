import { useEffect, useRef, useState } from "react";
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
  onEndExam
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
    setEndExamModal(false);
    onEndExam();
  };

  useEffect(() => {
    if (!isPaused) startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

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
          <Progress progress={progress} color="indigo" className="mt-2 border-2 border-blue-400" />
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
          <span onClick={()=> {setEndExamModal(true)}} color="red">
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
        {currentQuestionIndex === questions?.length - 1?
        <Button
          onClick={()=> {setEndExamModal(true)}}
          color="red"
        >
          {t("endExam")}
        </Button>:
        <Button
          onClick={goToNextQuestion}
          color="green"
        >
          {t("next")}
        </Button>}
        
      </footer>
      <Modal show={endExamModal} size="md" onClose={() => setEndExamModal(false)}>
        <Modal.Header>{t("description")}</Modal.Header>
        <Modal.Body>
          <div className="flex justify-around">
            <Button className="bg-red-700" onClick={stopExam}>End</Button>
            <Button className="" onClick={()=> {setEndExamModal(false)}}>Cancel</Button>
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

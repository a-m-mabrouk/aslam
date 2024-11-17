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
  Tooltip,
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
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Question from "./question";
import { useAppDispatch, useAppSelector } from "../../../../../../../../store";
import {
  setIsFlagged,
  setShowAnsClicked,
} from "../../../../../../../../store/reducers/exams";
import { useTranslation } from "react-i18next";
import Calculator from "../../../../../../../../components/calculator";
import { FullScreenButton } from "..";
import useGetLang from "../../../../../../../../hooks/useGetLang";

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
function isFlaggedQuestion(que: Question): que is FlaggedQuestionType {
  return (que as FlaggedQuestionType).queIndex !== undefined;
}
function PopoverQuestionsTable({ onChooseQue, ques }: { onChooseQue: (queIndex: number) => void; ques: FlaggedQuestionType[] | Question[] }) {
  return (
    <div className="max-h-[80vh] w-[50rem] max-w-[90vw] overflow-y-auto">
      <Table striped className="text-center">
        <TableHead>
          <TableHeadCell>Que num</TableHeadCell>
          <TableHeadCell className="max-w-96">Question</TableHeadCell>
        </TableHead>
        <TableBody>
          {ques.map((que, i) => {
            let index = i;
            if (isFlaggedQuestion(que)) {
              index = que.queIndex;
            }
            return (
              <TableRow
                key={index}
                onClick={() => onChooseQue(index)}
                className="hover:cursor-pointer hover:text-indigo-900 hover:underline"
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell className="max-w-96">{que?.question?.name}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function DescriptionBox({ desc }: { desc: string }) {
  const { t } = useTranslation("exams")
  return (
    <div className="max-h-[80vh] w-96 max-w-[90vw] overflow-y-auto p-8">
      <h2 className="text-green-900">{t("description")}</h2>
      <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        {desc}
      </p>
    </div>
  )
}

export default function ExamInterface({
  questions,
  examTime,
  onEndExam,
  onFullscreen
}: {
  questions: Question[];
  examTime: number;
  onEndExam: () => void;
  onFullscreen: () => void;
}) {
  const { lang } = useGetLang()
  const { t } = useTranslation("exams");
  const dispatch = useAppDispatch();
  const examAnswers = useAppSelector(({ exams }) => exams.examAnswers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(examTime);
  const [isPaused, setIsPaused] = useState(false);
  const [endExamModal, setEndExamModal] = useState(false);
  const [borderColor, setBorderColor] = useState<string>("border-gray-300");
  const [timerColor, setTimerColor] = useState<string>("");
  const timerIntervalRef = useRef<number | null>(null);
  const overIntervalRef = useRef<number | null>(null);
  const handleChooseQue = (queIndex: number) => {
    setCurrentQuestionIndex(queIndex);
  }

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
      className={`grid h-full grid-rows-[auto_1fr_auto] overflow-auto rounded-[10px] border-2 ${borderColor}`}
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
      <footer className="flex min-h-fit w-full grow items-center justify-between overflow-x-auto bg-gray-200 p-4">
        <Tooltip content={t("viewAllQuestions")}>
          <Popover content={<PopoverQuestionsTable onChooseQue={handleChooseQue} ques={questions} />} placement="top">
            <Button className="bg-indigo-600 text-white">
              <ListBulletIcon className="size-5" />
            </Button>
          </Popover>
        </Tooltip>

        <Tooltip content={t("prev")}>
          <Button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0} color="green">
            {lang === "en" ? <ChevronLeftIcon className="size-5" /> : < ChevronRightIcon className="size-5" />}
          </Button>
        </Tooltip>
        
        <Tooltip content={t("correctAnswer")}>
          {
            questions[currentQuestionIndex]?.question?.description ?
              <Popover content={<DescriptionBox desc={questions[currentQuestionIndex]?.question?.description} />} placement="top">
                <EyeIcon className="size-12 cursor-pointer border-2" onClick={showAns} />
              </Popover>
              :
              <EyeIcon className="size-12 cursor-pointer border-2" onClick={showAns} />
          }
        </Tooltip>

        <Tooltip content={t("flaggedQuestions")}>
          <Popover content={<PopoverQuestionsTable onChooseQue={handleChooseQue} ques={flaggedQuestionsArr} />} placement="top">
            <Button className="bg-red-600 text-white hover:bg-red-700" disabled={!flaggedQuestionsArr.length}>
              <FlagIconOutline className="size-5" />
            </Button>
          </Popover>
        </Tooltip>
        
        {currentQuestionIndex === questions?.length - 1 ? (
          <Tooltip content={t("endExam")}>
            <Button onClick={() => setEndExamModal(true)} color="green">
              {lang === "ar" ? <ChevronLeftIcon className="size-5" /> : < ChevronRightIcon className="size-5" />}
            </Button>
          </Tooltip>
        ) : (
          <Tooltip content={t("next")}>
            <Button onClick={goToNextQuestion} color="green">
              {lang === "ar" ? <ChevronLeftIcon className="size-5" /> : < ChevronRightIcon className="size-5" />}
            </Button>
          </Tooltip>
        )}
        <FullScreenButton onFullscreen={onFullscreen} />
      </footer>
      <Modal
        show={endExamModal}
        size="md"
        onClose={() => setEndExamModal(false)}
      >
        <Modal.Header>{t("endExamAssertion")}</Modal.Header>
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
    </div>
  );
}

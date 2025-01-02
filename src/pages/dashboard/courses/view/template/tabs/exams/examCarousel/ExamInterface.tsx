import {
  type SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  Progress,
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
  ArrowLeftEndOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Question from "./question";
import { useAppDispatch, useAppSelector } from "../../../../../../../../store";
import {
  setAssessmentDetails,
  setIsFlagged,
  setIsPaused,
  setShowAnsClicked,
} from "../../../../../../../../store/reducers/exams";
import { useTranslation } from "react-i18next";
import Calculator from "../../../../../../../../components/calculator";
import { FullScreenButton } from "..";
import useGetLang from "../../../../../../../../hooks/useGetLang";
import CanvasDraw from "react-canvas-draw";
import DraggablePopup from "../../../../../../../../components/draggablePopover";
import { updateItem } from "../../../../../../../../utilities/idb";

type FlaggedQuestionType = Question & { queIndex: number };

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<CanvasDraw | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-[80vh] w-[80vw] flex-col items-center rounded-lg bg-gray-100 shadow-md"
    >
      <CanvasDraw
        ref={canvasRef}
        canvasWidth={dimensions.width}
        canvasHeight={dimensions.height}
        brushColor="#000"
        brushRadius={2}
        className="rounded-lg border border-gray-300"
      />
      <div className="mt-4 flex space-x-2">
        <Button onClick={() => canvasRef.current?.clear()}>Clear</Button>
        <Button onClick={() => canvasRef.current?.undo()}>Undo</Button>
      </div>
    </div>
  );
};

function isFlaggedQuestion(que: Question): que is FlaggedQuestionType {
  return (que as FlaggedQuestionType).queIndex !== undefined;
}
function PopoverQuestionsTable({
  onChooseQue,
  ques,
}: {
  onChooseQue: (queIndex: number) => void;
  ques: FlaggedQuestionType[] | Question[];
}) {
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
                <TableCell className="max-w-96">
                  {que?.question?.name.split("<<0>>")[0]}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ExamInterface({
  questions,
  examTime,
  onEndExam,
  onFullscreen,
}: {
  questions: Question[];
  examTime: number;
  onEndExam: (assessment_id: number) => void;
  onFullscreen: () => void;
}) {
  const { lang } = useGetLang();
  const { t } = useTranslation("exams");
  const dispatch = useAppDispatch();
  const {
    examAnswers,
    isPaused,
    activeAssessment,
    assessmentDetails,
  } = useAppSelector(({ exams }) => exams);
  const timeRemainingRef = useRef(assessmentDetails.examTimeRemaining);
  const [borderColor, setBorderColor] = useState<string>("border-gray-300");
  const [timerColor, setTimerColor] = useState<string>("");
  const timerIntervalRef = useRef<number | null>(null);
  const overIntervalRef = useRef<number | null>(null);

  const handleChooseQue = (queIndex: number) => {
    dispatch(
      setAssessmentDetails({
        activeAssessQuestionIndex: queIndex,
      }),
    );
    
    activeAssessment && updateItem(activeAssessment?.id, { activeAssessQuestionIndex: 0 });

    closeFlagQuestionsPopupOpen();
    const fakeEvent = { stopPropagation: () => {} } as SyntheticEvent;
    closeAllQuestionsPopupOpen(fakeEvent);
  };

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
      if (activeAssessment?.id) {
        dispatch(
          setAssessmentDetails({
            examTimeRemaining: assessmentDetails.examTimeRemaining > 0 ? assessmentDetails.examTimeRemaining - 1 : 0,
          }),
        );
        updateItem(activeAssessment?.id, {examTimeRemaining: assessmentDetails.examTimeRemaining})
      }
      assessmentDetails.examTimeRemaining === 0 && startTimeoutAnimation();
    }, 1000);
  }, [activeAssessment?.id, assessmentDetails.examTimeRemaining, startTimeoutAnimation, dispatch]);

  useEffect(() => {
    timeRemainingRef.current = assessmentDetails.examTimeRemaining;
  }, [assessmentDetails.examTimeRemaining]);

  useEffect(() => {
    if (timeRemainingRef.current === 0) {
      startTimeoutAnimation();
      dispatch(setIsPaused(true));
    }
  }, [dispatch, startTimeoutAnimation]);

  const pauseTimer = () => {
    dispatch(setIsPaused(true));
    clearTimerInterval();
    clearColorInterval();
  };

  const resumeTimer = () => {
    dispatch(setIsPaused(false));
    startTimer();
  };

  const stopExam = () => {
    closeEndExamPopupOpen();
    activeAssessment && onEndExam(activeAssessment?.id);
  };

  useEffect(() => {
    if (!isPaused) startTimer();
    return () => {
      clearTimerInterval();
      clearColorInterval();
    };
  }, [isPaused, startTimer]);

  const progress = ((examTime - assessmentDetails.examTimeRemaining) / examTime) * 100;

  const goToNextQuestion = useCallback(() => {
    if (assessmentDetails.activeAssessQuestionIndex < questions?.length - 1) {
      dispatch(
        setAssessmentDetails({
          activeAssessQuestionIndex: assessmentDetails.activeAssessQuestionIndex + 1,
        }),
      );
    }
    activeAssessment && updateItem(activeAssessment?.id, { activeAssessQuestionIndex: assessmentDetails.activeAssessQuestionIndex + 1 });
  }, [activeAssessment, assessmentDetails.activeAssessQuestionIndex, dispatch, questions?.length]);

  const goToPreviousQuestion = useCallback(() => {
    if (assessmentDetails.activeAssessQuestionIndex > 0) {
      dispatch(
        setAssessmentDetails({
          activeAssessQuestionIndex: assessmentDetails.activeAssessQuestionIndex - 1,
        }),
      );
      activeAssessment && updateItem(activeAssessment?.id, { activeAssessQuestionIndex: assessmentDetails.activeAssessQuestionIndex - 1 });
    }
  }, [activeAssessment, assessmentDetails.activeAssessQuestionIndex, dispatch]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        if (lang === "en") {
          goToNextQuestion();
        } else {
          goToPreviousQuestion();
        }
      } else if (event.key === "ArrowLeft") {
        if (lang === "en") {
          goToPreviousQuestion();
        } else {
          goToNextQuestion();
        }
      }
    },
    [goToNextQuestion, goToPreviousQuestion, lang],
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
  const showAns = () => {
    if (activeAssessment?.id) {
      dispatch(
        setShowAnsClicked({
          assessment_id: activeAssessment.id,
          ansIndex: assessmentDetails.activeAssessQuestionIndex,
        }),
      );
    }
  };
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;

    // const mins = Math.floor(seconds / 60);
    // const secs = seconds % 60;
    // return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const flaggedQuestionsArr: FlaggedQuestionType[] = examAnswers
    .map((examAnswer, i) => (examAnswer.isFlagged ? i : -1))
    .filter((i) => i !== -1)
    .map((e) => ({ ...questions[e], queIndex: e }));

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEndExamPopupOpen, setIsEndExamPopupOpen] = useState(false);
  const [isFlagQuestionsPopupOpen, setIsFlagQuestionsPopupOpen] =
    useState(false);
  const [isAllQuestionsPopupOpen, setIsAllQuestionsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);
  const openEndExamPopupOpen = () => setIsEndExamPopupOpen(true);
  const openFlagQuestionsPopupOpen = () => setIsFlagQuestionsPopupOpen(true);
  const openAllQuestionsPopupOpen = () => setIsAllQuestionsPopupOpen(true);
  const closeEndExamPopupOpen = () => setIsEndExamPopupOpen(false);
  const closeFlagQuestionsPopupOpen = () => setIsFlagQuestionsPopupOpen(false);
  const closeAllQuestionsPopupOpen = (event: SyntheticEvent) => {
    event.stopPropagation();
    setIsAllQuestionsPopupOpen(false);
  };

  return (
    <div
      className={`grid h-full overflow-auto rounded-[10px] border-2 ${borderColor} relative`}
    >
      <div
        className={`absolute z-0 grid size-full place-content-center gap-5 bg-violet-50 ${isPaused ? "" : "hidden"}`}
      >
        <Button onClick={resumeTimer} className="mr-2 flex items-center">
          <PlayIcon className="size-8 cursor-pointer" />
          <span className="flex items-center">
            {lang === "en" ? "Resume exam!" : "استئناف الامتحان!"}
          </span>
        </Button>
        <div className="flex flex-col items-center gap-2 text-xl">
          <span className="text-blue-600">
            {lang === "ar" ? "الوقت المتبقي:" : "Remaining time:"}
          </span>
          <span>{formatTime(assessmentDetails.examTimeRemaining)}</span>
        </div>
      </div>
      <div
        className={`grid h-full grid-rows-[auto_1fr_auto] ${isPaused ? "invisible" : ""}`}
      >
        {/* Header */}
        <header className="grid gap-2 bg-gray-200 p-4">
          <div className="flex justify-between">
            <div>
              <p className={`flex ${timerColor}`}>
                <ClockIcon className="size-6" /> {t("remainingTime")}{" "}
                {formatTime(assessmentDetails.examTimeRemaining)}
              </p>
              <p className="ps-6">
                {t("question")} {assessmentDetails.activeAssessQuestionIndex + 1} {t("of")}{" "}
                {questions?.length}
              </p>
            </div>
            <div>
              <Popover content={<Whiteboard />} placement="top">
                <Button>
                  <PencilSquareIcon className="size-5" />
                  <span className="hidden lg:inline">{t("board")}</span>
                </Button>
              </Popover>
            </div>
            <div id="calc-parent">
              <Popover content={<Calculator />} placement="top">
                <Button>
                  <CalculatorIcon className="size-5" />
                  <span className="hidden lg:inline">{t("calculator")}</span>
                </Button>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-start-1 col-end-3 flex">
              <span
                className="flex cursor-pointer gap-1 text-gray-700"
                onClick={() => {
                  activeAssessment?.id &&
                    dispatch(
                      setIsFlagged({
                        assessment_id: activeAssessment?.id,
                        ansIndex: assessmentDetails.activeAssessQuestionIndex,
                      }),
                    );
                }}
              >
                {examAnswers[assessmentDetails.activeAssessQuestionIndex]?.isFlagged ? (
                  <>
                    <FlagIconSolid className="size-5 fill-red-700" />
                    <span className="hidden text-red-700 lg:inline">{t("unFlagQue")}</span>
                  </>
                ) : (
                  <>
                    <FlagIconOutline className="size-5 text-gray-700" />
                    {/* <span>{t("flagQue")}</span> */}
                    <span className="hidden lg:inline">{t("flagQue")}</span>
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
                className={`mr-2 size-8 ${!assessmentDetails.examTimeRemaining ? "pointer-events-none opacity-50" : ""}`}
              >
                {isPaused ? (
                  <PlayIcon className="size-8 cursor-pointer" />
                ) : (
                  <PauseIcon className="size-8 cursor-pointer" />
                )}
              </span>
              <span
                onClick={openEndExamPopupOpen}
                title={t("endExam")}
                className={`size-8`}
              >
                <StopIcon className="size-8 cursor-pointer" />
              </span>
            </div>
          </div>
        </header>

        {/* Question Content */}
        <Question
          question={questions[assessmentDetails.activeAssessQuestionIndex]}
          questionIndex={assessmentDetails.activeAssessQuestionIndex}
          isDescShow={isPopupOpen}
        />

        {/* Footer */}
        <footer className="flex min-h-fit w-full grow items-center justify-between overflow-x-auto bg-gray-200 p-4">
          <Tooltip content={t("viewAllQuestions")}>
            {isAllQuestionsPopupOpen ? (
              <div
                className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-black/20"
                onClick={closeAllQuestionsPopupOpen}
              >
                <div
                  className="relative z-50 overflow-hidden rounded-xl bg-white shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between bg-gray-300">
                    <XMarkIcon
                      className="size-10 cursor-pointer px-2 py-1"
                      onClick={closeAllQuestionsPopupOpen}
                    />
                    <h2>{t("viewAllQuestions")}</h2>
                    <XMarkIcon className="invisible size-10 px-2 py-1" />
                  </div>
                  <div className="bg-white">
                    <PopoverQuestionsTable
                      onChooseQue={handleChooseQue}
                      ques={questions}
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <Button
              className="bg-indigo-600 text-white"
              onClick={openAllQuestionsPopupOpen}
            >
              <ListBulletIcon className="size-5" />
              <span className="hidden lg:inline">{t("viewAllQuestions")}</span>
            </Button>
          </Tooltip>

          <Tooltip
            content={t("prev")}
            className={`${assessmentDetails.activeAssessQuestionIndex === 0 ? "invisible" : ""}`}
          >
            <Button
              className={`${assessmentDetails.activeAssessQuestionIndex === 0 ? "invisible" : ""}`}
              onClick={goToPreviousQuestion}
              disabled={assessmentDetails.activeAssessQuestionIndex === 0}
              color="green"
            >
              {lang === "en" ? (
                <ChevronLeftIcon
                  className={`${assessmentDetails.activeAssessQuestionIndex === 0 ? "invisible" : ""} size-5`}
                />
              ) : (
                <ChevronRightIcon
                  className={`${assessmentDetails.activeAssessQuestionIndex === 0 ? "invisible" : ""} size-5`}
                />
              )}
              <span className="hidden lg:inline">{t("prev")}</span>
            </Button>
          </Tooltip>

          <Tooltip content={t("correctAnswer")}>
            {questions[assessmentDetails.activeAssessQuestionIndex]?.question?.description ? (
              <>
                <EyeIcon
                  className="size-12 cursor-pointer border-2"
                  onClick={() => {
                    showAns();
                    openPopup();
                  }}
                />
                <DraggablePopup
                  isOpen={isPopupOpen}
                  onClose={closePopup}
                  title={t("description")}
                >
                  <div className="max-h-[80vh] w-96 max-w-[90vw] overflow-y-auto p-4">
                    <p className="text-base leading-relaxed text-gray-500">
                      {questions[assessmentDetails.activeAssessQuestionIndex]?.question?.description}
                    </p>
                  </div>
                </DraggablePopup>
              </>
            ) : (
              <EyeIcon
                className="size-12 cursor-pointer border-2"
                onClick={showAns}
              />
            )}
          </Tooltip>

          <Tooltip content={t("flaggedQuestions")}>
            {isFlagQuestionsPopupOpen ? (
              <div
                className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-black/20"
                onClick={closeFlagQuestionsPopupOpen}
              >
                <div
                  className="relative z-50 overflow-hidden rounded-xl bg-white shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between bg-gray-300">
                    <XMarkIcon
                      className="size-10 cursor-pointer px-2 py-1"
                      onClick={closeFlagQuestionsPopupOpen}
                    />
                    <h2>{t("flaggedQuestions")}</h2>
                    <XMarkIcon className="invisible size-10 px-2 py-1" />
                  </div>
                  <div className="bg-white">
                    <PopoverQuestionsTable
                      onChooseQue={handleChooseQue}
                      ques={flaggedQuestionsArr}
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={!flaggedQuestionsArr.length}
              onClick={openFlagQuestionsPopupOpen}
            >
              <FlagIconOutline className="size-5" />
              <span className="hidden lg:inline">{t("flaggedQuestions")}</span>
            </Button>
          </Tooltip>

          {assessmentDetails.activeAssessQuestionIndex === questions?.length - 1 ? (
            <Tooltip content={t("endExam")}>
              <Button onClick={openEndExamPopupOpen} color="green">
                {lang === "ar" ? (
                  <ArrowLeftEndOnRectangleIcon className="size-5" />
                ) : (
                  <ChevronRightIcon className="size-5" />
                )}
              </Button>
            </Tooltip>
          ) : (
            <Tooltip content={t("next")}>
              <Button onClick={goToNextQuestion} color="green">
                <span className="hidden lg:inline">{t("next")}</span>
                {lang === "ar" ? (
                  <ChevronLeftIcon className="size-5" />
                ) : (
                  <ChevronRightIcon className="size-5" />
                )}
              </Button>
            </Tooltip>
          )}
          <FullScreenButton onFullscreen={onFullscreen} />
        </footer>
        {isEndExamPopupOpen ? (
          <div className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-black/20">
            <div className="relative z-50 overflow-hidden rounded-xl bg-white shadow-lg">
              <div className="flex justify-between bg-gray-300">
                <XMarkIcon
                  className="size-10 cursor-pointer px-2 py-1"
                  onClick={closeEndExamPopupOpen}
                />
                {/* <XMarkIcon className="invisible size-10 px-2 py-1" /> */}
              </div>
              <div className="bg-white p-7 pb-0">
                <h2 className="flex items-center text-xl">
                  {t("endExamAssertion")}
                </h2>
                <Button className="mx-auto my-4 bg-red-700" onClick={stopExam}>
                  {lang === "en" ? "End exam" : "إنهاء الامتحان"}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

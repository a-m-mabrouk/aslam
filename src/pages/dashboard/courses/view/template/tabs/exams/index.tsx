import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../../store";
import {
  resetExam,
  setAnswer,
  setExamQuestions,
  setReview,
} from "../../../../../../../store/reducers/exams";
import ExamInterface from "./examCarousel/ExamInterface";
import ExamDetails from "./examCarousel/ExamDetails";
import ExamResult from "./examCarousel/examResult";
import UploadQuestions from "./uploadQuestions";
import TitleSection from "../../../../../../../components/title";
import { useTranslation } from "react-i18next";
import ExamsSidebar from "./ExamsSidebar";

export function FullScreenButton({onFullscreen}: {onFullscreen: () => void}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div id="btn-fullscreen" className="size-11 cursor-pointer hover:bg-gray-600 hover:fill-white"
            onClick={onFullscreen}
          >
            {isFullscreen ? <svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"></path></svg> : <svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7zm-2-4h2V7h3V5H5zm12 7h-3v2h5v-5h-2zM14 5v2h3v3h2V5z"></path></svg>}
          </div>
  )
}

const ExamComponent = () => {
  const fullscreenDivRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { assessmentId, examQuestions: questions } = useAppSelector(
    ({ exams }) => exams
  );
  const isTeacher = useAppSelector(
    ({ auth }) => auth.role
  ) === "teacher";
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamEnded, setIsExamEnded] = useState(false);
  
  const examTime = Math.round(questions.length * 1.33333 * 60);
  const { t } = useTranslation("exams");

  const toggleFullscreen = () => {
    const element: any = fullscreenDivRef.current;
    const doc: any = document;
    if (element) {
      if (!doc.fullscreenElement) {
        // Enter fullscreen
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (doc.exitFullscreen) {
          doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        }
      }
    }
  };

  

  const onStart = () => {
    setIsExamStarted(true);
    dispatch(resetExam());
    questions.forEach((q, questionIndex) =>
      dispatch(
        setAnswer({
          questionIndex,
          queAnsDetails: {
            selectedOpt: "",
            showAnsClicked: false,
            isFlagged: false,
            chapter: q.chapter || "",
            domain: q.domain || "",
            answerstate: "skipped",
          },
        })
      )
    );
  };

  const handleEndExam = () => {
    setIsExamEnded(true);
    dispatch(setReview(true));
  };

  const handleSetQuestions = useCallback(
    (ques: Question[]) => {
      dispatch(setExamQuestions(ques));
    },
    [dispatch]
  );

  return (
    <div className="grid gap-4">
      <TitleSection title={t("exams")} />
      <div className="grid gap-3 md:flex md:flex-row-reverse">
        <ExamsSidebar />
        <div className="grow bg-white" ref={fullscreenDivRef}>
          

          {!assessmentId ? (
            t("noAssessments")
          ) : !questions.length ? (
            <>
              <h4 className="mx-auto">{t("noQuestions")}</h4>
              {isTeacher? <UploadQuestions onAddQuestions={handleSetQuestions} /> : ""}
            </>
          ) : isExamEnded ? (
            <ExamResult />
          ) : isExamStarted ? (
            <ExamInterface
              questions={questions}
              examTime={examTime}
              onEndExam={handleEndExam}
              onFullscreen={toggleFullscreen}
            />
          ) : (
            <ExamDetails
              questions={questions}
              examTime={examTime}
              onStart={onStart}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamComponent;

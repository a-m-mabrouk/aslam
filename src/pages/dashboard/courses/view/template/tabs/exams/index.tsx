import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../../store";
import {
  resetExam,
  setAnswer,
  setReview,
} from "../../../../../../../store/reducers/exams";
import ExamInterface from "./examCarousel/ExamInterface";
import ExamDetails from "./examCarousel/ExamDetails";
import ExamResult from "./examCarousel/examResult";
import UploadQuestions from "./uploadQuestions";
import TitleSection from "../../../../../../../components/title";
import { useTranslation } from "react-i18next";
import ExamsSidebar from "./ExamsSidebar";
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import useGetLang from "../../../../../../../hooks/useGetLang";

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
    <div id="btn-fullscreen" className="flex size-9 cursor-pointer items-center justify-center"
            onClick={onFullscreen}
          >
            {isFullscreen ? <ArrowsPointingInIcon className="size-9 hover:size-8" /> : <ArrowsPointingOutIcon className="size-8 hover:size-9" />}
          </div>
  )
}

const ExamComponent = () => {
  const fullscreenDivRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { assessmentId, examQuestions: questions, assessmentName } = useAppSelector(
    ({ exams }) => exams
  );
  const { lang } = useGetLang();
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
    questions.forEach(({question}, questionIndex) =>
      dispatch(
        setAnswer({
          questionIndex,
          queAnsDetails: {
            selectedOpt: "",
            showAnsClicked: false,
            isFlagged: false,
            chapter: question?.chapter || "",
            domain: question?.domain || "",
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

  return (
    <div className="grid gap-4">
      <TitleSection title={t("exams")} />
      <div className="grid gap-3 md:flex md:flex-row-reverse">
        <ExamsSidebar />
        <div className="grow bg-white" ref={fullscreenDivRef}>
          

          {!assessmentId ? (
            t("noAssessments")
          ) : <>
          <h2 className="py-4 text-center text-indigo-800">{lang === "en"? assessmentName?.en : assessmentName?.ar}</h2>
          {!questions.length ? (
            <>
              <h4 className="mx-auto">{t("noQuestions")}</h4>
              {/* {isTeacher? <UploadQuestions onAddQuestions={handleSetQuestions} /> : ""} */}
              {isTeacher? <UploadQuestions /> : ""}
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
          </>}
        </div>
      </div>
    </div>
  );
};

export default ExamComponent;

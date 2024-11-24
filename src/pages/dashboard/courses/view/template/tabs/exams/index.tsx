import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../../store";
import {
  resetExam,
  setActiveAssessment,
  setAnswer,
  setExamTimeRemaining,
  setIsAssessmentRunning,
  setIsPaused,
  setReview,
} from "../../../../../../../store/reducers/exams";
import ExamInterface from "./examCarousel/ExamInterface";
import ExamDetails from "./examCarousel/ExamDetails";
import ExamResult from "./examCarousel/examResult";
import UploadQuestions from "./uploadQuestions";
import TitleSection from "../../../../../../../components/title";
import { useTranslation } from "react-i18next";
import ExamsSidebar from "./ExamsSidebar";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
import useGetLang from "../../../../../../../hooks/useGetLang";
// import axiosDefault from "../../../../../../../utilities/axios";
// import { API_EXAMS } from "../../../../../../../router/routes/apiRoutes";
// import withReactContent from "sweetalert2-react-content";
// import Swal from "sweetalert2";

export function FullScreenButton({
  onFullscreen,
}: {
  onFullscreen: () => void;
}) {
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
    <div
      id="btn-fullscreen"
      className="flex size-9 cursor-pointer items-center justify-center"
      onClick={onFullscreen}
    >
      {isFullscreen ? (
        <ArrowsPointingInIcon className="size-9 hover:size-8" />
      ) : (
        <ArrowsPointingOutIcon className="size-8 hover:size-9" />
      )}
    </div>
  );
}
declare global {
  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void> | void;
    msRequestFullscreen?: () => Promise<void> | void;
  }

  interface Document {
    webkitExitFullscreen?: () => Promise<void> | void;
    msExitFullscreen?: () => Promise<void> | void;
  }
}

const ExamComponent = () => {
  const fullscreenDivRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { activeAssessment, isAssessmentRunning } = useAppSelector(({ exams }) => exams);
  const { questions, name: assessmentName } = activeAssessment ? activeAssessment : { questions: [], name: null };

  const { lang } = useGetLang();
  const isTeacher = useAppSelector(({ auth }) => auth.role) === "teacher";
  const [isExamEnded, setIsExamEnded] = useState(false);

  const questionTimeRatio = 1.2778;
  const examTime = Math.round(questions?.length * questionTimeRatio * 60);
  const { t } = useTranslation("exams");
  // const { t: tAlert } = useTranslation("alerts");
  // const { t: tBtns } = useTranslation("buttons");

  const toggleFullscreen = () => {
    const element = fullscreenDivRef.current;
    if (element) {
      if (!document.fullscreenElement) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
  };
  const handleSelectAssessment = (assessment: AssessmentType) => {
    setIsExamEnded(false);
    dispatch(setActiveAssessment(assessment));
  };
  // const handleDeleteQuestion = async () => {
  //   const { id, course_id } = activeAssessment!;
  //   console.log(activeAssessment);
    
  //   withReactContent(Swal).fire({
  //     title: tAlert("deleteQuestions"),
  //     preConfirm: async () => {
  //       try {
  //         const response = await axiosDefault.post(
  //           `${API_EXAMS.assessments}/${id}`, { _method: "put", course_id, questions: [] },
  //         );
  //         console.log(response);
  //         dispatch(setActiveAssessment(null));
  //       } catch (error) {
  //         throw new Error("");
  //       }
  //     },
  //     confirmButtonText: tBtns("confirm"),
  //     icon: "warning",
  //     denyButtonText: tBtns("cancel"),
  //     showDenyButton: true,
  //     showLoaderOnConfirm: true,
  //   });
    
  // };
  const onStart = () => {
    dispatch(setIsAssessmentRunning(true));
    dispatch(resetExam());
    dispatch(setIsPaused(false));
    dispatch(setExamTimeRemaining(examTime));
    questions.forEach(({ question }, questionIndex) =>
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
        }),
      ),
    );
  };

  const handleEndExam = () => {
    setIsExamEnded(true);
    dispatch(setIsAssessmentRunning(false));
    dispatch(setReview(true));
    dispatch(setIsPaused(false));
  };

  return (
    <div className="grid gap-4">
      <TitleSection title={t("exams")} />
      <div className="grid gap-3 md:flex md:flex-row-reverse">
        <ExamsSidebar onSelectAssessment={handleSelectAssessment} />
        <div className="grow">
          {!activeAssessment ? undefined : (
            <h2 className="py-4 text-center text-2xl text-indigo-800">
              {lang === "en" ? assessmentName?.en : assessmentName?.ar}
            </h2>
          )}
          <div className="bg-white" ref={fullscreenDivRef}>
            {!activeAssessment ? (
              t("noAssessments")
            ) : (
              <>
                {!questions.length ? (
                  <>
                    <h4 className="mx-auto">{t("noQuestions")}</h4>
                    {isTeacher ? <UploadQuestions /> : ""}
                  </>
                ) : isExamEnded ? (
                  <ExamResult />
                ) : isAssessmentRunning ? (
                  <ExamInterface
                    questions={questions}
                    examTime={examTime}
                    onEndExam={handleEndExam}
                    onFullscreen={toggleFullscreen}
                  />
                ) : (
                  <>
                    {/* {isTeacher ? (
                      <Button onClick={handleDeleteQuestion}>
                        <TrashIcon className="size-5" />
                      </Button>
                    ) : null} */}
                    <ExamDetails
                      questions={questions}
                      examTime={examTime}
                      onStart={onStart}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamComponent;

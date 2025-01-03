import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../../store";
import {
  resetExam,
  setActiveAssessment,
  setIsPaused,
  setAssessmentDetails,
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
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import useGetLang from "../../../../../../../hooks/useGetLang";
import axiosDefault from "../../../../../../../utilities/axios";
import { API_EXAMS } from "../../../../../../../router/routes/apiRoutes";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { Button } from "flowbite-react";
import { useParams } from "react-router";
import { fetchDomains } from "../../../../../../../store/reducers/examsDomains";
import { getItemById, updateItem } from "../../../../../../../utilities/idb";
import { shuffle } from "../../../../../../../utilities/shuffleArray";
import {
  zeroOneToFalseTrue,
} from "../../../../../../../utilities/zeroOneToFalseTrue";

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
  const { activeAssessment, assessmentDetails } = useAppSelector(
    ({ exams }) => exams,
  );
  const { questions, name: assessmentName } = activeAssessment
    ? activeAssessment
    : { questions: [], name: null };
  const { id } = useParams();
  const course_id = Number(id);

  const { lang } = useGetLang();
  const { role, id: student_id } = useAppSelector(({ auth }) => auth);
  const isTeacher = role === "teacher";

  const questionTimeRatio = 1.2778;
  const examTime = Math.round(questions?.length * questionTimeRatio * 60);
  const { t } = useTranslation("exams");
  const { t: tAlert } = useTranslation("alerts");
  const { t: tBtns } = useTranslation("buttons");

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
  const handleSelectAssessment = async (assessment: AssessmentType) => {
    const innerSelect = () => {
      getItemById(assessment.id).then((data) => {
        if (data) {
          dispatch(setActiveAssessment({ assessment: data }));
          dispatch(
            setAssessmentDetails({
              didAssessmentStart: data.didAssessmentStart,
              answeredAtLeastOnce: data.answeredAtLeastOnce,
              showReview: data.showReview,
              total_degree: data.total_degree,
            }),
          );
        } else {
          let activeAssessQuestionIndex = 0,
            examTimeRemaining = 0,
            didAssessmentStart = false,
            answeredAtLeastOnce = false,
            showReview = false,
            total_degree = 0;
          if (assessment.student?.length && assessment.student[0].pivot) {
            const pivot = assessment.student[0].pivot;
            activeAssessQuestionIndex = Number(pivot.activeAssessQuestionIndex);
            examTimeRemaining = Number(pivot.examTimeRemaining);
            didAssessmentStart = zeroOneToFalseTrue(pivot.didAssessmentStart);
            answeredAtLeastOnce = zeroOneToFalseTrue(pivot.answeredAtLeastOnce);
            showReview = zeroOneToFalseTrue(pivot.showReview);
            total_degree = pivot.total_degree;
          }
          
          dispatch(setActiveAssessment({ assessment }));
          dispatch(
            setAssessmentDetails({
              activeAssessQuestionIndex,
              examTimeRemaining,
              didAssessmentStart,
              answeredAtLeastOnce,
              showReview,
              total_degree,
            }),
          );

          updateItem(assessment.id, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(assessment as Record<string, any>),
            activeAssessQuestionIndex,
            examTimeRemaining,
            didAssessmentStart,
            answeredAtLeastOnce,
            showReview,
            total_degree,
          });
        }
      });
    };
    const prevId = localStorage.getItem("activeAssessmentId");
    if (prevId)
      updateItem(Number(JSON.parse(prevId)), {
        examTimeRemaining: assessmentDetails.examTimeRemaining,
      }).then(() => innerSelect());
    else innerSelect();
  };
  const handleDeleteQuestion = async () => {
    withReactContent(Swal).fire({
      title: tAlert("deleteQuestionsAlert"),
      preConfirm: async () => {
        try {
          await axiosDefault.delete(
            `${API_EXAMS.deleteAllQuestions}/${activeAssessment?.id}`,
          );
          await updateItem(activeAssessment!.id!, { questions: [] });
          const activeAssess = {
            ...activeAssessment,
            questions: [],
          } as AssessmentType;
          updateItem(activeAssessment!.id!, { questions: [] });
          dispatch(setActiveAssessment({ assessment: activeAssess }));
          dispatch(fetchDomains(course_id));
        } catch (error) {
          throw new Error("");
        }
      },
      confirmButtonText: tBtns("confirm"),
      icon: "warning",
      denyButtonText: tBtns("cancel"),
      showDenyButton: true,
      showLoaderOnConfirm: true,
    });
  };
  const handleResetExam = () => {
    dispatch(resetExam());
    activeAssessment &&
      updateItem(activeAssessment?.id, {
        showReview: false,
        didAssessmentStart: false,
        examTimeRemaining: examTime,
      });
  };
  const onStart = async () => {
    const assessment_id = activeAssessment?.id;
    dispatch(resetExam());
    dispatch(setIsPaused(false));
    try {
      // create mistakes assessment for this course, Backend ignores it if exists
      await axiosDefault.post(API_EXAMS.assessments, {
        student_id,
        course_id,
      });
    } catch (error) {
      return console.error(
        "Couldn't create mistakes assessmanet for this course",
      );
    }
    if (assessment_id) {
      const ques = questions.map((que) => ({
        ...que,
        question: {
          ...que.question,
          options: shuffle(que.question.options),
        },
      }));

      getItemById(assessment_id).then((data) => {
        if (data) {
          updateItem(assessment_id, {
            questions: ques,
            didAssessmentStart: true,
            examTimeRemaining: examTime,
          });
          dispatch(
            setActiveAssessment({
              assessment: { ...activeAssessment, questions: ques },
            }),
          );
          dispatch(
            setAssessmentDetails({
              examTimeRemaining: examTime,
              didAssessmentStart: true,
            }),
          );
        }
      });
    }
  };

  const handleEndExam = async (assessment_id: number) => {
    dispatch(setIsPaused(false));
    dispatch(
      setAssessmentDetails({
        activeAssessQuestionIndex: 0,
        showReview: true,
      }),
    );
    updateItem(assessment_id, {
      showReview: true,
      activeAssessQuestionIndex: 0,
    });

    // add mistakes for a separated exam
    if (!isTeacher) {
      let mistakesExamId: number | null = null;
      const { data: mistakesExamsData } = await axiosDefault.get(
        `${API_EXAMS.mistakesExams}/${student_id}`,
      );
      if (mistakesExamsData.data) {
        mistakesExamId = mistakesExamsData.data.id;
      }
      await getItemById(activeAssessment!.id!).then(async (assess) => {
        const ques = assess?.questions;
        if (ques) {
          const degree = ques.reduce(
            (acc, { answers }) =>
              answers.length && answers[0].answerState === "correct"
                ? acc + 1
                : acc,
            0,
          );
          const total_degree = Math.round((degree / ques.length) * 10000) / 100;

          const wrongQuestions = ques
            .filter(
              ({ answers }) =>
                answers.length && answers[0].answerState === "wrong",
            )
            .map(({ question, id }) => ({ ...question, id }));

          if (wrongQuestions.length) {
            await axiosDefault.post(
              API_EXAMS.questions,
              {
                assessment_id: mistakesExamId,
                course_id,
                questions: wrongQuestions,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                transformRequest: [(data) => JSON.stringify(data)],
              },
            );
          }

          const { data } = await axiosDefault.post(
            API_EXAMS.answer,
            {
              activeAssessQuestionIndex:
                assessmentDetails.activeAssessQuestionIndex,
              examTimeRemaining: assessmentDetails.examTimeRemaining,
              student_id,
              assessment_id,
              total_degree,
              didAssessmentStart: 1,
              showReview: 1,
              answeredAtLeastOnce: 1,
              answers: [],
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              transformRequest: [(data) => JSON.stringify(data)],
            },
          );
          if (data?.success) {
            dispatch(fetchDomains(course_id));
          }
        }
      });
    }
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
                {!questions?.length ? (
                  <>
                    <h4 className="mx-auto">{t("noQuestions")}</h4>
                    {isTeacher ? <UploadQuestions /> : ""}
                  </>
                ) : assessmentDetails.showReview ? (
                  <>
                    <Button
                      onClick={handleResetExam}
                      color="green"
                      className="mx-auto mb-2"
                    >
                      <ArrowPathIcon className="size-5" />
                      &nbsp;{t("resetExam")}
                    </Button>
                    <ExamResult />
                  </>
                ) : assessmentDetails.didAssessmentStart ? (
                  <ExamInterface
                    questions={questions}
                    examTime={examTime}
                    onEndExam={handleEndExam}
                    onFullscreen={toggleFullscreen}
                  />
                ) : (
                  <>
                    {isTeacher && activeAssessment?.questions?.length > 0 ? (
                      <Button
                        onClick={handleDeleteQuestion}
                        color="red"
                        className="mx-auto mb-2"
                      >
                        <TrashIcon className="size-5" /> {t("deleteQuestions")}
                      </Button>
                    ) : null}
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

import { useState, useEffect, useRef } from "react";
import { Button, Card, Progress, Modal } from "flowbite-react";
import { PauseIcon, PlayIcon, StopIcon } from "@heroicons/react/24/solid";
import Question from "./question";
import { useAppDispatch, useAppSelector } from "../../../../../../../../store";
import { resetExam, showQueAns } from "../../../../../../../../store/reducers/exam";

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
)};

const ExamInterface = ({ questions }: { questions: Question[] }) => {
  const dispatch = useAppDispatch();
  const examAnswers = useAppSelector(({exam}) => exam.examAnswers)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    Math.round(questions.length * 1.33333 * 60),
  );
  const [isPaused, setIsPaused] = useState(false);
  const [openModal, setOpenModal] = useState(false);
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
    dispatch(showQueAns(currentQuestionIndex));
    setOpenModal(true);
  }
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    return `${hours}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-gray-200 p-4">
        <div>
          <p>الوقت المتبقي: {formatTime(timeRemaining)}</p>
          <Progress progress={progress} color="blue" className="mt-2" />
        </div>
        <div>
          <p>
            سؤال {currentQuestionIndex + 1} من {questions?.length}
          </p>
        </div>
        <div className="flex">
          <span
            onClick={isPaused ? resumeTimer : pauseTimer}
            color="gray"
            className="mr-2"
          >
            {isPaused ? <PlayIcon className="size-8 cursor-pointer" /> : <PauseIcon className="size-8 cursor-pointer" />}
          </span>
          <span onClick={stopExam} color="red">
            <StopIcon className="size-8 cursor-pointer" />
          </span>
        </div>
      </header>

      {/* Question Content */}
      <Question question={questions[currentQuestionIndex]} questionIndex={currentQuestionIndex} />

      {/* Footer */}
      <footer className="flex items-center justify-between bg-gray-200 p-4">
        <Button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          color="red"
        >
          السابق
        </Button>
        <Button
          onClick={showAns}
          disabled={examAnswers[currentQuestionIndex]?.showAnsClicked}
          color="yellow"
        >
          الاجابة الصحيحة 
        </Button>
        <Button
          onClick={goToNextQuestion}
          disabled={currentQuestionIndex === questions?.length - 1}
          color="green"
        >
          التالي
        </Button>
      </footer>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)}>
        <Modal.Header>الوصف</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 p-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {questions[currentQuestionIndex]?.description}
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const ExamComponent = ({ questions }: { questions: Question[] }) => {
  const dispatch = useAppDispatch();
  const [isExamStarted, setIsExamStarted] = useState(false);
  const examAnswers = useAppSelector(({exam}) => exam.examAnswers);
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
          onStart={() => {setIsExamStarted(true);dispatch(resetExam())}}
        />
      )}
    </div>
  );
};

export default ExamComponent;

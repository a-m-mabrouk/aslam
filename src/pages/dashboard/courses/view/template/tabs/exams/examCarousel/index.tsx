import { useState, useEffect, useRef } from "react";
import { Button, Card, Progress } from "flowbite-react";
import { PauseIcon, PlayIcon, StopIcon } from "@heroicons/react/24/solid";

interface Question {
  id: number;
  text: string;
  options: string[];
}

const dummyQuestions: Question[] = [
  { id: 1, text: "What is React?", options: ["Library", "Framework", "Language", "Tool"] },
  { id: 2, text: "What is TypeScript?", options: ["Library", "Framework", "Language", "Tool"] },
  { id: 3, text: "What is HTML?", options: ["Markup", "Framework", "Language", "Tool"] },
  // Add more dummy questions as needed
];

const ExamDetails = ({ onStart }: { onStart: () => void }) => (
  <Card>
    <div className="flex justify-around">
      <div className="text-center">
        <h2 className="text-lg font-bold">الدرجة المطلوبة للنجاح</h2>
        <p>75%</p>
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold">سؤال</h2>
        <p>{dummyQuestions.length}</p>
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold">دقيقة</h2>
        <p>56</p>
      </div>
    </div>
    <ul className="ml-5 mt-4 list-disc text-right">
      <li>يمكنك إيقاف الاختبار مؤقتًا...</li>
      <li>يمكنك إعادة إجراء الاختبار...</li>
      {/* Additional instructions */}
    </ul>
    <Button onClick={onStart} className="mt-5">ابدأ الاختبار</Button>
  </Card>
);

const ExamInterface = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(56 * 60); // 56 minutes in seconds
  const [isPaused, setIsPaused] = useState(false);
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

  const progress = ((56 * 60 - timeRemaining) / (56 * 60)) * 100;

  const goToNextQuestion = () => {
    if (currentQuestionIndex < dummyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
          <p>سؤال {currentQuestionIndex + 1} من {dummyQuestions.length}</p>
        </div>
        <div>
            <span onClick={isPaused ? resumeTimer : pauseTimer} color="gray" className="mr-2">
                {isPaused ? <PlayIcon /> : <PauseIcon />}</span>
          {/* <Button onClick={isPaused ? resumeTimer : pauseTimer} color="gray" className="mr-2">
          </Button> */}
          <span onClick={stopExam} color="red"><StopIcon /></span>
        </div>
      </header>

      {/* Question Content */}
      <main className="grow p-4">
        <h2>{dummyQuestions[currentQuestionIndex].text}</h2>
        <ul className="mt-4">
          {dummyQuestions[currentQuestionIndex].options.map((option, index) => (
            <li key={index} className="mt-2">
              <input type="radio" name={`question-${currentQuestionIndex}`} id={`option-${index}`} />
              <label htmlFor={`option-${index}`} className="ml-2">{option}</label>
            </li>
          ))}
        </ul>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between bg-gray-200 p-4">
        <Button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0} color="red">
          السابق
        </Button>
        <Button onClick={goToNextQuestion} disabled={currentQuestionIndex === dummyQuestions.length - 1} color="green">
          التالي
        </Button>
      </footer>
    </div>
  );
};

const ExamComponent = () => {
  const [isExamStarted, setIsExamStarted] = useState(false);

  return (
    <div className="mx-auto my-8 max-w-4xl">
      {isExamStarted ? (
        <ExamInterface />
      ) : (
        <ExamDetails onStart={() => setIsExamStarted(true)} />
      )}
    </div>
  );
};

export default ExamComponent;

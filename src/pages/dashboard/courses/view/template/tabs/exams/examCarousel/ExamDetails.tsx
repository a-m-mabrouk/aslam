import { Button, Card } from "flowbite-react";
import { useMemo } from "react";

export default function ExamDetails({
  onStart,
  questions,
  examTime,
}: {
  onStart: () => void;
  questions: Question[];
  examTime: number;
}) {
  const formattedTime = useMemo(() => {
    const formatTime = (seconds: number) => {
      //   const hours = Math.floor(seconds / 3600);
      //   const mins = Math.floor((seconds % 3600) / 60);
      //   const secs = seconds % 60;
      //   return `${hours}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };
    return formatTime(examTime);
  }, [examTime]);
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
          <p>{formattedTime}</p>
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
  );
}

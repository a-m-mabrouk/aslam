import { Button, Card } from "flowbite-react";
import useGetLang from "../../../../../../../../hooks/useGetLang";

export default function ExamDetails({
  onStart,
  questions,
  examTime,
}: {
  onStart: () => void;
  questions: Question[];
  examTime: number;
}) {
  const {lang} = useGetLang();
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
          <p>{Math.round(examTime / 60)} {lang === 'ar'? "دقيقة" : "minutes"}</p>
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

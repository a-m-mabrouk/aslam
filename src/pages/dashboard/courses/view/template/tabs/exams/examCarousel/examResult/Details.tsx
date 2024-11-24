import { Table } from "flowbite-react";
import { useAppSelector } from "../../../../../../../../../store";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Details() {
  const examAnswers = useAppSelector(({ exams }) => exams.examAnswers);

  const aggregatedData = examAnswers.reduce(
    (acc, examAnswer) => {
      if (!acc[examAnswer.chapter]) {
        acc[examAnswer.chapter] = { questionsCount: 0, correctAnswersCount: 0 };
      }

      acc[examAnswer.chapter].questionsCount += 1;
      if (examAnswer.answerstate === "correct") {
        acc[examAnswer.chapter].correctAnswersCount += 1;
      }

      return acc;
    },
    {} as Record<
      string,
      { questionsCount: number; correctAnswersCount: number }
    >,
  );

  return (
    <div className="grid gap-6">
      <h2 className="text-center">تحليل النتيجة</h2>
      <div>
        <h3>النتيجة حسب المجالات المعرفية</h3>
        <Table striped hoverable className="text-center">
          <Table.Head className="border-2">
            <Table.HeadCell>مجال معرفي</Table.HeadCell>
            <Table.HeadCell>عدد الأسئلة</Table.HeadCell>
            <Table.HeadCell>الإجابات الصحيحة</Table.HeadCell>
            <Table.HeadCell>صحيح%</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {Object.keys(aggregatedData).map((key, i) => (
              <Table.Row className="border-2" key={i}>
                <Table.Cell>{key}</Table.Cell>
                <Table.Cell>{aggregatedData[key].questionsCount}</Table.Cell>
                <Table.Cell>
                  {aggregatedData[key].correctAnswersCount}
                </Table.Cell>
                <Table.Cell>
                  {Math.round(
                    (aggregatedData[key].correctAnswersCount /
                      aggregatedData[key].questionsCount) *
                      10000,
                  ) / 100}
                  %
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <div>
        <h3>النتيجة حسب مجموع النطاقات</h3>
        <Table striped hoverable className="text-center">
          <Table.Head className="border-2">
            <Table.HeadCell>رقم السؤال</Table.HeadCell>
            <Table.HeadCell>نطاقات إدارة المشروع</Table.HeadCell>
            <Table.HeadCell>مجال معرفي</Table.HeadCell>
            <Table.HeadCell>الدرجة</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {examAnswers.map((examAnswer, queIndex) => (
              <Table.Row className="border-2" key={queIndex}>
                <Table.Cell>{queIndex + 1}</Table.Cell>
                <Table.Cell>{examAnswer.domain}</Table.Cell>
                <Table.Cell>{examAnswer.chapter}</Table.Cell>
                <Table.Cell>
                  {examAnswer.answerstate === "correct" ? (
                    <CheckIcon className="mx-auto size-5 text-green-500" />
                  ) : (
                    <XMarkIcon className="mx-auto size-5 text-red-600" />
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}

// app/exam/[examId]/page.js
import { ExamLayout } from '@/components/exam/ExamLayout';
import QuestionArea from '@/components/exam/QuestionArea';
import exams from "@/public/data/exam.json"

async function getExamData (examId = 1) {
  return exams.find(exam => exam.id === parseInt(examId));
};

export default async function ExamPage({ params }) {
  const { examId } = await params;
  const exam = await getExamData(examId);
  
  if (!exam) {
    return <div>Exam not found</div>;
  }

  return (
    <ExamLayout exam={exam}>
      <QuestionArea />
    </ExamLayout>
  );
}
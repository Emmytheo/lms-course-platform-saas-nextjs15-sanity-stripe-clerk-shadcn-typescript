import { db } from '@/lib/db';
import { ExamTaker } from '@/components/lms/ExamTaker';
import { notFound, redirect } from 'next/navigation';
import { getAuth } from '@/lib/auth-wrapper';

export const dynamic = 'force-dynamic';

export default async function CBTExamStartPage({ params }: { params: Promise<{ examId: string }> }) {
    const { examId } = await params;
    const { userId } = await getAuth();

    if (!userId) {
        return redirect(`/sign-in?callbackUrl=/cbt/exam/${examId}/start`);
    }

    const exam = await db.getExamById(examId);

    if (!exam) {
        return notFound();
    }

    // Ensure CBT practice exams are accessible even without standard enrollment
    // or we check if user is at least logged in.
    
    return (
        <div className="h-screen bg-black overflow-hidden italic">
            <ExamTaker exam={exam} />
        </div>
    );
}

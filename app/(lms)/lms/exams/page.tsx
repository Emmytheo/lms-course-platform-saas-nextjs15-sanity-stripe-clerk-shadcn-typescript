import React from 'react';
import { db } from '@/lib/db';
import ExamsBrowser from '@/components/lms/ExamsBrowser';

import { getAuth } from '@/lib/auth-wrapper';

export default async function ExamsPage() {
    const { userId } = await getAuth();
    const dbExams = await db.getAllExams();

    const enrolledExamIds = userId
        ? (await db.getStudentExamEnrollmentsWithDetails(userId)).map((e: any) => e.exam_id || e.exam?._id)
        : [];

    const exams = dbExams.map(ex => ({
        ...ex,
        id: ex._id, // Mapping _id to id
        pass_score: ex.pass_score || 70,
        questions: ex.questions || [],
        created_at: ex.created_at || new Date().toISOString(),
        slug: ex.slug?.current || "",
        price: 0, // Exams might have price later
        isEnrolled: enrolledExamIds.includes(ex._id)
    }));

    // Type casting because dbExams matches `Exam` from `db/interface.ts` but `ExamsBrowser` expects `Exam` from `lms/types.ts`?
    // They are similar but `lms/types` has `id` not `_id`. I mapped it above.

    return <ExamsBrowser initialExams={exams as any} />;
}

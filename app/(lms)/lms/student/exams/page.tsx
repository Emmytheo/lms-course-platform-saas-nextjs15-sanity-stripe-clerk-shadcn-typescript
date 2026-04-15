import React from 'react';
import { db } from '@/lib/db';
import ExamsBrowser from '@/components/lms/ExamsBrowser';

export default async function ExamsPage() {
    const exams = await db.getAllExams();

    return <ExamsBrowser initialExams={exams} />;
}

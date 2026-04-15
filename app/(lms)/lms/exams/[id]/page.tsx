import React, { use } from 'react';
import { db } from '@/lib/db';
import { ExamTaker } from '@/components/lms/ExamTaker';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch real exam data
  const exam = await db.getExamById(id);

  if (!exam) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
        <h1 className="text-2xl font-bold">Exam Not Found</h1>
        <p className="text-gray-400">The exam you are looking for does not exist or has been removed.</p>
        <a href="/lms/dashboard" className="text-cyan-500 hover:underline">Return to Dashboard</a>
      </div>
    );
  }

  return <ExamTaker exam={exam} />;
}

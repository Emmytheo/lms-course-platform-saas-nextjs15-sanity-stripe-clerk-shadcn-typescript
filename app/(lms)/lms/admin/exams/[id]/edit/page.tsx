import React from 'react';
import { db } from '@/lib/db';
import { EditExamForm } from '@/components/admin/EditExamForm';

export const dynamic = 'force-dynamic';

export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const exam = await db.getExamById(id);

    if (!exam) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Exam not found</div>;
    }

    return <EditExamForm exam={exam} />;
}

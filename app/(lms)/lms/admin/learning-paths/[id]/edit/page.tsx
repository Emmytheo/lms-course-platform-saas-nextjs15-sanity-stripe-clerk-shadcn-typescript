'use client';

import React, { useEffect, useState, use } from 'react';
import { getLearningPathById, getAllCoursesAction, getAllExamsAction } from '@/actions/learning-paths';
import { LearningPath, Course, Exam } from '@/lib/db/interface';
import { EditLearningPathForm } from '@/components/admin/EditLearningPathForm';

export default function EditLearningPathPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [path, setPath] = useState<LearningPath | undefined>(undefined);
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [allExams, setAllExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getLearningPathById(id),
            getAllCoursesAction(),
            getAllExamsAction()
        ]).then(([p, courses, exams]) => {
            setPath(p || undefined);
            setAllCourses(courses);
            setAllExams(exams);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading Editor...</div>;
    if (!path) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Path not found</div>;

    return <EditLearningPathForm path={path} allCourses={allCourses} allExams={allExams} />;
}

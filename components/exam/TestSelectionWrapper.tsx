"use client";

import TestSelection from "./TestSelection";
import { useRouter } from "next/navigation";

export default function TestSelectionWrapper({ exams }: { exams: any[] }) {
    const router = useRouter();

    const handleExamSelect = (exam: any) => {
        router.push(`/cbt/exam/${exam.id}`);
    };

    return <TestSelection exams={exams} onExamSelect={handleExamSelect} />;
}

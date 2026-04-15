"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, Clock, HelpCircle, ArrowRight } from "lucide-react";

interface Exam {
    id: string;
    title: string;
    description: string;
    totalQuestions: number;
    duration: number;
    categories: string[];
}

interface TestSelectionProps {
    exams: Exam[];
    onExamSelect: (exam: Exam) => void;
}

const TestSelection = ({ exams, onExamSelect }: TestSelectionProps) => {
    const [selectedCategory, setSelectedCategory] = useState("all");

    const categories = [
        "all",
        ...Array.from(new Set(exams.flatMap((exam) => exam.categories))),
    ];

    const filteredExams =
        selectedCategory === "all"
            ? exams
            : exams.filter((exam) => exam.categories.includes(selectedCategory));

    return (
        <div className="space-y-12">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-6 h-10 font-bold capitalize transition-all ${
                            selectedCategory === category 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "hover:bg-primary/10"
                        }`}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {/* Exam Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredExams.map((exam) => (
                    <Card
                        key={exam.id}
                        className="group relative bg-card border-border overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 flex flex-col rounded-3xl"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                             <Calculator className="w-32 h-32 -mr-8 -mt-8" />
                        </div>

                        <CardHeader className="relative z-10 pb-2">
                             <div className="flex flex-wrap gap-2 mb-4">
                                {exam.categories.map((cat) => (
                                    <Badge key={cat} variant="secondary" className="bg-primary/10 text-primary font-bold uppercase tracking-widest text-[10px]">
                                        {cat}
                                    </Badge>
                                ))}
                            </div>
                            <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors">
                                {exam.title}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground line-clamp-3 leading-relaxed">
                                {exam.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 relative z-10 pt-4">
                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border mb-6">
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-bold">{exam.totalQuestions} Questions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-bold">{exam.duration} Minutes</span>
                                </div>
                            </div>

                            <Button 
                                onClick={() => onExamSelect(exam)} 
                                className="w-full h-12 rounded-2xl font-black tracking-widest uppercase gap-2 hover:gap-4 transition-all"
                            >
                                START PRACTICE
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TestSelection;

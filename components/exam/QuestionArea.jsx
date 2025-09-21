// components/exam/QuestionArea.js
"use client";
import { useExam } from './ExamLayout';
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const QuestionArea = () => {
  const { 
    exam, 
    currentSection, 
    currentQuestion, 
    answers, 
    handleAnswerSelect 
  } = useExam();

  const questionData = exam.sections[currentSection].questions[currentQuestion];
  const selectedAnswer = answers[`${currentSection}-${currentQuestion}`];

  return (
    <div className="bg-card border rounded-lg p-6 max-w-3xl mx-auto shadow-sm" style={{zoom: 0.85}}>
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
          {exam.sections[currentSection].title}
        </span>
        <span className="text-sm text-muted-foreground">Question {currentQuestion + 1}</span>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-medium text-foreground mb-4 leading-relaxed">{questionData.text}</h2>
        {questionData.image && (
          <div className="mb-6 flex justify-center">
            <img 
              src={questionData.image} 
              alt="Question illustration" 
              className="max-w-full h-auto rounded-lg border"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        {questionData.options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={cn(
              "p-4 border rounded-lg cursor-pointer transition-all",
              "hover:border-primary/50 hover:bg-accent",
              selectedAnswer === index 
                ? "border-primary bg-primary/10 shadow-md" 
                : "border-border shadow-sm"
            )}
          >
            <div className="flex items-center">
              <div className={cn(
                "w-6 h-6 rounded-full border flex items-center justify-center mr-4 flex-shrink-0",
                selectedAnswer === index 
                  ? "border-primary bg-primary text-primary-foreground" 
                  : "border-muted-foreground/30"
              )}>
                {selectedAnswer === index && <Check className="w-4 h-4" />}
              </div>
              <span className="text-foreground">{option}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionArea;
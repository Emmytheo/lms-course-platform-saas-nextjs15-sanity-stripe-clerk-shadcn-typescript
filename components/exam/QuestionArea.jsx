// components/exam/QuestionArea.js
"use client";
import { useExam } from './ExamLayout';
import { cn } from "@/lib/utils";
import { Check, X, XCircle, CheckCircle } from "lucide-react";

const QuestionArea = () => {
  const { 
    exam, 
    currentSection, 
    currentQuestion, 
    answers, 
    handleAnswerSelect,
    evalMode
  } = useExam();

  const questionData = exam.sections[currentSection].questions[currentQuestion];
  const selectedAnswer = answers[`${currentSection}-${currentQuestion}`];
  const correctAnswer = questionData.correctAnswer;
  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="bg-card border rounded-lg p-6 max-w-3xl mx-auto shadow-sm" style={{zoom: 0.85}}>
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
          {exam.sections[currentSection].title}
        </span>
        {evalMode && (
          <div className={cn(
            "flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full",
            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          )}>
            {isCorrect ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {isCorrect ? "Correct" : "Incorrect"}
          </div>
        )}
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
        {questionData.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isActuallyCorrect = index === correctAnswer;
          
          let optionStyles = "";
          let checkmark = null;
          
          if (evalMode) {
            if (isActuallyCorrect) {
              optionStyles = "border-green-500 bg-green-50 text-green-700";
              checkmark = <Check className="w-4 h-4 text-green-600" />;
            } else if (isSelected && !isActuallyCorrect) {
              optionStyles = "border-red-500 bg-red-50 text-red-700";
              checkmark = <X className="w-4 h-4 text-red-600" />;
            }
          } else if (isSelected) {
            optionStyles = "border-primary bg-primary/10";
            checkmark = <Check className="w-4 h-4 text-primary" />;
          }
          
          return (
            <div
              key={index}
              onClick={() => !evalMode && handleAnswerSelect(index)}
              className={cn(
                "p-4 border rounded-lg transition-all relative",
                "dark:border-primary/50 dark:bg-accent",
                !evalMode && "cursor-pointer",
                optionStyles || "border-border"
              )}
            >
              <div className="flex items-center">
                <div className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center mr-4 flex-shrink-0",
                  evalMode && isActuallyCorrect ? "border-green-500 bg-green-500 text-white" :
                  evalMode && isSelected && !isActuallyCorrect ? "border-red-500 bg-red-500 text-white" :
                  isSelected ? "border-primary bg-primary text-primary-foreground" : 
                  "border-muted-foreground/30"
                )}>
                  {checkmark}
                </div>
                <span className={cn(
                  evalMode && isActuallyCorrect ? "font-medium" : "",
                  evalMode && isSelected && !isActuallyCorrect ? "line-through" : ""
                )}>
                  {option}
                </span>
                
                {evalMode && isActuallyCorrect && (
                  <div className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Correct Answer
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {evalMode && selectedAnswer !== null && (
        <div className={cn(
          "mt-6 p-4 rounded-lg border",
          isCorrect ? "bg-green-50 border-green-200 text-green-800" : 
                   "bg-red-50 border-red-200 text-red-800"
        )}>
          <div className="flex items-center gap-2 font-medium">
            {isCorrect ? (
              <>
                <Check className="h-5 w-5" />
                <span>Your answer is correct!</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5" />
                <span>Your answer is incorrect.</span>
              </>
            )}
          </div>
          {!isCorrect && (
            <p className="mt-2 text-sm">
              The correct answer is: <strong>{questionData.options[correctAnswer]}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionArea;
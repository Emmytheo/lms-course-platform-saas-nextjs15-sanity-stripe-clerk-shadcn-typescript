// components/exam/ExamResults.js
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Home } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { redirect } from 'next/navigation';

export const ExamResults = ({ exam, answers, onExit }) => {
  // Calculate score
  let correctCount = 0;
  let totalCount = 0;
  
  exam.sections.forEach((section, sIndex) => {
    section.questions.forEach((question, qIndex) => {
      totalCount++;
      if (answers[`${sIndex}-${qIndex}`] === question.correctAnswer) {
        correctCount++;
      }
    });
  });

  const score = Math.round((correctCount / totalCount) * 100);
  const isPassing = score >= 70;

  return (
    <div className="flex flex-col items-center justify-center bg-background p-6" style={{minHeight: "calc(100vh - 6rem)"}}>
      <div className="bg-card border rounded-lg p-8 w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
            isPassing ? "bg-green-100" : "bg-red-100"
          )}>
            {isPassing ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Exam Results</h2>
          <p className="text-muted-foreground">
            {isPassing ? "Congratulations! You passed." : "You need more practice to pass."}
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="text-center">
            <div className={cn(
              "text-5xl font-bold mb-2",
              isPassing ? "text-green-600" : "text-red-600"
            )}>
              {score}%
            </div>
            <p className="text-muted-foreground">
              {correctCount} out of {totalCount} questions correct
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Performance</span>
              <span className="font-medium">{score}%</span>
            </div>
            <Progress value={score} className="h-2" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button onClick={()=>{redirect(`/cbt`)}} className="w-full gap-2">
            <Home className="h-4 w-4" />
            Return to Test Selection
          </Button>
          {!isPassing && (
            <Button variant="outline" onClick={onExit}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
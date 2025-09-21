// components/exam/ExamHeader.js
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ExamHeader = ({ exam, timeRemaining, onShowSubmitDialog, evalMode, toggleEvalMode, isCorrect }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-background border-b py-4 px-6 flex justify-between items-center lg:pl-[25rem]">
      <div className="flex items-center gap-2 w-fit truncate">
        <h1 className="text-xl font-semibold text-foreground whitespace-nowrap truncate">{exam.title}</h1>
        
      </div>
      
      
      <div className="flex items-center gap-2">
        
        <div className={cn(
          "flex items-center gap-2 text-lg font-medium",
          timeRemaining < 300 ? "text-destructive" : "text-foreground"
        )}>
          <Clock className="h-5 w-5" />
          <span>{formatTime(timeRemaining)}</span>
        </div>
        
        <Button
          onClick={onShowSubmitDialog}
          variant="destructive"
          className="gap-2"
        >
          <AlertCircle className="h-4 w-4" />
          Submit Test
        </Button>
      </div>
    </header>
  );
};

export default ExamHeader;
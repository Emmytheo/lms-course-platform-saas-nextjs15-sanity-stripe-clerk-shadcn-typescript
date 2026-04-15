// components/learning-path/ProgressTracker.js
"use client";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, PlayCircle } from "lucide-react";

export const ProgressTracker = ({ path }) => {
  const totalActivities = (path.courses?.length || 0) + (path.exams?.length || 0) + (path.practicals?.length || 0);
  const completedActivities = (path.courses?.filter(c => c.progress === 100).length || 0) + 
                            (path.exams?.filter(e => e.score).length || 0) + 
                            (path.practicals?.filter(p => p.status === 'completed').length || 0);

  const progressPercentage = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{completedActivities} of {totalActivities} activities completed</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          {path.courses?.map(course => (
            <div key={course.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
              {course.progress === 100 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : course.progress > 0 ? (
                <PlayCircle className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={course.progress === 100 ? "line-through text-muted-foreground" : ""}>
                {course.title}
              </span>
              {course.progress > 0 && course.progress < 100 && (
                <Progress value={course.progress} className="w-20 h-1" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
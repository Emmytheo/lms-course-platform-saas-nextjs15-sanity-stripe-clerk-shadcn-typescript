"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Library,
  ChevronRight,
  X,
  CheckCircle,
  Circle,
  Clock,
  HelpCircle,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface ExamSidebarProps {
  exam: {
    id: number;
    title: string;
    description: string;
    duration: number;
    questions: number;
    categories: string[];
    sections: {
      title: string;
      questions: {
        text: string;
        options: string[];
        correctAnswer: number;
      }[];
    }[];
  };
  currentSection: number;
  currentQuestion: number;
  answers: Record<string, number | null>;
  onQuestionSelect: (sectionIndex: number, questionIndex: number) => void;
  timeRemaining: number;
}

export function ExamSidebar({
  exam,
  currentSection,
  currentQuestion,
  answers,
  onQuestionSelect,
  timeRemaining,
}: ExamSidebarProps) {
  const pathname = usePathname();
  const { isOpen, toggle, close } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);

  useEffect(() => {
    // Open the current section by default
    if (exam?.sections && !openSections.includes(`section-${currentSection}`)) {
      setOpenSections((prev) => [...prev, `section-${currentSection}`]);
    }
  }, [currentSection, exam, openSections]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!exam || !isMounted) {
    return null;
  }

  // Calculate progress statistics
  const totalQuestions = exam.sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );

  const answeredQuestions = Object.values(answers).filter(
    (answer) => answer !== null
  ).length;

  const progressPercentage = Math.round(
    (answeredQuestions / totalQuestions) * 100
  );

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getAnswerStatus = (sectionIndex: number, questionIndex: number) => {
    const answer = answers[`${sectionIndex}-${questionIndex}`];
    return answer !== null ? "answered" : "unanswered";
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 lg:p-6 border-b flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div className="flex">
            
            <Link
              href="/exam-library"
              className="items-center gap-x-2 text-sm hover:text-primary transition-colors flex"
            >
              <ArrowLeft className="h-4 w-4 hidden md:flex" />
              <div className="flex items-center gap-x-2">
                <Library className="h-4 w-4 hidden md:flex" />
                <span>Exam Library</span>
              </div>
            </Link>
          </div>

          <Button
            onClick={close}
            variant="ghost"
            className="lg:hidden -mr-2"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <h1 className="font-semibold text-2xl">{exam.title}</h1>
          <p className="text-sm text-muted-foreground">{exam.description}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Time Remaining</span>
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  timeRemaining < 300 ? "text-red-500" : "text-foreground"
                )}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Progress</span>
              </div>
              <span className="text-sm font-medium">
                {answeredQuestions}/{totalQuestions}
              </span>
            </div>

            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 w-full">
        <div className="p-2 lg:p-4">
          <Accordion
            type="multiple"
            className="w-full space-y-4"
            value={openSections}
            onValueChange={setOpenSections}
          >
            {exam.sections.map((section, sectionIndex) => (
              <AccordionItem
                key={sectionIndex}
                value={`section-${sectionIndex}`}
                className="border-none bg-muted/50 dark:bg-muted/30 rounded-lg"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline transition-colors">
                  <div className="flex items-center gap-x-4 w-full">
                    <div className="flex flex-col gap-y-1 text-left flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {section.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {section.questions.length} questions
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 px-4 pb-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Question Navigation
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-primary"></div>
                      <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                      <div className="w-3 h-3 rounded-sm bg-muted"></div>
                    </div>
                  </div>

                  {/* GitHub activity tracker style grid */}
                  <div className="grid grid-cols-8 gap-2">
                    {section.questions.map((_, questionIndex) => {
                      const isCurrent =
                        sectionIndex === currentSection &&
                        questionIndex === currentQuestion;
                      const isAnswered =
                        getAnswerStatus(sectionIndex, questionIndex) ===
                        "answered";

                      return (
                        <TooltipProvider key={questionIndex} delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() =>
                                  onQuestionSelect(sectionIndex, questionIndex)
                                }
                                className={cn(
                                  "w-full aspect-square rounded-sm flex items-center justify-center text-xs font-medium transition-all",
                                  isCurrent
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : isAnswered
                                      ? "bg-green-500 text-white"
                                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                                )}
                              >
                                {questionIndex + 1}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>
                                {isCurrent
                                  ? "Current question"
                                  : isAnswered
                                    ? "Answered"
                                    : "Not answered"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-primary"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-muted"></div>
                      <span>Unanswered</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span>Section Progress</span>
          </div>
          <span className="font-medium">
            {currentSection + 1}/{exam.sections.length}
          </span>
        </div>

        <div className="mt-2 flex gap-1">
          {exam.sections.map((section, index) => {
            const answeredInSection = section.questions.filter(
              (_, qIndex) => answers[`${index}-${qIndex}`] !== null
            ).length;

            const sectionProgress = Math.round(
              (answeredInSection / section.questions.length) * 100
            );

            return (
              <TooltipProvider key={index} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "h-2 flex-1 rounded-full transition-all",
                        index === currentSection
                          ? "bg-primary"
                          : answeredInSection > 0
                            ? "bg-green-500"
                            : "bg-muted"
                      )}
                      style={{
                        width: `${100 / exam.sections.length}%`,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>
                      {section.title}: {answeredInSection}/
                      {section.questions.length}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Thin Mobile Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 flex flex-row items-center h-[60px] border-r bg-background lg:hidden px-4 gap-x-4">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggle}
                variant="ghost"
                size="icon"
                className="h-10 w-10"
              >
                <ChevronRight
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Toggle Sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </aside>

      {/* Main Sidebar - Desktop & Mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 top-0 z-40 bg-background transition-all duration-300 ease-in-out",
          "lg:z-50 lg:block lg:w-96 border-r",
          isOpen
            ? "w-full translate-x-[0px] lg:translate-x-0 lg:w-96"
            : "translate-x-[-100%] lg:translate-x-0"
        )}
      >
        <div className="h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={close}
        />
      )}
    </>
  );
}

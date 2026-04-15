'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CheckCircle, Circle, AlertCircle, Timer, ArrowLeft,
  HelpCircle, BarChart3, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Exam } from '@/lib/lms/types';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface ExamSidebarProps {
  exam: Exam;
  currentQuestionIndex: number;
  answers: Record<string, number>;
  onSelectQuestion: (index: number) => void;
  timeLeft?: string; // Formatted "MM:SS"
}

export function ExamSidebar({
  exam,
  currentQuestionIndex,
  answers,
  onSelectQuestion,
  timeLeft = "45:00"
}: ExamSidebarProps) {

  const [openSections, setOpenSections] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalQuestions = exam.sections?.length
    ? exam.sections.reduce((acc, section) => acc + section.questions.length, 0)
    : (exam.questions ? exam.questions.length : 0);
  const answeredCount = Object.keys(answers).length;
  const globalProgress = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // Determine active section based on global index
  useEffect(() => {
    if (!exam.sections) return;

    let count = 0;
    for (let i = 0; i < exam.sections.length; i++) {
      const sectionLen = exam.sections[i].questions.length;
      if (currentQuestionIndex >= count && currentQuestionIndex < count + sectionLen) {
        const secId = `section-${i}`;
        if (!openSections.includes(secId)) {
          setOpenSections(prev => [...prev, secId]);
        }
        break;
      }
      count += sectionLen;
    }
  }, [currentQuestionIndex, exam.sections, openSections]);

  if (!isMounted) return null;

  // Generate a flattened map or iterate sections directly 
  // We'll iterate sections to build the Accordion

  let globalIndexCounter = 0; // To track global index across sections

  return (
    <div className="h-full flex flex-col bg-background border-r border-border text-foreground">
      {/* Header */}
      <div className="p-5 border-b border-border space-y-5">
        <Link href="/lms/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Exit Exam
        </Link>

        <div>
          <h2 className="font-bold text-foreground text-lg leading-tight mb-2 truncate" title={exam.title}>{exam.title}</h2>
          <div className={cn(
            "flex items-center gap-2 font-mono text-xl font-bold p-2 rounded border justify-center transition-colors",
            "text-primary bg-primary/10 border-primary/20"
          )}>
            <Timer className="w-5 h-5" />
            <span>{timeLeft}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" /> Progress</span>
            <span>{answeredCount}/{totalQuestions} Answered</span>
          </div>
          <Progress value={globalProgress} className="h-2 bg-muted" indicatorClassName="bg-primary" />
        </div>
      </div>

      {/* Accordion List */}
      <ScrollArea className="flex-1 w-full">
        <div className="p-4">
          {exam.sections && exam.sections.length > 0 ? (
            <Accordion
              type="multiple"
              className="w-full space-y-4"
              value={openSections}
              onValueChange={setOpenSections}
            >
              {exam.sections.map((section, sectionIdx) => {
                const sectionStartIndex = globalIndexCounter;
                // Calculate section stats
                let sectionAnsweredCount = 0;
                section.questions.forEach((q) => {
                  if (q.id && answers[q.id] !== undefined) {
                    sectionAnsweredCount++;
                  }
                });

                // Advance counter for next loop
                const currentCounterStart = globalIndexCounter;
                globalIndexCounter += section.questions.length;

                return (
                  <AccordionItem
                    key={sectionIdx}
                    value={`section-${sectionIdx}`}
                    className="border-none bg-muted/40 rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/60 hover:no-underline transition-colors">
                      <span className="font-semibold text-sm">{section.title}</span>
                    </AccordionTrigger>

                    <AccordionContent className="pt-3 px-4 pb-4 bg-muted/20">
                      <div className="grid grid-cols-5 gap-2">
                        {section.questions.map((q, qIdx) => {
                          const globalIdx = currentCounterStart + qIdx;
                          const isCurrent = currentQuestionIndex === globalIdx;
                          const isAnswered = answers[q.id] !== undefined;

                          return (
                            <TooltipProvider key={q.id || globalIdx} delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => onSelectQuestion(globalIdx)}
                                    className={cn(
                                      "aspect-square rounded flex items-center justify-center text-xs font-bold border transition-all",
                                      isCurrent
                                        ? "border-primary bg-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.5)] scale-110 z-10"
                                        : isAnswered
                                          ? "border-green-800 bg-green-900/40 text-green-400"
                                          : "border-border bg-muted text-muted-foreground hover:border-foreground/20 hover:bg-muted/80"
                                    )}
                                  >
                                    {qIdx + 1}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-popover border-border text-popover-foreground">
                                  <p>{isCurrent ? "Current Question" : isAnswered ? "Answered" : "Not Answered"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                      </div>

                      {/* Mini Section Progress Line */}
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <Progress
                          value={(sectionAnsweredCount / section.questions.length) * 100}
                          className="h-1 bg-muted"
                          indicatorClassName="bg-primary"
                        />
                        <span className="text-[10px] text-muted-foreground font-mono">{sectionAnsweredCount}/{section.questions.length}</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            // Fallback for flat exams without sections (if any)
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((q, idx) => {
                const isCurrent = currentQuestionIndex === idx;
                const isAnswered = answers[q.id] !== undefined;
                return (
                  <button
                    key={q.id}
                    onClick={() => onSelectQuestion(idx)}
                    className={cn(
                      "aspect-square rounded flex items-center justify-center text-xs font-bold border transition-all",
                      isCurrent
                        ? "border-primary bg-primary text-primary-foreground"
                        : isAnswered
                          ? "border-green-800 bg-green-900/40 text-green-400"
                          : "border-border bg-muted text-muted-foreground hover:border-foreground/20 hover:bg-muted/80"
                    )}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Legend */}
      <div className="p-5 border-t border-border space-y-3 bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">
          Legend
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded bg-primary border border-primary" /> Current
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded bg-green-900/40 border border-green-800" /> Answered
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded bg-muted border border-border" /> Unanswered
        </div>
      </div>
    </div>
  );
}

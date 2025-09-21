// components/ExamFooter.js
"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ExamFooter = ({
  exam,
  currentSection,
  currentQuestion,
  answers,
  onNext,
  onPrevious,
  onQuestionSelect,
  onToggleSidebar,
}) => {
  const currentSectionData = exam.sections[currentSection];
  const isFirstQuestion = currentQuestion === 0 && currentSection === 0;
  const isLastQuestion =
    currentQuestion === currentSectionData.questions.length - 1 &&
    currentSection === exam.sections.length - 1;

  // State to track active section for mobile view
  const [activeSection, setActiveSection] = useState(currentSection);

  return (
    <footer className="bg-background border-t p-4 lg:pl-[25rem]">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Mobile menu button - only shows on small screens */}
        {/* <Button
          onClick={onToggleSidebar}
          variant="outline"
          size="icon"
          className="lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button> */}

        {/* Previous button - hidden on mobile when not needed */}
        <Button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          variant="outline"
          className="gap-1 order-2 lg:order-1 flex-shrink-0 hidden lg:flex"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Question navigation - main content area */}
        <div className="flex-1 w-full lg:mx-4 overflow-auto order-1 lg:order-2">
          {/* Section selector for mobile */}
          <div className="lg:hidden mb-2 w-full flex justify-center">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(parseInt(e.target.value))}
              className="w-full sm:w-fit p-2 text-sm border rounded-md"
            >
              {exam.sections.map((section, index) => (
                <option key={index} value={index}>
                  {section.title} ({section.questions.length} questions)
                </option>
              ))}
            </select>
          </div>

          {/* Question grid */}
          <div className="flex flex-col lg:flex-row lg:space-x-4 justify-center">
            {/* Desktop: Show all sections */}
            <div className="hidden lg:flex space-x-4">
              {[currentSectionData].map((section, sIndex) => (
                <div key={sIndex} className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground mb-2">
                    {section.title}
                  </span>
                  <div className="flex flex-wrap gap-1 justify-center max-w-fit py-1">
                    {section.questions.map((_, qIndex) => {
                      const isAnswered =
                        answers[`${sIndex}-${qIndex}`] !== null;
                      const isCurrent =
                        sIndex === currentSection && qIndex === currentQuestion;

                      return (
                        <button
                          key={qIndex}
                          onClick={() => onQuestionSelect(sIndex, qIndex)}
                          className={cn(
                            "w-6 h-6 rounded-sm flex items-center justify-center text-xs transition-all",
                            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            isCurrent
                              ? "bg-primary text-primary-foreground shadow-md"
                              : isAnswered
                                ? "bg-green-500 text-white"
                                : "bg-muted text-muted-foreground"
                          )}
                        >
                          {qIndex + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: Show only active section with horizontal scroll */}
            <div className="lg:hidden w-full">
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max justify-center">
                  {exam.sections[activeSection]?.questions.map((_, qIndex) => {
                    const isAnswered =
                      answers[`${activeSection}-${qIndex}`] !== null;
                    const isCurrent =
                      activeSection === currentSection &&
                      qIndex === currentQuestion;

                    return (
                      <button
                        key={qIndex}
                        onClick={() => onQuestionSelect(activeSection, qIndex)}
                        className={cn(
                          "w-8 h-8 rounded-sm flex items-center justify-center text-xs transition-all flex-shrink-0",
                          "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          isCurrent
                            ? "bg-primary text-primary-foreground shadow-md"
                            : isAnswered
                              ? "bg-green-500 text-white"
                              : "bg-muted text-muted-foreground"
                        )}
                      >
                        {qIndex + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next button */}
        <Button
          onClick={onNext}
          className="gap-1 order-3 flex-shrink-0 hidden lg:flex"
        >
          <span className="hidden sm:inline">
            {isLastQuestion ? "Finish" : "Next"}
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="flex lg:hidden w-full gap-4 order-4 justify-center">
          {/* Previous button */}
          <Button
            onClick={onPrevious}
            disabled={isFirstQuestion}
            variant="outline"
            className="gap-1 flex-shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hiddenn sm:inline">Previous</span>
          </Button>

          {/* Next button */}
          <Button onClick={onNext} className="gap-1 flex-shrink-0">
            <span className="hiddenn sm:inline">
              {isLastQuestion ? "Finish" : "Next"}
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default ExamFooter;

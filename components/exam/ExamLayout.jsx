// components/exam/ExamLayout.js
"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { ExamSidebar } from "./ExamSideBarNew";
import ExamHeader from "./ExamHeader";
import ExamFooter from "./ExamFooter";
import { SubmitDialog } from "./SubmitDialog";
import { ExamResults } from "./ExamResults";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square } from "lucide-react";

// Create context for exam state
const ExamContext = createContext();

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam must be used within an ExamLayout");
  }
  return context;
};

export const ExamLayout = ({ exam, children }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [evalMode, setEvalMode] = useState(false); // New state for evaluation mode

  useEffect(() => {
    // Initialize answers object
    const initialAnswers = {};
    exam.sections.forEach((section, sIndex) => {
      section.questions.forEach((question, qIndex) => {
        initialAnswers[`${sIndex}-${qIndex}`] = null;
      });
    });
    setAnswers(initialAnswers);
  }, [exam]);

  useEffect(() => {
    // Timer logic
    if (timeRemaining <= 0 && !isFinished) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isFinished]);

  const handleAnswerSelect = (answer) => {
    if (evalMode) return; // Don't allow answer changes in eval mode
    setAnswers((prev) => ({
      ...prev,
      [`${currentSection}-${currentQuestion}`]: answer,
    }));
  };

  const handleQuestionSelect = (sectionIndex, questionIndex) => {
    setCurrentSection(sectionIndex);
    setCurrentQuestion(questionIndex);
  };

  const handleNext = () => {
    const currentSectionQuestions = exam.sections[currentSection].questions;
    if (currentQuestion < currentSectionQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else if (currentSection < exam.sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
      setCurrentQuestion(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    } else if (currentSection > 0) {
      const prevSection = currentSection - 1;
      setCurrentSection(prevSection);
      setCurrentQuestion(exam.sections[prevSection].questions.length - 1);
    }
  };

  const handleSubmit = () => {
    setIsFinished(true);
  };

  const onExit = () => {
    setIsFinished(false);
    setShowConfirmSubmit(false);

  }

  const toggleEvalMode = (evalMode) => {
    if (!evalMode) return setEvalMode((prev) => !prev);
    setEvalMode(evalMode);
  };

  // Get current question data
  const currentQuestionData =
    exam.sections[currentSection].questions[currentQuestion];
  const selectedAnswer = answers[`${currentSection}-${currentQuestion}`];
  const isCorrect = selectedAnswer === currentQuestionData.correctAnswer;

  // Provide exam state to children
  const examState = {
    exam,
    currentSection,
    currentQuestion,
    answers,
    timeRemaining,
    evalMode,
    handleAnswerSelect,
    handleQuestionSelect,
    handleNext,
    handlePrevious,
    toggleEvalMode,
  };

  if (isFinished) {
    return (
      <ExamResults
        exam={exam}
        answers={answers}
        onExit={onExit}
        evalMode={evalMode}
        toggleEvalMode={toggleEvalMode}
      />
    );
  }

  return (
    <ExamContext.Provider value={examState}>
      <div
        className="flex flex-col bg-background"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <ExamHeader
          exam={exam}
          timeRemaining={timeRemaining}
          onShowSubmitDialog={() => setShowConfirmSubmit(true)}
          evalMode={evalMode}
          toggleEvalMode={toggleEvalMode}
          isCorrect={isCorrect}
        />

        <div className="flex flex-1 overflow-hidden">
          <ExamSidebar
            exam={exam}
            currentSection={currentSection}
            currentQuestion={currentQuestion}
            answers={answers}
            timeRemaining={timeRemaining}
            onQuestionSelect={handleQuestionSelect}
            evalMode={evalMode}
            toggleEvalMode={toggleEvalMode}
          />

          <main className="flex-1 overflow-auto p-6 lg:pl-96 ">{children}</main>
        </div>

        <ExamFooter
          exam={exam}
          currentSection={currentSection}
          currentQuestion={currentQuestion}
          answers={answers}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onQuestionSelect={handleQuestionSelect}
          evalMode={evalMode}
        />

        <SubmitDialog
          open={showConfirmSubmit}
          onOpenChange={setShowConfirmSubmit}
          onSubmit={handleSubmit}
          evalMode={evalMode}
          toggleEvalMode={toggleEvalMode}
        />
      </div>
    </ExamContext.Provider>
  );
};

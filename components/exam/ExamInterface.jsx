// components/ExamInterface.js
import { useState, useEffect } from 'react';
// import ExamSidebar from './ExamSidebar';
import ExamFooter from './ExamFooter';
import QuestionArea from '@/components/exam/QuestionArea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/DialogNew';
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ExamSidebar } from "./ExamSideBarNew";

const ExamInterface = ({ exam, onExit }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  
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
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isFinished]);

  const handleAnswerSelect = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [`${currentSection}-${currentQuestion}`]: answer
    }));
  };

  const handleQuestionSelect = (sectionIndex, questionIndex) => {
    setCurrentSection(sectionIndex);
    setCurrentQuestion(questionIndex);
  };

  const handleNext = () => {
    const currentSectionQuestions = exam.sections[currentSection].questions;
    if (currentQuestion < currentSectionQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentSection < exam.sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentSection > 0) {
      const prevSection = currentSection - 1;
      setCurrentSection(prevSection);
      setCurrentQuestion(exam.sections[prevSection].questions.length - 1);
    }
  };

  const handleSubmit = () => {
    setIsFinished(true);
    // Calculate score logic would go here
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
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

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Exam Results</h2>
          <div className="text-center mb-2">
            <div className="text-5xl font-bold text-blue-600 mb-2">{score}%</div>
            <p className="text-gray-600">{correctCount} out of {totalCount} questions correct</p>
          </div>
          <div className="mt-8">
            <button
              onClick={onExit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Test Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = exam.sections[currentSection].questions[currentQuestion];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">{exam.title}</h1>
        <div className="flex items-center space-x-4">
          <div className="text-lg font-medium text-red-600">{formatTime(timeRemaining)}</div>
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Submit Test
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ExamSidebar 
          exam={exam}
          currentSection={currentSection}
          currentQuestion={currentQuestion}
          answers={answers}
          onQuestionSelect={handleQuestionSelect}
        />
        
        {/* <SideBar/> */}
        
        <div className="flex-1 overflow-auto p-6">
          <QuestionArea
            question={currentQuestionData}
            selectedAnswer={answers[`${currentSection}-${currentQuestion}`]}
            onAnswerSelect={handleAnswerSelect}
            questionNumber={currentQuestion + 1}
            sectionTitle={exam.sections[currentSection].title}
          />
        </div>
      </div>

      <ExamFooter
        exam={exam}
        currentSection={currentSection}
        currentQuestion={currentQuestion}
        answers={answers}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onQuestionSelect={handleQuestionSelect}
      />

      <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your exam? You won't be able to make changes after submission.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => setShowConfirmSubmit(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Submit Exam
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamInterface;
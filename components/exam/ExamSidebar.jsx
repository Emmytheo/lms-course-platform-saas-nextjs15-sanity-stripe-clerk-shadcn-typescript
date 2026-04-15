// components/ExamSidebar.js
import { useState } from 'react';

const ExamSidebar = ({ exam, currentSection, currentQuestion, answers, onQuestionSelect }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getAnswerStatus = (sectionIndex, questionIndex) => {
    const answer = answers[`${sectionIndex}-${questionIndex}`];
    return answer !== null ? 'answered' : 'unanswered';
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-background border-r border-border flex flex-col">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-4 border-b border-border hover:bg-muted"
        >
          →
        </button>
        <div className="flex-1 overflow-auto p-2">
          {exam.sections.map((section, sIndex) => (
            <div key={sIndex} className="mb-4">
              <div className="text-xs font-medium text-muted-foreground truncate" title={section.title}>
                {section.title.substring(0, 3)}
              </div>
              <div className="grid grid-cols-5 gap-1 mt-1">
                {section.questions.map((_, qIndex) => (
                  <button
                    key={qIndex}
                    onClick={() => onQuestionSelect(sIndex, qIndex)}
                    className={`w-6 h-6 rounded text-xs flex items-center justify-center
                      ${sIndex === currentSection && qIndex === currentQuestion
                        ? 'bg-primary text-primary-foreground'
                        : getAnswerStatus(sIndex, qIndex) === 'answered'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {qIndex + 1}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-background border-r border-border flex flex-col">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-semibold">Exam Navigation</h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-muted-foreground hover:text-foreground"
        >
          ←
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {exam.sections.map((section, sIndex) => (
          <div key={sIndex} className="mb-6">
            <h3 className="font-medium text-foreground mb-2">{section.title}</h3>
            <div className="grid grid-cols-5 gap-2">
              {section.questions.map((_, qIndex) => (
                <button
                  key={qIndex}
                  onClick={() => onQuestionSelect(sIndex, qIndex)}
                  className={`w-8 h-8 rounded flex items-center justify-center
                    ${sIndex === currentSection && qIndex === currentQuestion
                      ? 'bg-primary text-primary-foreground'
                      : getAnswerStatus(sIndex, qIndex) === 'answered'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                >
                  {qIndex + 1}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 bg-primary rounded mr-2"></div>
          <span className="text-sm">Current Question</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 bg-primary/20 rounded mr-2 border border-primary/30"></div>
          <span className="text-sm">Answered</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-muted rounded mr-2 border border-border"></div>
          <span className="text-sm">Unanswered</span>
        </div>
      </div>
    </div>
  );
};

export default ExamSidebar;
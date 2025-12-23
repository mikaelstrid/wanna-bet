import type { Question } from '../types';
import './QuestionDisplay.css';

interface QuestionDisplayProps {
  question: Question;
  answererName: string;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export default function QuestionDisplay({ 
  question, 
  answererName, 
  onCorrect, 
  onIncorrect 
}: QuestionDisplayProps) {
  return (
    <div className="question-display">
      <div className="question-display-content">
        <div className="question-card">
          <div className="answerer-info">
            <span className="answerer-label">Svarar:</span>
            <span className="answerer-name">{answererName}</span>
          </div>
          
          <div className="question-section">
            <h3 className="question-label">Fråga:</h3>
            <p className="question-text">{question.question}</p>
          </div>
          
          <div className="answer-section">
            <h3 className="answer-label">Svar:</h3>
            <p className="answer-text">{question.answer}</p>
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="btn-correct" onClick={onCorrect}>
            ✓ Rätt
          </button>
          <button className="btn-incorrect" onClick={onIncorrect}>
            ✗ Fel
          </button>
        </div>
      </div>
    </div>
  );
}

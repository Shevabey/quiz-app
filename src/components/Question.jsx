import React from 'react';

export default function Question({ 
  question, 
  onAnswer, 
  questionNumber, 
  totalQuestions 
}) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <span className="badge badge-primary">Question {questionNumber} of {totalQuestions}</span>
          <span className="badge badge-secondary">{question.difficulty}</span>
        </div>
        
        <h2 className="card-title text-center mb-6" 
            dangerouslySetInnerHTML={{ __html: question.question }}></h2>
        
        <div className="grid grid-cols-1 gap-3">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              className="btn btn-outline"
              onClick={() => onAnswer(answer)}
              dangerouslySetInnerHTML={{ __html: answer }}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}

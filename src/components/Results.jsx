import { useState } from 'react';

export default function Results({ username, questions, score, quizHistory, onReset, onLogout }) {
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  
  const currentQuiz = {
    date: new Date().toISOString(),
    score,
    totalQuestions: questions.length,
    questions
  };
  
  // Get the quiz to display (either current or from history)
  const quizToDisplay = selectedQuizId 
    ? quizHistory.find(q => q.id === selectedQuizId) 
    : currentQuiz;
  
  const unanswered = quizToDisplay.questions.filter(q => !q.userAnswer).length;
  const incorrect = quizToDisplay.questions.length - quizToDisplay.score - unanswered;
  
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title text-2xl mb-6">Quiz Results for {username}</h2>
          <button 
            onClick={onLogout}
            className="btn btn-sm btn-outline btn-error"
          >
            Logout
          </button>
        </div>
        
        {/* Quiz History Selector */}
        {quizHistory.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-2">Quiz History</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedQuizId(null)}
                className={`btn btn-sm ${!selectedQuizId ? 'btn-primary' : 'btn-outline'}`}
              >
                Current Quiz
              </button>
              
              {quizHistory.map((quiz, index) => (
                <button 
                  key={quiz.id || index}
                  onClick={() => setSelectedQuizId(quiz.id)}
                  className={`btn btn-sm ${selectedQuizId === quiz.id ? 'btn-primary' : 'btn-outline'}`}
                >
                  Attempt {index + 1} - {new Date(quiz.date).toLocaleDateString()} 
                  ({quiz.score}/{quiz.totalQuestions})
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Score Summary */}
        <div className="stats shadow mb-6">
          <div className="stat">
            <div className="stat-title">Score</div>
            <div className="stat-value text-primary">{quizToDisplay.score}/{quizToDisplay.questions.length}</div>
            <div className="stat-desc">
              {Math.round((quizToDisplay.score / quizToDisplay.questions.length) * 100)}% correct
            </div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Correct</div>
            <div className="stat-value text-success">{quizToDisplay.score}</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Incorrect</div>
            <div className="stat-value text-error">{incorrect}</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Unanswered</div>
            <div className="stat-value text-warning">{unanswered}</div>
          </div>
        </div>
        
        {/* Start New Quiz Button */}
        {!selectedQuizId && (
          <div className="flex justify-center mb-6">
            <button 
              onClick={onReset}
              className="btn btn-primary"
            >
              Start New Quiz
            </button>
          </div>
        )}
        
        {/* Question Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Question Details</h3>
          {quizToDisplay.questions.map((q, index) => (
            <div key={index} className="card bg-base-200">
              <div className="card-body p-4">
                <h3 className="font-bold" dangerouslySetInnerHTML={{ __html: q.question }}></h3>
                <div className="text-sm">
                  <p>
                    <span className="font-semibold">Correct answer: </span>
                    <span className="text-success" dangerouslySetInnerHTML={{ __html: q.correctAnswer }}></span>
                  </p>
                  {q.userAnswer && (
                    <p>
                      <span className="font-semibold">Your answer: </span>
                      <span className={q.userAnswer === q.correctAnswer ? 'text-success' : 'text-error'} 
                            dangerouslySetInnerHTML={{ __html: q.userAnswer }}></span>
                    </p>
                  )}
                  {!q.userAnswer && (
                    <p className="text-warning">You did not answer this question</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

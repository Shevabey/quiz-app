import Question from './Question';
import Timer from './Timer';

export default function Quiz({ 
  currentQuestion, 
  currentQuestionIndex, 
  questions, 
  timeRemaining, 
  onAnswer,
  username,
  onLogout
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">
          <span>Welcome, {username}</span>
        </div>
        <button 
          onClick={onLogout}
          className="btn btn-sm btn-outline btn-error"
        >
          Logout
        </button>
      </div>
      
      <Timer timeRemaining={timeRemaining} />
      
      <Question 
        question={currentQuestion}
        onAnswer={onAnswer}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />
    </div>
  );
}

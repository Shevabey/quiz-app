import { useQuiz } from './hooks/useQuiz';
import Login from './components/Login';
import Quiz from './components/Quiz';
import Results from './components/Results';
import './App.css';

function App() {
  const {
    username,
    questions,
    currentQuestionIndex,
    currentQuestion,
    score,
    timeRemaining,
    quizStatus,
    error,
    startQuiz,
    answerQuestion,
    resetQuiz,
    logout,
  } = useQuiz(10, 300); // 10 questions, 5 minutes

  // console.log('App render - quizStatus:', quizStatus);

  return (
    <div className="min-h-screen bg-base-300">
      {quizStatus === 'login' && (
        <Login onStart={startQuiz} error={error} />
      )}
      
      {quizStatus === 'loading' && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4">Loading quiz questions...</p>
          </div>
        </div>
      )}
      
      {quizStatus === 'active' && currentQuestion && (
        <Quiz
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          questions={questions}
          timeRemaining={timeRemaining}
          onAnswer={answerQuestion}
          username={username}
          onLogout={logout}
        />
      )}
      
      {quizStatus === 'completed' && (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Results
            username={username}
            questions={questions}
            score={score}
            onReset={resetQuiz}
            onLogout={logout}
          />
        </div>
      )}
    </div>
  );
}

export default App;




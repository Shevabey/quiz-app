import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useQuiz } from "./hooks/useQuiz";
import Login from "./components/Login";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import "./App.css";

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
    quizHistory,
    startQuiz,
    answerQuestion,
    resetQuiz,
    logout,
  } = useQuiz(10, 300); // 10 questions, 5 minutes

  // Custom route protection logic
  const ProtectedQuizRoute = ({ children }) => {
    if (!username) {
      return <Navigate to="/" replace />;
    }

    if (quizStatus !== "active") {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  const ProtectedResultsRoute = ({ children }) => {
    if (!username) {
      return <Navigate to="/" replace />;
    }

    if (quizStatus !== "completed") {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-base-300">
        <Routes>
          <Route
            path="/"
            element={
              username && quizStatus === "active" ? (
                <Navigate to="/quiz" replace />
              ) : username && quizStatus === "completed" ? (
                <Navigate to="/results" replace />
              ) : (
                <Login onStart={startQuiz} error={error} />
              )
            }
          />

          <Route
            path="/quiz"
            element={
              <ProtectedQuizRoute>
                {quizStatus === "loading" ? (
                  <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                      <span className="loading loading-spinner loading-lg"></span>
                      <p className="mt-4">Loading quiz questions...</p>
                    </div>
                  </div>
                ) : (
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
              </ProtectedQuizRoute>
            }
          />

          <Route
            path="/results"
            element={
              <ProtectedResultsRoute>
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                  <Results
                    username={username}
                    questions={questions}
                    score={score}
                    quizHistory={quizHistory}
                    onReset={resetQuiz}
                    onLogout={logout}
                  />
                </div>
              </ProtectedResultsRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

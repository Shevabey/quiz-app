export default function Results({ username, questions, score, onReset, onLogout }) {
  const unanswered = questions.filter(q => q.userAnswer === null).length;
  const incorrect = questions.length - score - unanswered;
  
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
        
        <div className="stats shadow mb-6">
          <div className="stat">
            <div className="stat-title">Score</div>
            <div className="stat-value text-primary">{score} / {questions.length}</div>
            <div className="stat-desc">{Math.round((score / questions.length) * 100)}%</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Correct</div>
            <div className="stat-value text-success">{score}</div>
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
        
        <div className="divider">Question Details</div>
        
        <div className="space-y-4">
          {questions.map((q, index) => (
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
        
        <div className="card-actions justify-center mt-6">
          <button className="btn btn-primary" onClick={onReset}>
            Start New Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

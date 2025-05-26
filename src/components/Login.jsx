import { useState } from 'react';

export default function Login({ onStart, error }) {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() && !isSubmitting) {
      try {
        setIsSubmitting(true);
        await onStart(username);
      } catch (err) {
        console.error('Error in login submit:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Quiz App</h1>
          <p className="py-6">Test your knowledge with our interactive quiz!</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            {error && <div className="text-error text-sm mt-2">{error}</div>}
            <div className="form-control mt-6">
              <button 
                className="btn btn-primary" 
                type="submit"
                disabled={isSubmitting || !username.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Starting...
                  </>
                ) : (
                  'Start Quiz'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

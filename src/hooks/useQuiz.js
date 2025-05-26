import { useState, useEffect } from 'react';
import { fetchQuizQuestions } from '../services/api';
import { saveQuizState, loadQuizState, clearQuizState } from '../utils/storage';

export const useQuiz = (amount = 10, timeLimit = 300) => {
  const [username, setUsername] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [quizStatus, setQuizStatus] = useState('login'); // login, loading, active, completed
  const [error, setError] = useState(null);

  // Load saved state on initial render
  useEffect(() => {
    try {
      const savedState = loadQuizState();
      if (savedState && savedState.quizStatus === 'active') {
        setUsername(savedState.username || '');
        setQuestions(savedState.questions || []);
        setCurrentQuestionIndex(savedState.currentQuestionIndex || 0);
        setScore(savedState.score || 0);
        setTimeRemaining(savedState.timeRemaining || timeLimit);
        setQuizStatus(savedState.quizStatus);
        // console.log('Loaded saved quiz state:', savedState);
      }
    } catch (err) {
      console.error('Error loading saved state:', err);
      clearQuizState(); // Clear potentially corrupted state
    }
  }, [timeLimit]);

  // Save state when it changes
  useEffect(() => {
    if (quizStatus === 'active') {
      try {
        saveQuizState({
          username,
          questions,
          currentQuestionIndex,
          score,
          timeRemaining,
          quizStatus,
        });
      } catch (err) {
        console.error('Error saving quiz state:', err);
      }
    }
  }, [username, questions, currentQuestionIndex, score, timeRemaining, quizStatus]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (quizStatus === 'active' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            setQuizStatus('completed');
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStatus, timeRemaining]);

  const startQuiz = async (name) => {
    try {
      setUsername(name);
      setQuizStatus('loading');
      // console.log('Fetching questions...');
      
      const fetchedQuestions = await fetchQuizQuestions(amount);
      // console.log('Questions fetched:', fetchedQuestions.length);
      
      if (!fetchedQuestions || fetchedQuestions.length === 0) {
        throw new Error('No questions returned from API');
      }
      
      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setTimeRemaining(timeLimit);
      setQuizStatus('active');
      setError(null);
    } catch (err) {
      console.error('Error starting quiz:', err);
      setError(`Failed to load quiz questions: ${err.message}`);
      setQuizStatus('login');
    }
  };

  const answerQuestion = (answer) => {
    if (quizStatus !== 'active') return;

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].userAnswer = answer;

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setQuestions(updatedQuestions);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizStatus('completed');
    }
  };

  const resetQuiz = () => {
    clearQuizState();
    setUsername('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeRemaining(timeLimit);
    setQuizStatus('login');
    setError(null);
  };
  
  const logout = () => {
    // Simpan state saat ini jika quiz sedang aktif
    if (quizStatus === 'active') {
      try {
        saveQuizState({
          username,
          questions,
          currentQuestionIndex,
          score,
          timeRemaining,
          quizStatus,
        });
      } catch (err) {
        console.error('Error saving quiz state during logout:', err);
      }
    }
    
    // Kembali ke halaman login
    setQuizStatus('login');
  };

  return {
    username,
    questions,
    currentQuestionIndex,
    currentQuestion: questions[currentQuestionIndex],
    score,
    timeRemaining,
    quizStatus,
    error,
    startQuiz,
    answerQuestion,
    resetQuiz,
    logout,
  };
};



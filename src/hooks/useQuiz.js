import { useState, useEffect } from 'react';
import { fetchQuizQuestions } from '../services/api';
import { saveQuizState, loadQuizState, clearQuizState, saveQuizHistory, loadQuizHistory, clearUserData } from '../utils/storage';

export const useQuiz = (amount = 10, timeLimit = 300) => {
  const [username, setUsername] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [quizStatus, setQuizStatus] = useState('login');
  const [error, setError] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [currentQuizId, setCurrentQuizId] = useState(null);

  
  useEffect(() => {
    try {
      const savedState = loadQuizState();
      if (savedState && (savedState.quizStatus === 'active' || savedState.quizStatus === 'reloading')) {
        setUsername(savedState.username || '');
        setQuestions(savedState.questions || []);
        setCurrentQuestionIndex(savedState.currentQuestionIndex || 0);
        setScore(savedState.score || 0);
        setTimeRemaining(savedState.timeRemaining || timeLimit);
        setQuizStatus(savedState.quizStatus === 'reloading' ? 'reloading' : 'active');
        setCurrentQuizId(savedState.currentQuizId);
      }
      
      if (savedState && savedState.username) {
        const history = loadQuizHistory(savedState.username);
        if (history) {
          setQuizHistory(history);
        }
      }
    } catch (err) {
      console.error('Error loading saved state:', err);
      clearQuizState();
    }
  }, [timeLimit]);

  
  useEffect(() => {
    if ((quizStatus === 'active' || quizStatus === 'reloading') && username) {
      try {
        saveQuizState({
          username,
          questions,
          currentQuestionIndex,
          score,
          timeRemaining,
          quizStatus,
          currentQuizId
        });
      } catch (err) {
        console.error('Error saving quiz state:', err);
      }
    }
  }, [username, questions, currentQuestionIndex, score, timeRemaining, quizStatus, currentQuizId]);

  
  useEffect(() => {
    let timer;
    if (quizStatus === 'active' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            completeQuiz();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStatus, timeRemaining]);

  const completeQuiz = () => {
    if (quizStatus === 'active' && username) {
      const finalScore = questions.reduce((total, q) => 
        q.userAnswer === q.correctAnswer ? total + 1 : total, 0);
      
      const quizResult = {
        id: currentQuizId,
        date: new Date().toISOString(),
        score: finalScore,
        totalQuestions: questions.length,
        questions: questions.map(q => ({
          question: q.question,
          correctAnswer: q.correctAnswer,
          userAnswer: q.userAnswer,
          isCorrect: q.userAnswer === q.correctAnswer
        }))
      };
      
      const updatedHistory = [...quizHistory, quizResult];
      setQuizHistory(updatedHistory);
      
      saveQuizHistory(username, updatedHistory);
      
      setScore(finalScore);
      setQuizStatus('completed');
    }
  };

  const startQuiz = async (name) => {
    try {
      const existingUser = name === username;
      setUsername(name);
      setQuizStatus('loading');
      
      const newQuizId = `quiz_${Date.now()}`;
      setCurrentQuizId(newQuizId);
      
      if (!existingUser) {
        const history = loadQuizHistory(name);
        if (history) {
          setQuizHistory(history);
        } else {
          setQuizHistory([]);
        }
      }
      
      const fetchedQuestions = await fetchQuizQuestions(amount);
      
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

    setQuestions(updatedQuestions);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      completeQuiz();
    }
  };

  const resetQuiz = async () => {
    try {
      setQuizStatus('reloading');
      
      const newQuizId = `quiz_${Date.now()}`;
      setCurrentQuizId(newQuizId);
      
      const fetchedQuestions = await fetchQuizQuestions(amount);
      
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
      console.error('Error resetting quiz:', err);
      setError(`Failed to load new quiz questions: ${err.message}`);
      setQuizStatus('completed'); 
    }
  };
  
  const logout = () => {
    clearUserData(username);
    setUsername('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeRemaining(timeLimit);
    setQuizStatus('login');
    setError(null);
    setQuizHistory([]);
    setCurrentQuizId(null);
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
    quizHistory,
    currentQuizId,
    startQuiz,
    answerQuestion,
    resetQuiz,
    logout,
  };
};



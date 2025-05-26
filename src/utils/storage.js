const STORAGE_KEY = 'quiz_state';
const HISTORY_PREFIX = 'quiz_history_';

export const saveQuizState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving quiz state to localStorage:', error);
  }
};

export const loadQuizState = () => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.error('Error loading quiz state from localStorage:', error);
    return null;
  }
};

export const clearQuizState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing quiz state from localStorage:', error);
  }
};

export const saveQuizHistory = (username, history) => {
  try {
    if (!username) return;
    localStorage.setItem(`${HISTORY_PREFIX}${username}`, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving quiz history to localStorage:', error);
  }
};

export const loadQuizHistory = (username) => {
  try {
    if (!username) return [];
    const history = localStorage.getItem(`${HISTORY_PREFIX}${username}`);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading quiz history from localStorage:', error);
    return [];
  }
};

export const clearUserData = (username) => {
  try {
    clearQuizState();
    
    if (username) {
      localStorage.removeItem(`${HISTORY_PREFIX}${username}`);
    }
    
  } catch (error) {
    console.error('Error clearing user data from localStorage:', error);
  }
};

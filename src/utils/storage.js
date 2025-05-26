const STORAGE_KEY = 'quiz_state';

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

const API_URL = 'https://opentdb.com/api.php';

const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export const fetchQuizQuestions = async (amount = 10, category = '', difficulty = '') => {
  try {
    let url = `${API_URL}?amount=${amount}`;
    
    if (category) url += `&category=${category}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    
    // console.log('Fetching from URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    // console.log('API response:', data);
    
    if (data.response_code !== 0) {
      throw new Error(`API error code: ${data.response_code}`);
    }
    
    if (!data.results || data.results.length === 0) {
      throw new Error('No questions returned from API');
    }
    
    return data.results.map((question, index) => ({
      id: `${index}-${Date.now()}`,
      question: decodeHTML(question.question),
      correctAnswer: decodeHTML(question.correct_answer),
      answers: [...question.incorrect_answers, question.correct_answer]
        .map(answer => decodeHTML(answer))
        .sort(() => Math.random() - 0.5),
      category: decodeHTML(question.category),
      difficulty: question.difficulty,
      userAnswer: null,
    }));
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error;
  }
};


export const getSessionToken = async () => {
  try {
    const response = await fetch('https://opentdb.com/api_token.php?command=request');
    const data = await response.json();
    
    if (data.response_code !== 0) {
      throw new Error('Failed to get session token');
    }
    
    return data.token;
  } catch (error) {
    console.error('Error getting session token:', error);
    throw error;
  }
};


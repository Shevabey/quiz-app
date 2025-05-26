# Quiz Application

A React-based quiz application that fetches questions from the Open Trivia Database API.

## Features

- User login and logout functionality
- Fetches quiz questions from Open Trivia Database API
- Displays one question at a time
- Shows progress (current question / total questions)
- Timer for quiz duration
- Results page showing correct, incorrect, and unanswered questions
- Resume quiz functionality using local storage
- Session management with logout capability

## Technologies Used

- React 19
- Vite
- DaisyUI / Tailwind CSS
- Open Trivia Database API

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/Shevabey/quiz-app.git
   cd quiz-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## User Flow

1. Enter your username on the login screen
2. Answer quiz questions one by one
3. View your results after completing the quiz
4. Logout at any time to save your progress
5. Resume your quiz later by logging in with the same username

## License

This project is licensed under the MIT License.



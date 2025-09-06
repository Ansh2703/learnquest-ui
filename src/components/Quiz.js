import React, { useState } from 'react';

function Quiz({ lesson, onComplete }) {
  // Parse the quiz questions from the lesson's content
  const quizData = JSON.parse(lesson.content);
  // State to track which question the user is currently on
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // State to store the user's answers
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // State to show the final result after submission
  const [quizResult, setQuizResult] = useState(null);

  // Function to handle when a user selects an answer
  const handleAnswerSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: option });
  };

  // Function to move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Function to submit the final answers to the parent component
  const handleSubmitQuiz = () => {
    const answersArray = quizData.questions.map((_, index) => selectedAnswers[index] || null);
    onComplete(lesson.id, answersArray);
    setQuizResult({ message: "Quiz submitted! Your results are being calculated." });
  };

  // If the user has already completed this quiz, show a message.
  if (lesson.isCompleted) {
    return <div className="bg-emerald-900 text-emerald-300 p-4 rounded-lg text-center">You have already completed this quiz.</div>;
  }
  
  // Show a message after the quiz is submitted.
  if (quizResult) {
    return <div className="text-center p-4 text-gray-300">{quizResult.message}</div>;
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-400">Question {currentQuestionIndex + 1} of {quizData.questions.length}</p>
        <h3 className="text-xl font-semibold text-gray-100 mt-1">{currentQuestion.question}</h3>
      </div>
      <div className="space-y-3">
        {currentQuestion.options.map((option) => (
          <button 
            key={option} 
            onClick={() => handleAnswerSelect(option)} 
            className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${selectedAnswers[currentQuestionIndex] === option ? 'bg-emerald-800 border-emerald-500' : 'bg-gray-700 border-gray-600 hover:border-emerald-600'}`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        {isLastQuestion ? (
          <button 
            onClick={handleSubmitQuiz} 
            disabled={!selectedAnswers[currentQuestionIndex]} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            onClick={handleNextQuestion} 
            disabled={!selectedAnswers[currentQuestionIndex]} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;


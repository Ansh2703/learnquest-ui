import React, { useState } from 'react';
import axios from 'axios';

// The Quiz component receives the lesson data and an 'onComplete' function from its parent.
function Quiz({ lesson, onComplete }) {
  // We parse the quiz questions from the lesson's content string.
  const quizData = JSON.parse(lesson.content);
  const questions = quizData.questions;

  // State to hold the user's answers, the final result, and submission status.
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // This function updates the state when a user selects an option.
  const handleOptionChange = (questionIndex, option) => {
    if (submitted) return; // Don't allow changes after submitting.
    
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = option;
    setUserAnswers(newAnswers);
  };

  // This function handles the submission of the quiz.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Lock the form.

    const token = localStorage.getItem('learnquest_token');
    try {
      // We send the answers to our backend's progress endpoint.
      const response = await axios.post(
        'http://localhost:5000/api/users/progress',
        { lessonId: lesson.id, answers: userAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // We store the result from the backend (score, passed/failed).
      setResult(response.data.quizResult);

      // If the quiz was passed and points were awarded, we call the parent's
      // onComplete function to let it know it should refresh the course data.
      if (response.data.pointsAwarded > 0) {
        onComplete();
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      if (error.response && error.response.data) {
        setResult({ passed: false, message: error.response.data.message });
      }
    }
  };
  
  // A small helper component to display the final result card.
  const ResultDisplay = () => {
    if (!result) return null;
    return (
      <div className={`p-4 rounded-md mt-6 ${result.passed ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} border-l-4`}>
        <h3 className={`font-bold ${result.passed ? 'text-green-800' : 'text-red-800'}`}>
          {result.passed ? 'Quiz Passed!' : 'Quiz Failed'}
        </h3>
        <p className={`${result.passed ? 'text-green-700' : 'text-red-700'}`}>
          You scored {result.correctAnswers} out of {result.totalQuestions}.
          {result.passed ? ' You earned 100 points!' : ' You need at least 50% to pass.'}
        </p>
      </div>
    );
  };

  // If the user has already completed this lesson, we show a simple message.
  if (lesson.isCompleted) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <p className="font-semibold text-green-700">You have already completed this quiz.</p>
      </div>
    );
  }

  // This is the main JSX for the quiz form.
  return (
    <div>
      <p className="text-slate-600 mb-6">
        Test your knowledge! You need a score of 50% or higher to pass this quiz and earn points.
      </p>
      <form onSubmit={handleSubmit}>
        {questions.map((q, index) => (
          <div key={index} className="mb-6 p-4 border border-slate-200 rounded-lg">
            <p className="font-semibold text-slate-800 mb-3">{index + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center p-2 rounded-md hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={userAnswers[index] === option}
                    onChange={() => handleOptionChange(index, option)}
                    disabled={submitted}
                    className="mr-3 h-4 w-4"
                  />
                  {/* After submission, we highlight the correct answer in green. */}
                  <span className={submitted && q.answer === option ? 'text-green-600 font-bold' : ''}>
                    {option}
                  </span>
                  {/* And if the user chose the wrong answer, we mark it. */}
                  {submitted && userAnswers[index] === option && q.answer !== option && (
                    <span className="ml-3 text-red-600 font-bold">(Your Answer)</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}

        {!submitted && (
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Submit Quiz
          </button>
        )}
      </form>

      {/* The result card will appear here after submission. */}
      {submitted && <ResultDisplay />}
    </div>
  );
}

export default Quiz;
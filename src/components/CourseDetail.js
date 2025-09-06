import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Quiz from './Quiz'; 

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [message, setMessage] = useState(''); 

  const fetchCourseDetails = useCallback(() => {
    const token = localStorage.getItem('learnquest_token');
    if (!token) return;

    axios.get(`http://localhost:5000/api/courses/${courseId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      setCourse(response.data);
      // If a lesson is already selected (e.g., after completing one), keep it selected.
      // Otherwise, default to the first lesson.
      if (!selectedLesson && response.data.Lessons.length > 0) {
        setSelectedLesson(response.data.Lessons[0]);
      }
    })
    .catch(error => console.error('Error fetching course details:', error));
  }, [courseId, selectedLesson]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const handleLessonComplete = () => {
    setMessage('Lesson completed! You earned points!');
    fetchCourseDetails(); 
    setTimeout(() => setMessage(''), 4000); 
  };
  
  const handleProgressUpdate = async (lessonId, answers = null) => {
    const token = localStorage.getItem('learnquest_token');
    try {
      await axios.post('http://localhost:5000/api/users/progress', 
        { lessonId, answers },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      handleLessonComplete();
    } catch (error) {
      console.error('Error updating progress:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  // Sub-component for Video Lessons
  const VideoLesson = ({ lesson }) => {
    const videoData = JSON.parse(lesson.content);
    return (
      <div>
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <iframe 
            src={`https://www.youtube.com/embed/${videoData.videoId}`} 
            title={lesson.title} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full h-full rounded-lg shadow-lg aspect-video"
          ></iframe>
        </div>
        <p className="text-gray-400 mb-6 leading-relaxed">{videoData.description}</p>
        {!lesson.isCompleted && (
          <button onClick={() => handleProgressUpdate(lesson.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">Mark as Complete</button>
        )}
      </div>
    );
  };
  
  // --- NEW: Sub-component for Text-Based Lessons ---
  const TextLesson = ({ lesson }) => {
    const textData = JSON.parse(lesson.content);
    return (
      <div>
        <p className="text-gray-300 leading-relaxed whitespace-pre-line mb-6">{textData.text}</p>
        {!lesson.isCompleted && (
          <button onClick={() => handleProgressUpdate(lesson.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">Mark as Complete</button>
        )}
      </div>
    );
  };


  if (!course) {
    return <p className="text-center text-gray-400">Loading course...</p>;
  }

  return (
    <div>
      <Link to="/courses" className="text-emerald-400 hover:underline mb-6 block text-sm">&larr; Back to All Courses</Link>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Column: Lesson List */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">{course.title}</h2>
          <div className="space-y-2">
            {course.Lessons.map(lesson => (
              <button 
                key={lesson.id} 
                onClick={() => setSelectedLesson(lesson)}
                // --- FIX: Improved styling for better visibility in dark mode ---
                className={`w-full text-left p-3 rounded-md transition-colors duration-200 flex items-center text-sm ${selectedLesson?.id === lesson.id ? 'bg-emerald-900 text-emerald-300 font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {lesson.isCompleted && <span className="text-emerald-400 font-bold mr-2">✓</span>}
                {lesson.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Lesson Content */}
        <div className="md:col-span-3 bg-gray-800 p-6 rounded-lg shadow-lg">
          {message && <div className="bg-emerald-900 text-emerald-300 p-3 rounded-md mb-4 text-sm">{message}</div>}
          
          {selectedLesson ? (
            <div>
              <h1 className="text-3xl font-bold text-gray-100 mb-4">{selectedLesson.title}</h1>
              {selectedLesson.lessonType === 'video' && <VideoLesson lesson={selectedLesson} />}
              {selectedLesson.lessonType === 'text' && <TextLesson lesson={selectedLesson} />}
              {selectedLesson.lessonType === 'quiz' && <Quiz lesson={selectedLesson} onComplete={handleLessonComplete} />}
            </div>
          ) : (
            <p>Select a lesson to begin.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;


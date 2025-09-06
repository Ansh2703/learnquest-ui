import React, { useState, useEffect } from 'react';
import axios from 'axios';
// --- NEW: We need the Link component to create clickable links ---
import { Link } from 'react-router-dom';

function CourseList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Oh no! There was an error fetching the courses:', error);
      });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">Available Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map(course => (
          // --- NEW: We're wrapping our card in a Link component ---
          // The 'to' prop tells the router where to go.
          // For a course with id=1, this will create a link to '/course/1'.
          <Link to={`/course/${course.id}`} key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
            <p className="text-slate-600">{course.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CourseList;
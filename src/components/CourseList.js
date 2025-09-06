import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CourseList() {
  // State to hold the list of courses fetched from the backend
  const [courses, setCourses] = useState([]);
  // State to manage the loading message
  const [loading, setLoading] = useState(true);

  // This effect runs once when the component loads to fetch the course data.
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // We call the '/api/courses' endpoint on our live backend server.
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        // We set loading to false whether the request succeeded or failed.
        setLoading(false);
      }
    };
    fetchCourses();
  }, []); // The empty array ensures this runs only once.

  // Display a loading message while the data is being fetched.
  if (loading) {
    return <div className="text-center p-10 text-gray-400">Loading courses...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">All Courses</h1>
        <p className="text-gray-400">Browse our library of available courses to start learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* We first check if the 'courses' array has items before trying to display them. */}
        {courses.length > 0 ? (
          // If there are courses, we map over them and create a card for each one.
          courses.map(course => (
            <Link 
              to={`/course/${course.id}`} 
              key={course.id} 
              className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:border-emerald-500 border-2 border-transparent transition-all duration-300 block"
            >
              <h3 className="text-xl font-semibold text-gray-100 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-400">{course.description}</p>
            </Link>
          ))
        ) : (
          // If the 'courses' array is empty, we display this helpful message.
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-800 p-8 rounded-lg shadow-md text-center text-gray-400">
            <p>No courses have been added yet. Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseList;


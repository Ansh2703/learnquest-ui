import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch data from the live backend URL
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

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
        {courses.map(course => (
          <Link 
            to={`/course/${course.id}`} 
            key={course.id} 
            className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:border-emerald-500 border-2 border-transparent transition-all duration-300 block"
          >
            <h3 className="text-xl font-semibold text-gray-100 mb-2">{course.title}</h3>
            <p className="text-sm text-gray-400">{course.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CourseList;


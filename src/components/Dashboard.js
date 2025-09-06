import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StatCard = ({ value, label }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center transition-transform transform hover:-translate-y-1">
        <p className="text-4xl font-bold text-emerald-400">{value}</p>
        <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
);

const CourseProgressCard = ({ course }) => (
    <Link to={`/course/${course.id}`} className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:border-emerald-500 border-2 border-transparent transition-all duration-300 block">
        <h4 className="font-semibold text-gray-100 mb-2">{course.title}</h4>
        <p className="text-sm text-gray-400 mb-4">{course.description}</p>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
        </div>
        <p className="text-right text-xs text-gray-500 mt-2">{course.progress}% Complete</p>
    </Link>
);

function Dashboard({ user }) {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('learnquest_token');
            if (token) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/dashboard`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setDashboardData(response.data);
                } catch (error) {
                    console.error('Error fetching dashboard data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); // If no token, stop loading
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center p-10 text-gray-400">Loading your dashboard...</div>;
    if (!dashboardData) return <div className="text-center p-10 text-red-500">Could not load dashboard data.</div>;

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-gray-100">Welcome back, {user?.username}!</h1>
                <p className="text-gray-400">Let's continue your learning journey.</p>
            </div>
            <section>
                <h2 className="text-xl font-semibold text-gray-300 mb-4">Your Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard value={dashboardData.totalPoints} label="Total Points" />
                    <StatCard value={dashboardData.lessonsCompleted} label="Lessons Completed" />
                    <StatCard value={dashboardData.badgesEarned} label="Badges Earned" />
                </div>
            </section>
            <section>
                <h2 className="text-xl font-semibold text-gray-300 mb-4">Continue Learning</h2>
                {/* We check if the courses array has items before trying to map over it. */}
                {dashboardData.courses && dashboardData.courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dashboardData.courses.map(course => <CourseProgressCard key={course.id} course={course} />)}
                    </div>
                ) : (
                    // If the array is empty, we show this helpful message.
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center text-gray-400">
                        <p>No courses available yet. Check back soon!</p>
                    </div>
                )}
            </section>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">Upcoming Courses</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>Advanced CSS with Tailwind</li>
                        <li>Full-Stack TypeScript</li>
                        <li>Introduction to Docker</li>
                    </ul>
                 </div>
                 <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">What do you want to learn next?</h3>
                    <p className="text-sm text-gray-400 mb-4">Let us know what courses you'd like to see on LearnQuest!</p>
                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors">Request a Course</button>
                 </div>
            </section>
            <footer className="text-center text-sm text-gray-500 pt-6">
                <p>&copy; {new Date().getFullYear()} LearnQuest. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-US');
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'bg-emerald-900 text-emerald-300 font-bold'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white font-medium';

  return (
    <div className="bg-gray-800 w-64 h-screen flex flex-col p-4 shadow-lg fixed top-0 left-0 border-r border-gray-700">
      <div className="mb-8">
        <Link to="/">
          <h1 className="text-2xl font-bold text-emerald-400 text-center">LearnQuest</h1>
        </Link>
        <p className="text-xs text-gray-500 text-center mt-2">{formatDateTime(currentDateTime)}</p>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          <li><NavLink to="/" end className={`flex items-center p-3 rounded-lg text-sm ${navLinkClass}`}>Dashboard</NavLink></li>
          <li><NavLink to="/courses" className={`flex items-center p-3 rounded-lg text-sm ${navLinkClass}`}>All Courses</NavLink></li>
          <li><NavLink to="/leaderboard" className={`flex items-center p-3 rounded-lg text-sm ${navLinkClass}`}>Leaderboard</NavLink></li>
        </ul>
      </nav>
      <div className="mt-auto">
        {user && (
          <div className="flex items-center mb-4 p-2 rounded-lg hover:bg-gray-700">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mr-3">{user.username.charAt(0).toUpperCase()}</div>
            <div>
              <p className="font-semibold text-gray-200 text-sm">{user.username}</p>
              <Link to="/profile" className="text-xs text-gray-400 hover:underline">View Profile</Link>
            </div>
          </div>
        )}
        <button onClick={onLogout} className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg text-sm">Logout</button>
      </div>
    </div>
  );
}

export default Navbar;


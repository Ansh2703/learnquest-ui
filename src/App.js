import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Importing all our page and layout components
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';

function App() {
  const [token, setToken] = useState(localStorage.getItem('learnquest_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        handleLogout();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const handleLoginSuccess = (receivedToken) => {
    localStorage.setItem('learnquest_token', receivedToken);
    setToken(receivedToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('learnquest_token');
    setToken(null);
  };

  if (!token) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <Router>
      <div className="bg-gray-900 text-gray-200 min-h-screen flex">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-1 pl-64">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/course/:courseId" element={<CourseDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;


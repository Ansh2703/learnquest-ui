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
    // When the token changes (on login/logout), decode it to get user info.
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        // If the token is invalid or expired, log the user out.
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

  // If there's no token, we show the full-screen login page.
  if (!token) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // If the user IS logged in, we show the main app layout.
  return (
    <Router>
      <div className="bg-gray-900 text-gray-200 min-h-screen flex">
        {/* The persistent sidebar navigation */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* The main content area that will change based on the URL */}
        <main className="flex-1 pl-64">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/course/:courseId" element={<CourseDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              {/* Any other URL will redirect back to the dashboard */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;


import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  // State variables to hold the form input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Only for registration
  
  // A state to toggle between the Login and Register views
  const [isRegistering, setIsRegistering] = useState(false);
  
  // A state to display any success or error messages to the user
  const [message, setMessage] = useState('');

  // This function handles the form submission when the user tries to log in.
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the form from causing a page reload
    setMessage(''); // Clear any previous messages
    try {
      // We send the email and password to our live backend's login endpoint.
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });
      // If successful, we call the onLoginSuccess function passed down from App.js.
      onLoginSuccess(response.data.token);
    } catch (error) {
      // If there's an error, we display the message from the backend.
      setMessage(error.response?.data?.message || 'Login failed!');
    }
  };

  // This function handles the form submission when a new user registers.
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // We send the new user's details to our live backend's register endpoint.
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });
      setMessage('Registration successful! Please log in.');
      setIsRegistering(false); // Switch the form back to the login view
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed!');
    }
  };

  return (
    // This is the main container for the form, styled for the dark theme.
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
      <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">
        {isRegistering ? 'Create Your Account' : 'Welcome to LearnQuest'}
      </h2>
      
      {/* The form calls the correct handler based on whether we're logging in or registering. */}
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        {/* The username field is only shown when isRegistering is true. */}
        {isRegistering && (
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
        </div>
        
        {/* This is where we display any error or success messages. */}
        {message && <p className="text-center text-red-400 text-xs mb-4">{message}</p>}
        
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
          <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="inline-block align-baseline font-bold text-sm text-emerald-400 hover:text-emerald-300">
            {isRegistering ? 'Have an account? Login' : "Need an account? Register"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;


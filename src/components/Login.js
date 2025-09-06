import React, { useState } from 'react';
import axios from 'axios';

// --- NEW: We're accepting a new 'prop' called onLoginSuccess ---
// This will be a function passed down from our App.js component.
function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      
      // --- NEW: Instead of just logging the token, we call the function! ---
      // This sends the token back up to our main App component.
      onLoginSuccess(response.data.token);

    } catch (error) {
      console.error('Login error:', error.response?.data?.message);
      setMessage(error.response?.data?.message || 'Login failed!');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });
      setMessage('Registration successful! Please log in.');
      setIsRegistering(false); 
      // Clear the form for the login view
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message);
      setMessage(error.response?.data?.message || 'Registration failed!');
    }
  };

  // The JSX for the form remains exactly the same.
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
        {isRegistering ? 'Create Account' : 'Welcome Back!'}
      </h2>
      
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        {isRegistering && (
          <div className="mb-4">
            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {message && <p className="text-center text-red-500 text-xs mb-4">{message}</p>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
          
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            {isRegistering ? 'Have an account? Login' : "Need an account? Register"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
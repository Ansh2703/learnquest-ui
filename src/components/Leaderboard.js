import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Leaderboard() {
  // A state to hold the list of ranked users
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // This effect runs once when the component loads to fetch the leaderboard data.
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`);
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []); // The empty array ensures this runs only once.

  if (loading) {
    return <div className="text-center p-10 text-gray-400">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <Link to="/" className="text-emerald-400 hover:underline text-sm">&larr; Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-gray-100 mt-2">Leaderboard</h1>
        <p className="text-gray-400">See how you stack up against other learners!</p>
      </div>

      {/* The main container for the leaderboard table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <table className="w-full text-left">
          {/* Table Header */}
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-300 w-1/6">Rank</th>
              <th className="p-4 text-sm font-semibold text-gray-300 w-3/6">Username</th>
              <th className="p-4 text-sm font-semibold text-gray-300 w-2/6">Points</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user.username} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors">
                <td className="p-4 font-bold text-gray-200 text-lg">{index + 1}</td>
                <td className="p-4 text-gray-300">{user.username}</td>
                <td className="p-4 font-semibold text-emerald-400">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;


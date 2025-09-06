import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Leaderboard() {
  // We need a place to store our list of ranked users.
  const [leaderboard, setLeaderboard] = useState([]);

  // This effect will run once to fetch the data from our backend.
  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then(response => {
        setLeaderboard(response.data);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
      });
  }, []);

  return (
    <div>
      <Link to="/" className="text-blue-500 hover:underline mb-6 block">&larr; Back to Dashboard</Link>
      
      <h1 className="text-4xl font-bold text-slate-800 mb-6">Leaderboard</h1>

      <div className="bg-white rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b-2 border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Rank</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Username</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user.username} className="border-b border-slate-200 last:border-b-0">
                <td className="p-4 font-bold text-slate-700">{index + 1}</td>
                <td className="p-4 text-slate-800">{user.username}</td>
                <td className="p-4 font-semibold text-blue-600">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;


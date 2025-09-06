import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// A helper component for displaying a single badge with an attractive design
const BadgeCard = ({ badge }) => (
    <div className="bg-gray-700 p-4 rounded-lg flex items-center transition-all duration-300 hover:bg-gray-600 hover:shadow-lg transform hover:-translate-y-1">
        <div className="text-4xl mr-5">
            {badge.icon === 'react' && '⚛️'}
            {badge.icon === 'node' && '🚀'}
            {badge.icon === 'quiz' && '💡'}
        </div>
        <div>
            <h4 className="font-bold text-gray-100">{badge.name}</h4>
            <p className="text-sm text-gray-400">{badge.description}</p>
        </div>
    </div>
);

function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('learnquest_token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/api/users/profile', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setProfileData(response.data);
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProfileData();
    }, []);

    if (loading) {
        return <div className="text-center p-10 text-gray-400">Loading your profile...</div>;
    }

    if (!profileData) {
        return <div className="text-center p-10 text-red-500">Could not load profile data.</div>;
    }

    return (
        <div className="space-y-10">
            {/* Profile Header */}
            <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center text-5xl font-bold shadow-lg ring-4 ring-gray-700">
                    {profileData.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-gray-100">{profileData.username}</h1>
                    <p className="text-gray-400">{profileData.email}</p>
                </div>
            </div>

            {/* User Details & Stats Section */}
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-3">Account Stats</h2>
                <div className="grid grid-cols-2 gap-6 text-center mt-4">
                    <div>
                        <p className="text-3xl font-bold text-emerald-400">{profileData.points}</p>
                        <p className="text-sm text-gray-400">Total Points</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-emerald-400">{profileData.Badges.length}</p>
                        <p className="text-sm text-gray-400">Badges Earned</p>
                    </div>
                </div>
            </section>

            {/* Badges Section */}
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-3">Your Badges</h2>
                {profileData.Badges && profileData.Badges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData.Badges.map(badge => (
                            <BadgeCard key={badge.name} badge={badge} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">You haven't earned any badges yet. Keep learning to unlock them!</p>
                )}
            </section>
        </div>
    );
}

export default Profile;


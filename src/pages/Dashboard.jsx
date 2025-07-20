import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const icons = {
  users: '👥',
  students: '🎓',
  startups: '🚀',
  applications: '📄',
  messages: '💬',
  events: '📅',
  reviews: '⭐',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const adminName = localStorage.getItem('userName');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get('/auth/users'),
      API.get('/students'),
      API.get('/startups'),
      API.get('/applications'),
      API.get('/messages'),
      API.get('/events'),
      API.get('/reviews'),
    ])
      .then(([users, students, startups, applications, messages, events, reviews]) => {
        setStats({
          users: users.data.length,
          students: students.data.length,
          startups: startups.data.length,
          applications: applications.data.length,
          messages: messages.data.length,
          events: events.data.length,
          reviews: reviews.data.length,
        });
      })
      .catch(err => setError(err.response?.data?.error || 'Error fetching dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { key: 'users', label: 'Users', link: '/students', icon: icons.users },
    { key: 'students', label: 'Students', link: '/students', icon: icons.students },
    { key: 'startups', label: 'Startups', link: '/startups', icon: icons.startups },
    { key: 'applications', label: 'Applications', link: '/applications', icon: icons.applications },
    { key: 'messages', label: 'Messages', link: '/messages', icon: icons.messages },
    { key: 'events', label: 'Events', link: '/events', icon: icons.events },
    { key: 'reviews', label: 'Reviews', link: '/reviews', icon: icons.reviews },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Admin Dashboard</h2>
        <p className="text-lg text-gray-700 mb-6">Welcome, <span className="font-bold text-blue-700">{adminName}</span>! Manage all features and view platform stats below.</p>
        {loading && <div className="text-center text-gray-500 py-8">Loading stats...</div>}
        {error && <div className="text-center text-red-500 mb-4">{error}</div>}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cards.map(card => (
              <div
                key={card.key}
                onClick={() => navigate(card.link)}
                className="bg-blue-50 rounded-lg p-6 cursor-pointer hover:bg-blue-100 shadow group transition flex flex-col items-center justify-center"
                tabIndex={0}
                role="button"
                aria-label={`Go to ${card.label}`}
              >
                <div className="text-4xl mb-2">{card.icon}</div>
                <div className="text-2xl font-bold text-blue-700 mb-1">{card.label}</div>
                <div className="text-gray-600 text-lg">{stats[card.key]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
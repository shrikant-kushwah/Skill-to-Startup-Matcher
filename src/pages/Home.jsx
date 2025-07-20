import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const features = [
  { icon: '🎓', title: 'Students', desc: 'Showcase your skills, interests, and find the perfect startup match.' },
  { icon: '🚀', title: 'Startups', desc: 'Find talented students to join your team and grow your venture.' },
  { icon: '📄', title: 'Applications', desc: 'Apply to exciting opportunities or manage incoming applications.' },
  { icon: '💬', title: 'Messaging', desc: 'Connect and communicate securely with other users.' },
  { icon: '📅', title: 'Events', desc: 'Discover and join startup events, hackathons, and more.' },
  { icon: '⭐', title: 'Reviews', desc: 'Build your reputation with reviews and feedback.' },
];

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
    setUserRole(localStorage.getItem('userRole') || '');
  }, []);

  const handleCTA = () => {
    if (!loggedIn) navigate('/login');
    else navigate(userRole === 'admin' ? '/dashboard' : '/students');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-700 mb-4 drop-shadow">Skill-to-Startup Matcher</h1>
        <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">Connecting talented students with innovative startups. Discover, connect, and build the future together!</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {!loggedIn ? (
            <>
              <Link to="/login" className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition">Login</Link>
              <Link to="/register" className="px-6 py-3 bg-white border border-blue-700 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-50 transition">Register</Link>
            </>
          ) : (
            <button onClick={handleCTA} className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition">
              {userRole === 'admin' ? 'Go to Dashboard' : 'Go to Students'}
            </button>
          )}
        </div>
        <img src="/vite.svg" alt="App logo" className="w-24 h-24 mx-auto mb-6" />
      </header>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">Platform Features</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
          {features.map(f => (
            <div key={f.title} className="bg-blue-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
              <div className="text-4xl mb-2">{f.icon}</div>
              <div className="text-xl font-bold text-blue-700 mb-1">{f.title}</div>
              <div className="text-gray-600 text-center">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About/Footer Section */}
      <footer className="mt-auto py-8 bg-blue-700 text-white text-center">
        <div className="mb-2 font-semibold">Skill-to-Startup Matcher &copy; {new Date().getFullYear()}</div>
        <div className="mb-2">Made with ❤️ for students & startups</div>
        <div className="flex justify-center gap-4 text-lg">
          <a href="mailto:contact@skillmatcher.com" className="hover:underline">Contact</a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
          <a href="#about" className="hover:underline">About</a>
        </div>
      </footer>
    </div>
  );
} 
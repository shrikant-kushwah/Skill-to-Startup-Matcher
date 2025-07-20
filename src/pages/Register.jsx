import { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    API.post('/auth/register', form)
      .then(res => API.post('/auth/login', { email: form.email, password: form.password }))
      .then(res => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.user.id);
        localStorage.setItem('userName', res.data.user.name);
        localStorage.setItem('userEmail', res.data.user.email);
        localStorage.setItem('userRole', res.data.user.role);
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/students'), 1200);
      })
      .catch(err => setError(err.response?.data?.error || 'Register failed'))
      .finally(() => setLoading(false));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs border border-blue-100">
        {/* Logo/Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 mb-1 flex items-center justify-center rounded-full bg-blue-100">
            <span className="text-xl text-blue-700 font-bold">S</span>
          </div>
          <h2 className="text-lg font-extrabold text-blue-700 tracking-tight">Register for SkillMatch</h2>
        </div>
        {error && <div className="text-red-500 text-center mb-3 text-xs">{error}</div>}
        {success && <div className="text-green-600 text-center mb-3 text-xs animate-pulse">{success}</div>}
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full border rounded px-2 py-1 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" autoFocus />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full border rounded px-2 py-1 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required className="w-full border rounded px-2 py-1 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-2 py-1 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="student">Student</option>
          <option value="startup">Startup</option>
        </select>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700 transition font-semibold shadow text-sm">
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div className="text-center mt-4 text-gray-500 text-xs">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
        </div>
      </form>
    </div>
  );
} 
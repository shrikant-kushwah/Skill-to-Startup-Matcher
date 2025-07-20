import { useEffect, useState } from 'react';
import API from '../api';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ to: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  // Simulate logged-in user (replace with real user ID from auth in production)
  const loggedInUserId = localStorage.getItem('userId') || 'PLACEHOLDER_USER_ID';

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get('/messages'),
      API.get('/auth/users')
    ])
      .then(([msgRes, usersRes]) => {
        setMessages(msgRes.data);
        setUsers(usersRes.data);
      })
      .catch(err => setError(err.response?.data?.error || 'Error fetching messages'))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openEdit(msg) {
    setEditId(msg._id);
    setForm({
      to: msg.to,
      content: msg.content
    });
    setShowModal(true);
  }

  function handleAdd(e) {
    e.preventDefault();
    setError('');
    if (!form.content.trim()) {
      setError('Message cannot be empty');
      return;
    }
    if (editId) {
      API.put(`/messages/${editId}`, { from: loggedInUserId, ...form })
        .then(res => {
          setMessages(prev => prev.map(m => m._id === editId ? res.data : m));
          setSuccess('Message updated!');
          setTimeout(() => setSuccess(''), 1500);
          setShowModal(false);
          setEditId(null);
          setForm({ to: '', content: '' });
        })
        .catch(err => setError(err.response?.data?.error || 'Error updating message'));
    } else {
      API.post('/messages', { from: loggedInUserId, ...form })
        .then(res => {
          setMessages(prev => [...prev, res.data]);
          setSuccess('Message sent!');
          setTimeout(() => setSuccess(''), 1500);
          setShowModal(false);
          setForm({ to: '', content: '' });
        })
        .catch(err => setError(err.response?.data?.error || 'Error sending message'));
    }
  }

  function handleDelete(id) {
    API.delete(`/messages/${id}`)
      .then(() => setMessages(prev => prev.filter(m => m._id !== id)))
      .catch(err => setError(err.response?.data?.error || 'Error deleting message'));
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-blue-700">Messages</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Send Message
        </button>
      </div>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      {success && <div className="text-center text-green-600 mb-4 animate-pulse">{success}</div>}
      {!loading && messages.length === 0 && (
        <div className="text-center text-gray-400 py-12">No messages found.</div>
      )}
      <div className="grid gap-6">
        {messages.map(m => (
          <div key={m._id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-800">From: {users.find(u => u._id === m.from)?.name || m.from}</div>
              <div className="text-gray-500">To: {users.find(u => u._id === m.to)?.name || m.to}</div>
              <div className="mt-2 text-gray-700">{m.content}</div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => openEdit(m)}
                className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition"
                aria-label="Edit Message"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(m._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                aria-label="Delete Message"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for sending message */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => { setShowModal(false); setEditId(null); }}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">{editId ? 'Edit Message' : 'Send Message'}</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <select name="to" value={form.to} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">Select Recipient</option>
                {users
                  .filter(u => u._id !== loggedInUserId)
                  .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                  .map(u => (
                    <option key={u._id} value={u._id}>
                      {(u.name || u.email || 'Unknown User') + (u.email ? ` (${u.email})` : '')}
                    </option>
                  ))}
              </select>
              <input name="content" value={form.content} onChange={handleChange} placeholder="Message" required className="w-full border rounded px-3 py-2" />
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
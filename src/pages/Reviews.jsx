import { useEffect, useState } from 'react';
import API from '../api';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ reviewer: '', reviewee: '', rating: '', comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get('/reviews'),
      API.get('/auth/users')
    ])
      .then(([revRes, usersRes]) => {
        setReviews(revRes.data);
        setUsers(usersRes.data);
      })
      .catch(err => setError(err.response?.data?.error || 'Error fetching reviews'))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openEdit(review) {
    setEditId(review._id);
    setForm({
      reviewer: review.reviewer,
      reviewee: review.reviewee,
      rating: review.rating,
      comment: review.comment
    });
    setShowModal(true);
  }

  function handleAdd(e) {
    e.preventDefault();
    setError('');
    if (editId) {
      API.put(`/reviews/${editId}`, form)
        .then(res => {
          setReviews(prev => prev.map(r => r._id === editId ? res.data : r));
          setSuccess('Review updated!');
          setTimeout(() => setSuccess(''), 1500);
          setShowModal(false);
          setEditId(null);
          setForm({ reviewer: '', reviewee: '', rating: '', comment: '' });
        })
        .catch(err => setError(err.response?.data?.error || 'Error updating review'));
    } else {
      API.post('/reviews', form)
        .then(res => {
          setReviews(prev => [...prev, res.data]);
          setSuccess('Review added!');
          setTimeout(() => setSuccess(''), 1500);
          setShowModal(false);
          setForm({ reviewer: '', reviewee: '', rating: '', comment: '' });
        })
        .catch(err => setError(err.response?.data?.error || 'Error adding review'));
    }
  }

  function handleDelete(id) {
    API.delete(`/reviews/${id}`)
      .then(() => {
        setReviews(prev => prev.filter(r => r._id !== id));
        setSuccess('Review deleted!');
        setTimeout(() => setSuccess(''), 1500);
      })
      .catch(err => setError(err.response?.data?.error || 'Error deleting review'));
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-blue-700">Reviews</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Review
        </button>
      </div>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      {success && <div className="text-center text-green-600 mb-4 animate-pulse">{success}</div>}
      {!loading && reviews.length === 0 && <div className="text-center text-gray-400 py-12">No reviews found.</div>}
      <div className="grid gap-6">
        {reviews.map(r => (
          <div key={r._id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-800">Reviewer: {users.find(u => u._id === r.reviewer)?.name || r.reviewer}</div>
              <div className="text-gray-500">Reviewee: {users.find(u => u._id === r.reviewee)?.name || r.reviewee} • Rating: {r.rating}</div>
              <div className="mt-2 text-gray-700">{r.comment}</div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => openEdit(r)}
                className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition"
                aria-label="Edit Review"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(r._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                aria-label="Delete Review"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for adding review */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => { setShowModal(false); setEditId(null); }}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">{editId ? 'Edit Review' : 'Add Review'}</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <select name="reviewer" value={form.reviewer} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">Select Reviewer</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <select name="reviewee" value={form.reviewee} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">Select Reviewee</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <input name="rating" value={form.rating} onChange={handleChange} placeholder="Rating (1-5)" required className="w-full border rounded px-3 py-2" />
              <input name="comment" value={form.comment} onChange={handleChange} placeholder="Comment" required className="w-full border rounded px-3 py-2" />
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
import { useEffect, useState } from 'react';
import API from '../api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', type: '', date: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    setLoading(true);
    API.get('/events')
      .then(res => setEvents(res.data))
      .catch(err => setError(err.response?.data?.error || 'Error fetching events'))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openEdit(ev) {
    setEditId(ev._id);
    setForm({
      title: ev.title,
      description: ev.description,
      type: ev.type,
      date: ev.date,
      location: ev.location
    });
    setShowModal(true);
  }

  function handleAdd(e) {
    e.preventDefault();
    if (editId) {
      API.put(`/events/${editId}`, form)
        .then(res => setEvents(prev => prev.map(ev => ev._id === editId ? res.data : ev)))
        .then(() => {
          setShowModal(false);
          setEditId(null);
        })
        .catch(err => setError(err.response?.data?.error || 'Error updating event'));
    } else {
      API.post('/events', form)
        .then(res => setEvents(prev => [...prev, res.data]))
        .then(() => setShowModal(false))
        .catch(err => setError(err.response?.data?.error || 'Error adding event'));
    }
  }

  function handleDelete(id) {
    API.delete(`/events/${id}`)
      .then(() => setEvents(prev => prev.filter(ev => ev._id !== id)))
      .catch(err => setError(err.response?.data?.error || 'Error deleting event'));
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-blue-700">Events</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Event
        </button>
      </div>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      <div className="grid gap-6">
        {events.map(ev => (
          <div key={ev._id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-800">{ev.title}</div>
              <div className="text-gray-500">{ev.type} • {ev.location}</div>
              <div className="mt-2 text-gray-700">{ev.description}</div>
              <div className="mt-1 text-xs text-gray-400">{ev.date}</div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => openEdit(ev)}
                className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition"
                aria-label="Edit Event"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(ev._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                aria-label="Delete Event"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for adding event */}
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
            <h3 className="text-xl font-bold mb-4 text-center">{editId ? 'Edit Event' : 'Add Event'}</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="w-full border rounded px-3 py-2" />
              <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="w-full border rounded px-3 py-2" />
              <input name="type" value={form.type} onChange={handleChange} placeholder="Type" required className="w-full border rounded px-3 py-2" />
              <input name="date" value={form.date} onChange={handleChange} placeholder="Date" required className="w-full border rounded px-3 py-2" />
              <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required className="w-full border rounded px-3 py-2" />
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
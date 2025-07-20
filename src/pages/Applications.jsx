import { useEffect, useState } from 'react';
import API from '../api';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({ student: '', startup: '', opportunityType: '', status: 'Pending' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [startups, setStartups] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get('/applications'),
      API.get('/students'),
      API.get('/startups')
    ])
      .then(([apps, studs, sups]) => {
        setApplications(apps.data);
        setStudents(studs.data);
        setStartups(sups.data);
      })
      .catch(err => setError(err.response?.data?.error || 'Error fetching applications'))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openEdit(app) {
    setEditId(app._id);
    setForm({
      student: app.student,
      startup: app.startup,
      opportunityType: app.opportunityType,
      status: app.status
    });
    setShowModal(true);
  }

  function handleAdd(e) {
    e.preventDefault();
    if (editId) {
      API.put(`/applications/${editId}`, form)
        .then(res => setApplications(prev => prev.map(a => a._id === editId ? res.data : a)))
        .then(() => {
          setShowModal(false);
          setEditId(null);
        })
        .catch(err => setError(err.response?.data?.error || 'Error updating application'));
    } else {
      API.post('/applications', form)
        .then(res => setApplications(prev => [...prev, res.data]))
        .then(() => setShowModal(false))
        .catch(err => setError(err.response?.data?.error || 'Error adding application'));
    }
  }

  function handleDelete(id) {
    API.delete(`/applications/${id}`)
      .then(() => setApplications(prev => prev.filter(a => a._id !== id)))
      .catch(err => setError(err.response?.data?.error || 'Error deleting application'));
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-blue-700">Applications</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Application
        </button>
      </div>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      <div className="grid gap-6">
        {applications.map(a => (
          <div key={a._id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-800">Student: {students.find(s => s._id === a.student)?.name || a.student}</div>
              <div className="text-gray-500">Startup: {startups.find(su => su._id === a.startup)?.name || a.startup} 2 Type: {a.opportunityType}</div>
              <div className="mt-2 text-gray-700">Status: {a.status}</div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => openEdit(a)}
                className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition"
                aria-label="Edit Application"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(a._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                aria-label="Delete Application"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for adding application */}
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
            <h3 className="text-xl font-bold mb-4 text-center">{editId ? 'Edit Application' : 'Add Application'}</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <select name="student" value={form.student} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name || s.user?.name || s.user?.email || s._id}
                  </option>
                ))}
              </select>
              <select name="startup" value={form.startup} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">Select Startup</option>
                {startups.map(su => (
                  <option key={su._id} value={su._id}>{su.name}</option>
                ))}
              </select>
              <input name="opportunityType" value={form.opportunityType} onChange={handleChange} placeholder="Opportunity Type" className="w-full border rounded px-3 py-2" />
              <select name="status" value={form.status} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Interview">Interview</option>
              </select>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditId(null); }} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
import { useEffect, useState } from 'react';
import API from '../api';

const StartupIcon = () => <span role="img" aria-label="Startup" className="text-3xl">🚀</span>;

export default function Startups() {
  const [startups, setStartups] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    lookingFor: '',
    opportunityType: '',
    duration: '',
    stipend: '',
    requirements: '',
    contactEmail: '',
    website: '',
    teamSize: '',
    funding: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    setLoading(true);
    API.get('/startups')
      .then(res => setStartups(res.data))
      .catch(err => setError(err.response?.data?.error || 'Error fetching startups'))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openEdit(startup) {
    setEditId(startup._id);
    setForm({
      name: startup.name || '',
      description: startup.description || '',
      industry: startup.industry || '',
      location: startup.location || '',
      lookingFor: (startup.lookingFor || []).join(', '),
      opportunityType: startup.opportunityType || '',
      duration: startup.duration || '',
      stipend: startup.stipend || '',
      requirements: startup.requirements || '',
      contactEmail: startup.contactEmail || '',
      website: startup.website || '',
      teamSize: startup.teamSize || '',
      funding: startup.funding || ''
    });
    setShowModal(true);
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    const payload = {
      ...form,
      lookingFor: form.lookingFor.split(',').map(l => l.trim()).filter(Boolean),
      user: localStorage.getItem('userId')
    };
    if (editId) {
      API.put(`/startups/${editId}`, payload)
        .then(res => setStartups(prev => prev.map(s => s._id === editId ? res.data : s)))
        .then(() => {
          setShowModal(false);
          setEditId(null);
          setSuccess('Startup updated successfully!');
          setTimeout(() => setSuccess(''), 1500);
        })
        .catch(err => setError(err.response?.data?.error || 'Error updating startup'));
    } else {
      API.post('/startups', payload)
        .then(res => {
          setStartups(prev => [...prev, res.data]);
          setSuccess('Startup added successfully!');
          setTimeout(() => setSuccess(''), 1500);
        })
        .then(() => setShowModal(false))
        .catch(err => setError(err.response?.data?.error || 'Error adding startup'));
    }
  }

  function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this startup?')) return;
    API.delete(`/startups/${id}`)
      .then(() => {
        setStartups(prev => prev.filter(s => s._id !== id));
        setSuccess('Startup deleted successfully!');
        setTimeout(() => setSuccess(''), 1500);
      })
      .catch(err => setError(err.response?.data?.error || 'Error deleting startup'));
  }

  return (
    <div className="max-w-4xl mx-auto p-6 px-2">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 sm:gap-0">
        <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">Startups</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
        >
          + Add Startup
        </button>
      </div>
      {loading && <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      {success && <div className="text-center text-green-600 mb-4 animate-pulse">{success}</div>}
      {!loading && startups.length === 0 && <div className="text-center text-gray-400 py-12">No startups found.</div>}
      <div className="grid gap-8">
        {startups.map(s => (
          <div key={s._id} className="relative group bg-white/90 border border-blue-200 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-x-8 p-6 mb-2 overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-2xl focus-within:shadow-2xl">
            {/* Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 to-blue-300 rounded-l-2xl"></div>
            {/* Icon/Avatar */}
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-200 rounded-full shadow-lg z-10 mb-4 sm:mb-0">
              <StartupIcon />
            </div>
            {/* Main Info */}
            <div className="flex-1 flex flex-col justify-center min-w-0 z-10">
              <div className="mb-2">
                <div className="text-2xl font-extrabold text-blue-800 truncate">{s.name}</div>
                <div className="text-gray-500 flex items-center gap-2 truncate">{s.industry} • {s.location}</div>
              </div>
              <div className="text-gray-700 mb-2 truncate">{s.description}</div>
              {Array.isArray(s.lookingFor) && s.lookingFor.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {s.lookingFor.map((item, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold shadow-sm">{item}</span>
                  ))}
                </div>
              )}
            </div>
            {/* Floating Delete Button */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-20">
              <button
                onClick={() => openEdit(s)}
                className="bg-yellow-400 text-white p-2 rounded-full shadow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                aria-label="Edit Startup"
              >
                <span role="img" aria-label="Edit">✏️</span>
              </button>
              <button
                onClick={() => handleDelete(s._id)}
                className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                aria-label="Delete Startup"
              >
                <span role="img" aria-label="Delete">🗑️</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for adding startup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xs sm:max-w-lg relative animate-fadeIn max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl focus:outline-none"
              onClick={() => { setShowModal(false); setEditId(null); }}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">{editId ? 'Edit Startup' : 'Add Startup'}</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="industry" value={form.industry} onChange={handleChange} placeholder="Industry" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="lookingFor" value={form.lookingFor} onChange={handleChange} placeholder="Looking For (comma separated)" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="opportunityType" value={form.opportunityType} onChange={handleChange} placeholder="Opportunity Type" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="stipend" value={form.stipend} onChange={handleChange} placeholder="Stipend" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <textarea name="requirements" value={form.requirements} onChange={handleChange} placeholder="Requirements" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="Contact Email" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="website" value={form.website} onChange={handleChange} placeholder="Website" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="teamSize" value={form.teamSize} onChange={handleChange} placeholder="Team Size" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="funding" value={form.funding} onChange={handleChange} placeholder="Funding" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditId(null); }} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
// Add icons (Heroicons or similar, fallback to emoji)
const EditIcon = () => <span role="img" aria-label="Edit">✏️</span>;
const DeleteIcon = () => <span role="img" aria-label="Delete">🗑️</span>;
// Add icons for info sections
const UniversityIcon = () => <span role="img" aria-label="University">🎓</span>;
const YearIcon = () => <span role="img" aria-label="Year">📅</span>;
const SkillsIcon = () => <span role="img" aria-label="Skills">🛠️</span>;
const InterestsIcon = () => <span role="img" aria-label="Interests">💡</span>;
const AvailabilityIcon = () => <span role="img" aria-label="Availability">⏰</span>;
const ExperienceIcon = () => <span role="img" aria-label="Experience">🏆</span>;
const PortfolioIcon = () => <span role="img" aria-label="Portfolio">🌐</span>;
const LocationIcon = () => <span role="img" aria-label="Location">📍</span>;
const StudentIcon = () => <span role="img" aria-label="Student" className="text-3xl">🎓</span>;

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: '',
    university: '',
    year: '',
    skills: '',
    interests: '',
    availability: '',
    experience: '',
    portfolio: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  useEffect(() => {
    setLoading(true);
    API.get('/students')
      .then(res => setStudents(res.data))
      .catch(err => setError(err.response?.data?.error || 'Error fetching students'))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openEdit(student) {
    setEditId(student._id);
    setForm({
      name: student.name || '',
      university: student.university || '',
      year: student.year || '',
      skills: (student.skills || []).join(', '),
      interests: (student.interests || []).join(', '),
      availability: student.availability || '',
      experience: student.experience || '',
      portfolio: student.portfolio || '',
      location: student.location || ''
    });
    setShowModal(true);
  }

  function handleAdd(e) {
    e.preventDefault();
    const payload = {
      name: form.name,
      university: form.university,
      year: form.year,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: form.interests.split(',').map(i => i.trim()).filter(Boolean),
      availability: form.availability,
      experience: form.experience,
      portfolio: form.portfolio,
      location: form.location
    };
    if (editId) {
      API.put(`/students/${editId}`, payload)
        .then(res => setStudents(prev => prev.map(s => s._id === editId ? res.data : s)))
        .then(() => {
          setShowModal(false);
          setEditId(null);
          setSuccess('Student updated successfully!');
          setTimeout(() => setSuccess(''), 1500);
        })
        .catch(err => setError(err.response?.data?.error || 'Error updating student'));
    } else {
      API.post('/students', payload)
        .then(res => setStudents(prev => [...prev, res.data]))
        .then(() => {
          setShowModal(false);
          setSuccess('Student added successfully!');
          setTimeout(() => setSuccess(''), 1500);
        })
        .catch(err => setError(err.response?.data?.error || 'Error adding student'));
    }
  }

  function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    API.delete(`/students/${id}`)
      .then(() => {
        setStudents(prev => prev.filter(s => s._id !== id));
        setSuccess('Student deleted successfully!');
        setTimeout(() => setSuccess(''), 1500);
      })
      .catch(err => setError(err.response?.data?.error || 'Error deleting student'));
  }

  return (
    <div className="max-w-4xl mx-auto p-6 px-2 font-sans">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 sm:gap-0">
        <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">Students</h2>
        <button
          onClick={() => { setShowModal(true); setEditId(null); setForm({ name: '', university: '', year: '', skills: '', interests: '', availability: '', experience: '', portfolio: '', location: '' }); }}
          className="hidden sm:inline bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
        >
          + Add Student
        </button>
      </div>
      {/* Floating Action Button for mobile */}
      <button
        onClick={() => { setShowModal(true); setEditId(null); setForm({ name: '', university: '', year: '', skills: '', interests: '', availability: '', experience: '', portfolio: '', location: '' }); }}
        className="sm:hidden fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition text-2xl"
        aria-label="Add Student"
      >
        +
      </button>
      {loading && <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      {success && <div className="text-center text-green-600 mb-4 animate-pulse">{success}</div>}
      {!loading && students.length === 0 && <div className="text-center text-gray-400 py-12">No students found.</div>}
      {/* Student Cards */}
      <div className="grid gap-8">
        {students.map(s => (
          <div
            key={s._id}
            className="relative group bg-white/90 border border-blue-200 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-x-8 p-6 mb-2 overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-2xl focus-within:shadow-2xl"
            tabIndex={0}
            aria-label={`Student card for ${s.name}`}
            role="region"
          >
            {/* Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 to-blue-300 rounded-l-2xl"></div>
            {/* Icon/Avatar */}
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-200 rounded-full shadow-lg z-10 mb-4 sm:mb-0">
              <StudentIcon />
            </div>
            {/* Main Info */}
            <div className="flex-1 flex flex-col justify-center min-w-0 z-10">
              <div className="mb-2">
                <div className="text-2xl font-extrabold text-blue-800 truncate">{s.name}</div>
                {s.user && (
                  <div className="text-sm text-blue-700 truncate"><span className="font-semibold">User:</span> {s.user.name}{s.user.email ? ` (${s.user.email})` : ''}</div>
                )}
                <div className="text-gray-500 flex items-center gap-2 truncate"><UniversityIcon /> {s.university} <YearIcon /> {s.year}</div>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <span className="font-semibold text-gray-700 flex items-center gap-1"><SkillsIcon /> Skills:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {s.skills && s.skills.map(skill => (
                      <span key={skill} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold shadow">{skill}</span>
                    ))}
                  </div>
                </div>
                {s.interests && s.interests.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-700 flex items-center gap-1"><InterestsIcon /> Interests:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {s.interests.map(interest => (
                        <span key={interest} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold shadow">{interest}</span>
                      ))}
                    </div>
                  </div>
                )}
                {s.availability && (
                  <div className="flex items-center gap-1"><AvailabilityIcon /><span className="font-semibold text-gray-700">Availability:</span> {s.availability}</div>
                )}
                {s.experience && (
                  <div className="flex items-center gap-1"><ExperienceIcon /><span className="font-semibold text-gray-700">Experience:</span> {s.experience}</div>
                )}
                {s.portfolio && (
                  <div className="flex items-center gap-1"><PortfolioIcon /><span className="font-semibold text-gray-700">Portfolio:</span> {s.portfolio}</div>
                )}
                {s.location && (
                  <div className="flex items-center gap-1"><LocationIcon /><span className="font-semibold text-gray-700">Location:</span> {s.location}</div>
                )}
              </div>
            </div>
            {/* Floating Edit/Delete Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-20">
              <button
                onClick={() => openEdit(s)}
                className="bg-yellow-400 text-white p-2 rounded-full shadow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                aria-label="Edit Student"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDelete(s._id)}
                className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                aria-label="Delete Student"
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for adding/editing student */}
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
            <h3 className="text-xl font-bold mb-4 text-center">{editId ? 'Edit Student' : 'Add Student'}</h3>
            {/* Show student name in real time above the form */}
            {form.name && (
              <div className="text-center text-blue-700 font-semibold mb-2">Student Name: {form.name}</div>
            )}
            <form onSubmit={handleAdd} className="space-y-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="university" value={form.university} onChange={handleChange} placeholder="University" required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="year" value={form.year} onChange={handleChange} placeholder="Year" required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="interests" value={form.interests} onChange={handleChange} placeholder="Interests (comma separated)" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="availability" value={form.availability} onChange={handleChange} placeholder="Availability (e.g. Part-time, Full-time)" required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <textarea name="experience" value={form.experience} onChange={handleChange} placeholder="Experience" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <textarea name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="Portfolio (links, etc.)" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditId(null); }} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none">{editId ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
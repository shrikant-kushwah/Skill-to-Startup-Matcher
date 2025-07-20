const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  university: { type: String, required: true },
  year: { type: String, required: true },
  skills: [{ type: String }],
  interests: [{ type: String }],
  availability: { type: String, required: true },
  experience: { type: String },
  portfolio: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema); 
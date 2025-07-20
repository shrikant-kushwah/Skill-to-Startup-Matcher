const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  industry: { type: String },
  location: { type: String },
  lookingFor: [{ type: String }],
  opportunityType: { type: String },
  duration: { type: String },
  stipend: { type: String },
  requirements: { type: String },
  contactEmail: { type: String },
  website: { type: String },
  teamSize: { type: String },
  funding: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Startup', StartupSchema); 
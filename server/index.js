const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const studentsRoutes = require('./routes/students');
app.use('/api/students', studentsRoutes);

const startupsRoutes = require('./routes/startups');
app.use('/api/startups', startupsRoutes);

const applicationsRoutes = require('./routes/applications');
app.use('/api/applications', applicationsRoutes);

const messagesRoutes = require('./routes/messages');
app.use('/api/messages', messagesRoutes);

const eventsRoutes = require('./routes/events');
app.use('/api/events', eventsRoutes);

const reviewsRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewsRoutes);

app.get('/', (req, res) => {
  res.send('Skill-to-Startup Matcher Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
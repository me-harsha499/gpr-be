require('dotenv').config();
const express = require('express');
const cors = require('cors');
const consultationsRouter = require('./routes/consultations');
const authRouter = require('./routes/auth');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 
           'http://127.0.0.1:3000',
           'http://localhost:3002', 
           'http://127.0.0.1:3002',
           'https://www.gprinteriors.com'
          ],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Consultation backend is running' });
});

// Routes
app.use('/api/consultations', consultationsRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Consultation backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

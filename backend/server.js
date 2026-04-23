// server.js - UrbanServe Backend Entry Point
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ── Middleware ─────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'UrbanServe API is running 🚀' });
});

// ── API Routes ─────────────────────────────────────────────────────
app.get('/api/setup-db', async (req, res) => {
  try {
    const pool = require('./config/db');
    const fs = require('fs');
    const path = require('path');
    const sql = fs.readFileSync(path.join(__dirname, 'config', 'schema.sql'), 'utf8');
    
    // Split by semicolon but ignore ones inside strings (simplified for this schema)
    const statements = sql.split(/;(?=(?:[^']*'[^']*')*[^']*$)/);
    
    for (let statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }
    
    res.json({ success: true, message: '🎉 Database tables created and data seeded successfully!' });
  } catch (error) {
    console.error('Setup DB Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

// ── Serve Frontend in Production ───────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// ── Error Handlers ─────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Required for Railway

app.listen(PORT, HOST, () => {
  console.log(`\n🚀 UrbanServe Server is LIVE!`);
  console.log(`📡 URL: http://${HOST}:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database: ${process.env.DB_HOST || 'mysql.railway.internal'}\n`);
});

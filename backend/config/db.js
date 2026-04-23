// config/db.js - MySQL Database Connection Pool
const mysql = require('mysql2/promise');
// Last Deploy Attempt: 2026-04-23T15:57:00Z
require('dotenv').config();

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
  user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'urbanserve',
  port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
});

// Test the connection
const testConnection = async () => {
  console.log(`📡 Attempting to connect to database at ${process.env.DB_HOST || process.env.MYSQLHOST || 'localhost'}...`);
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    conn.release();
  } catch (error) {
    console.error('❌ DATABASE CONNECTION FAILED!');
    console.error('   Error Code:', error.code || 'N/A');
    console.error('   Error Message:', error.message || 'No message provided');
    console.error('   Target Host:', process.env.DB_HOST || process.env.MYSQLHOST || 'localhost');
    console.error('   Target User:', process.env.DB_USER || process.env.MYSQLUSER || 'root');
    // Don't exit immediately in production so we can see the logs
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

testConnection();

module.exports = pool;

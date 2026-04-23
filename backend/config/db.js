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
    
    // Auto-initialize tables
    await initDB();
  } catch (error) {
    console.error('❌ DATABASE CONNECTION FAILED!');
    console.error('   Error Code:', error.code || 'N/A');
    console.error('   Error Message:', error.message || 'No message provided');
    
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Initialize Database Tables
const initDB = async () => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    console.log('⏳ DATABASE AUTO-INIT: Starting...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ DATABASE AUTO-INIT: schema.sql NOT FOUND at', schemaPath);
      return;
    }

    const sql = fs.readFileSync(schemaPath, 'utf8');
    // Filter out comments and empty lines
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`⏳ DATABASE AUTO-INIT: Found ${statements.length} commands to run.`);
    
    for (let statement of statements) {
      try {
        if (statement.trim()) {
          await pool.query(statement);
        }
      } catch (err) {
        // Ignore "already exists" or "duplicate entry" errors
        if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_ENTRY') {
          continue; 
        }
        console.warn('⚠️ Statement warning:', err.message);
      }
    }
    console.log('✅ DATABASE AUTO-INIT: Tables verified and created successfully!');
  } catch (error) {
    console.error('❌ DATABASE AUTO-INIT: CRITICAL FAILURE:', error.message);
  }
};

testConnection();

module.exports = pool;

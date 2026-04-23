const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function importDatabase() {
  const config = {
    host: 'shortline.proxy.rlwy.net',
    port: 35621,
    user: 'root',
    password: 'wzaUxPJQwEDDCUhJuHpbLoZtgXQFghOb',
    database: 'railway',
    multipleStatements: true
  };

  console.log('📡 Connecting to Railway MySQL...');
  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected!');

    const schemaPath = path.join(__dirname, 'backend', 'config', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('⏳ Importing schema...');
    await connection.query(sql);
    console.log('🎉 SUCCESS! Your database is now populated.');

    await connection.end();
  } catch (error) {
    console.error('❌ Failed to import:', error.message);
    console.log('\nTip: Double check the password in your Railway Variables tab.');
  }
}

importDatabase();

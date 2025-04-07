const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    console.log('Connected to database');
    
    const [tables] = await connection.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = DATABASE() AND table_name = 'topscores'
    `);
    
    if (tables.length === 0) {
      console.log('Creating topscores table...');
      await connection.query(`
        CREATE TABLE topscores (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255),
          score INT,
          regionId INT
        )
      `);
      console.log('Table created successfully');
    } else {
      console.log('Table already exists');
    }
    
  } catch (error) {
    console.error('Database setup error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

setupDatabase();
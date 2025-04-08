const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Database connection pool
let pool;
async function connectToDatabase() {
  try {
    pool = mysql.createPool(process.env.MYSQL_URL);
    console.log('Successfully connected to database');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}
connectToDatabase();

app.get('/getAllScores', async (req, res) => {
  try {
    // First check if we have a connection
    if (!pool) {
      console.error('Database pool not initialized');
      return res.status(500).json({ error: 'Database connection not established' });
    }
    
    console.log('Attempting to query database...');
    
    // Test connection first
    try {
      await pool.query('SELECT 1');
      console.log('Connection test successful');
    } catch (connError) {
      console.error('Connection test failed:', connError);
      return res.status(500).json({ error: 'Database connection failed', details: connError.message });
    }
    
    // Check if table exists
    try {
      const [tables] = await pool.query(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = DATABASE() AND table_name = 'topscores'
      `);
      
      if (tables.length === 0) {
        console.error('Table topscores does not exist');
        return res.status(500).json({ error: 'Table does not exist' });
      }
      console.log('Table exists, proceeding with query');
    } catch (tableError) {
      console.error('Error checking table:', tableError);
      return res.status(500).json({ error: 'Failed to check table existence', details: tableError.message });
    }
    
    // Continue with your original query
    const [rows] = await pool.query('select * from topscores order by score desc');
    
    const oScores = {
      aScoresEurope: [],
      aScoresAsia: [],
      aScoresAfrica: []
    };
    
    rows.forEach(oRecord => {
      if(oRecord.regionId === 1) {
        oScores.aScoresEurope.push(oRecord);
      } else if(oRecord.regionId === 2) {
        oScores.aScoresAsia.push(oRecord);
      } else if(oRecord.regionId === 3) {
        oScores.aScoresAfrica.push(oRecord);
      }
    });
    
    res.json(oScores);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/saveScore', async (req, res) => {
  try {
    const { playerName, score, regionId } = req.body;
    
    // Validate the data
    if (!playerName || score === undefined || regionId === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Insert into database
    const [result] = await pool.query(
      'INSERT INTO topscores (playerName, score, regionId) VALUES (?, ?, ?)',
      [playerName, score, regionId]
    );
    
    res.status(201).json({
      success: true,
      id: result.insertId,
      message: 'Score saved successfully'
    });
    
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// Catch-all route to serve UI5 app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
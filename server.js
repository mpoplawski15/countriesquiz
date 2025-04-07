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

// Catch-all route to serve UI5 app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
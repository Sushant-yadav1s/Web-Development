const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Add this line
const authRoutes = require('./authRoutes'); // Ensure this file exists

const db = mysql.createConnection({
    host: 'localhost', // or your host
    user: 'root', // your MySQL username
    password: 'Susu@07092002', // your MySQL password
    database: 'alumniconnect' // your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public'))); // Change 'public' to the directory where your HTML files are

// Routes
app.use('/api/auth', authRoutes); // Use the auth routes

// Basic route for root
app.get('/', (req, res) => {
    res.send('Server is running.');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

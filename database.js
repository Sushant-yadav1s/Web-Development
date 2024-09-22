const mysql = require('mysql');

const dbConfig = {
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'Susu@07092002', // replace with your MySQL password
    database: 'alumniconnect'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

module.exports = connection;

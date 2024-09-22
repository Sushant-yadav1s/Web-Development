const express = require('express');
const router = express.Router();
const database = require('./database'); // Ensure this points correctly to your database file

// User signup route
router.post('/signup', (req, res) => {
    const { name, email, password, user_type } = req.body;
    
    // Add logic to insert the user into the database
    const sql = 'INSERT INTO user (Name, Email, Password, user_type) VALUES (?, ?, ?, ?)';
    database.query(sql, [name, email, password, user_type], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error registering user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
});

// User login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Add logic to authenticate user
    const sql = 'SELECT * FROM user WHERE Email = ?';
    database.query(sql, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error logging in' });
        }
        if (results.length === 0 || results[0].Password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', user: results[0] });
    });
});
router.get('/profile/:id', (req, res) => {
    const userId = req.params.id;

    // Fetch from user table
    const userSql = 'SELECT * FROM user WHERE UserID = ?';
    database.query(userSql, [userId], (err, userResults) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching user profile' });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userType = userResults[0].user_type;

        // Fetch additional data based on user type
        const additionalSql = userType === 'Student' ? 'SELECT * FROM student WHERE UserID = ?' : 'SELECT * FROM alumni WHERE UserID = ?';
        database.query(additionalSql, [userId], (err, additionalResults) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching additional data' });
            }

            res.json({ user: userResults[0], additionalData: additionalResults });
        });
    });
});
router.put('/profile/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, batch, currentCompany, jobTitle, industry, yearsOfExperience, previousCompanies, skills, mentorshipInterest, achievements, resumeURL, branch, year, github, project, resumeURLStudent, cgpa, hobbies, clubs, internshipExperience } = req.body;

    // Update user details in the `user` table
    const userSql = 'UPDATE user SET Name = ?, Email = ? WHERE UserID = ?';
    database.query(userSql, [name, email, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating user profile' });
        }

        // Determine user type
        const userTypeSql = 'SELECT user_type FROM user WHERE UserID = ?';
        database.query(userTypeSql, [userId], (err, typeResult) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching user type' });
            }

            const userType = typeResult[0].user_type;

            // Update Alumni details if user is an Alumni
            if (userType === 'Alumni') {
                const alumniSql = `
                    UPDATE alumni 
                    SET Batch = ?, CurrentCompany = ?, JobTitle = ?, Industry = ?, YearsOfExperience = ?, 
                        PreviousCompanies = ?, Skills = ?, MentorshipInterest = ?, Achievements = ?, ResumeURL = ?
                    WHERE UserID = ?
                `;
                database.query(alumniSql, [batch, currentCompany, jobTitle, industry, yearsOfExperience, previousCompanies, skills, mentorshipInterest, achievements, resumeURL, userId], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating alumni details' });
                    }
                    return res.status(200).json({ message: 'Profile updated successfully!' });
                });
            }
            // Update Student details if user is a Student
            else if (userType === 'Student') {
                const studentSql = `
                    UPDATE student 
                    SET Branch = ?, Year = ?, GitHub = ?, Project = ?, ResumeURL = ?, CGPA = ?, Hobbies = ?, 
                        Clubs = ?, InternshipExperience = ?
                    WHERE UserID = ?
                `;
                database.query(studentSql, [branch, year, github, project, resumeURLStudent, cgpa, hobbies, clubs, internshipExperience, userId], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating student details' });
                    }
                    return res.status(200).json({ message: 'Profile updated successfully!' });
                });
            }
        });
    });
});

    
module.exports = router;

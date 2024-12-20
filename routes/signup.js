const express = require('express');
const db = require('../db/database');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('signup', { error: null });
});

router.post('/', async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;
    let error = null;

    if (!fullName || !email || !password || !confirmPassword) {
        error = "Fill in all blanks";
    } else if (password.length < 6) {
        error = "Password at least 6 characters.";
    } else if (password !== confirmPassword) {
        error = "Passwords do not match.";
    }

    if (!error) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            console.log('Query result:', rows); 
            if (rows.length > 0) {
                error = "Email address is used.";
            }
        } catch (err) {
            console.error('Error:', err);
            error = "Error while checking the email.";
        }
    }

    if (error) {
        return res.render('signup', { error });
    }

    try {
        await db.query('INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)', [fullName, email, password]);
        res.render('welcome');
    } catch (err) {
        console.error('Error inserting new user:', err);
        res.render('signup', { error: 'Error while creating account.' });
    }
});

module.exports = router;
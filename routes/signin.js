const express = require('express');
const db = require('../db/database');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.cookies.userId) return res.redirect('/inbox');
    res.render('signin');
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT id, fullName FROM users WHERE email = ? AND password = ?`;

    try {
        const [results] = await db.query(query, [email, password]);
        if (results.length > 0) {
            res.cookie('userId', results[0].id);
            res.cookie('userFullName', results[0].fullName);
            res.redirect('/inbox');
        } else {
            res.render('signin', { error: 'Invalid email or password' });
        }
    } catch (err) {
        res.render('signin', { error: 'Error while sign-in' });
    }
});

module.exports = router;

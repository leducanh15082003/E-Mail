const express = require('express');
const db = require('../db/database');
const checkAuth = require('../utils/checkAuth');
const router = express.Router();

router.get('/:id', checkAuth, async (req, res) => {
    const emailId = req.params.id; 

    try {
        const [emailDetails] = await db.query(
            'SELECT e.subject, e.body, e.sent_at, e.attachment_filename, e.attachment_originalname, u.fullName AS senderFullName FROM emails e JOIN users u ON e.sender_id = u.id WHERE e.id = ?',
            [emailId]
        );

        if (emailDetails.length === 0) {
            return res.status(404).send('Email not found');
        }

        res.render('emailDetail', {
            email: emailDetails[0],
            userFullName: req.cookies.userFullName 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

module.exports = router;

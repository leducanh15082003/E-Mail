const express = require('express');
const db = require('../db/database');
const checkAuth = require('../utils/checkAuth');
const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
    const userId = req.cookies.userId; 
    const page = parseInt(req.query.page) || 1; 
    const pageSize = 5;

    try {
        const [totalSentEmailsRows] = await db.query('SELECT COUNT(*) AS count FROM emails WHERE sender_id = ? AND is_deleted_for_sender = 0', [userId]);
        const totalSentEmails = totalSentEmailsRows[0].count;
        const totalPages = Math.ceil(totalSentEmails / pageSize);
        
        const [sentEmails] = await db.query(
            'SELECT e.id, u.fullName AS recipientFullName, e.subject, e.sent_at FROM emails e JOIN users u ON e.receiver_id = u.id WHERE e.sender_id = ? AND e.is_deleted_for_sender = 0 ORDER BY e.sent_at DESC LIMIT ? OFFSET ?', 
            [userId, pageSize, (page - 1) * pageSize]);

        res.render('outbox', {
            sentEmails,
            userFullName: req.cookies.userFullName, 
            currentPage: page,
            totalPages: totalPages,
            error: null,
            page: 'outbox'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

module.exports = router;

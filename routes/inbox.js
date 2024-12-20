const express = require('express');
const db = require('../db/database');
const checkAuth = require('../utils/checkAuth');
const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
    const userId = req.cookies.userId;
    const pageSize = 5;
    const page = parseInt(req.query.page) || 1;

    try {
        const [totalEmailsRows] = await db.query('SELECT COUNT(*) AS count FROM emails WHERE receiver_id = ? AND is_deleted_for_receiver = 0', [userId]);
        const totalEmails = totalEmailsRows[0].count;
        const totalPages = Math.ceil(totalEmails / pageSize);
        const [emails] = await db.query(
            'SELECT e.id, u.fullName AS senderFullName, e.subject, e.sent_at FROM emails e JOIN users u ON e.sender_id = u.id WHERE e.receiver_id = ? AND e.is_deleted_for_receiver = 0 ORDER BY e.sent_at DESC LIMIT ? OFFSET ?',
            [userId, pageSize, (page - 1) * pageSize]
        );

        res.render('inbox', { emails, currentPage: page, totalPages, userFullName: req.cookies.userFullName, error: null, page: 'inbox' });
    } catch (err) {
        res.status(500).send('Error');
    }
});

module.exports = router;

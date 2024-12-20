const express = require('express');
const router = express.Router();
const db = require("../db/database");

router.delete('/deleteEmails', async (req, res) => {
    const { emailIds, inbox } = req.body;
    const userId = req.cookies.userId;

    try {
        if (inbox) {
            await db.query(
                'UPDATE emails SET is_deleted_for_receiver = 1 WHERE id IN (?) AND receiver_id = ?',
                [emailIds, userId]
            );
        } else {
            await db.query(
                'UPDATE emails SET is_deleted_for_sender = 1 WHERE id IN (?) AND sender_id = ?',
                [emailIds, userId]
            );
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error while deleting:', error);
        res.status(500).json({ success: false, error: 'Fail while deleting emails' });
    }
});

module.exports = router;

// const express = require('express');
// const db = require('../db/database');
// const checkAuth = require('../utils/checkAuth');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
// const router = express.Router();

// router.get('/compose', checkAuth, async (req, res) => {
//     try {
//         const users = await getAllUsers(req); 
//         const success = req.query.success || null;
//         const error = null;
//         res.render('compose', { users, success, error, page: 'compose' }); 
//     } catch (err) {
//         console.error('Error while fetching:', err);
//         res.render('compose', { users: [], error: 'Cannot fetch users.', success: null, page: 'compose' });
//     }
// });

// router.post('/compose', upload.single('attachment'), async (req, res) => {
//     const { recipientId, subject, body } = req.body;
//     const senderId = req.cookies.userId;

//     const attachmentFilename = req.file ? req.file.filename : null;
//     const attachmentOriginalname = req.file ? req.file.originalname : null;

//     if (!recipientId) {
//         return res.render('compose', { users: await getAllUsers(req), error: 'Please select a recipient.', success: null, page: 'compose' });
//     }

//     try {
//         await db.query(
//             'INSERT INTO emails (sender_id, receiver_id, subject, body, attachment_filename, attachment_originalname) VALUES (?, ?, ?, ?, ?, ?)',
//             [senderId, recipientId, subject, body, attachmentFilename, attachmentOriginalname]
//         );

//         res.redirect('/compose?success=Email sent successfully!');
//     } catch (err) {
//         console.error('Error while sending email:', err);
//         res.render('compose', { users: await getAllUsers(req), error: 'Fail while sending email.', success: null, page: 'compose' });
//     }
// });

// async function getAllUsers(req) {
//     const [users] = await db.query('SELECT id, fullName FROM users WHERE id != ?', [req.cookies.userId]);
//     return users;
// }

// module.exports = router;


const express = require('express');
const db = require('../db/database');
const checkAuth = require('../utils/checkAuth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'email_attachments', 
        resource_type: 'auto', 
    },
});

const upload = multer({ storage });

// GET 
router.get('/compose', checkAuth, async (req, res) => {
    try {
        const users = await getAllUsers(req);
        const success = req.query.success || null;
        const error = null;
        res.render('compose', { users, success, error, page: 'compose' });
    } catch (err) {
        console.error('Error while fetching:', err);
        res.render('compose', { users: [], error: 'Cannot fetch users.', success: null, page: 'compose' });
    }
});

// POST
router.post('/compose', upload.single('attachment'), async (req, res) => {
    const { recipientId, subject, body } = req.body;
    const senderId = req.cookies.userId;

    const attachmentUrl = req.file ? req.file.path : null; 
    const attachmentOriginalname = req.file ? req.file.originalname : null;

    if (!recipientId) {
        return res.render('compose', { users: await getAllUsers(req), error: 'Please select a recipient.', success: null, page: 'compose' });
    }

    try {
        await db.query(
            'INSERT INTO emails (sender_id, receiver_id, subject, body, attachment_url, attachment_originalname) VALUES (?, ?, ?, ?, ?, ?)',
            [senderId, recipientId, subject, body, attachmentUrl, attachmentOriginalname]
        );

        res.redirect('/compose?success=Email sent successfully!');
    } catch (err) {
        console.error('Error while sending email:', err);
        res.render('compose', { users: await getAllUsers(req), error: 'Fail while sending email.', success: null, page: 'compose' });
    }
});

async function getAllUsers(req) {
    const [users] = await db.query('SELECT id, fullName FROM users WHERE id != ?', [req.cookies.userId]);
    return users;
}

module.exports = router;

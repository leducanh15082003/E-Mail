const express = require('express');
const router = express.Router();

router.get('/signout', (req, res) => {
    res.clearCookie('userId');
    res.clearCookie('userFullName');

    res.redirect('/');
});

module.exports = router;

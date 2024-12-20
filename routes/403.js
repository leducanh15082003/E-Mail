const express = require('express');
const router = express.Router();

router.get('/403', (req, res) => {
  res.status(403).render('403');
});

module.exports = router;
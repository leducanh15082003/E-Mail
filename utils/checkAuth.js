function checkAuth(req, res, next) {
    if (!req.cookies.userId) {
        return res.status(403).render('403');
    }
    next();
}

module.exports = checkAuth;
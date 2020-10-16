
function loggedOut(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect("/profile");
    }
    return next();
}

function requiresLogIn(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    var err = new Error ("You need to be Logged in to view this page.");
    err.status = 403;
    return next(err);
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogIn = requiresLogIn;
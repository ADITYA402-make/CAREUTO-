// middleware/auth.js
// Protects routes from unauthenticated access

function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next(); // User is logged in, proceed
  }
  req.flash('error', 'Please log in to access this page.');
  res.redirect('/auth/login');
}

module.exports = { isAuthenticated };

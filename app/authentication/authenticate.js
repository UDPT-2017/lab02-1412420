
module.exports = function(redirectUrl) {
  return function(req, res, next) {
    // note
    // with route is / should placed at the last line of routing
    if(req.isAuthenticated()) {
      next();
    } else {
      res.redirect(redirectUrl);
    }
  };
};


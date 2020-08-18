

function isLoggedIn(req, res, next){
	if(req.isAuthenticated() && req.params.username === req.user.username){
		return next();
	}
	req.flash("error", "Unauthorised access!");
	res.redirect("/get-started");
}

module.exports = isLoggedIn;


function isLoggedIn2(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login to continue");
	res.redirect("/get-started");
}

module.exports = isLoggedIn2;
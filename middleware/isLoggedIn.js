

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.send({"error":"Unauthorised!"});
}

module.exports = isLoggedIn;
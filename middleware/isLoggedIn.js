function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.send({"error":"Unauthorised!"});
	}

	
}

module.exports = isLoggedIn;
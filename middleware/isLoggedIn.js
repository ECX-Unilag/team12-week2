function isLoggedIn(req, res, next){
	if(req.body.user){
		return next();
	}else{
		res.send({"error":"Unauthorised!"});
	}

	
}

module.exports = isLoggedIn;
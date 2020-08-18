
const mongoose = require("mongoose");
const Course = require("../models/Course");


function isOwner(req, res, next){
	Course.findById(req.params.id, function(err, foundCourse){
        if(req.isAuthenticated() && foundCourse.tutor.username === req.user.username && foundCourse.tutor.username === req.params.username){
            return next();
        }
        req.flash("error", "Unauthorised access!");
	    res.redirect("/");
    })
	
}

module.exports = isOwner;
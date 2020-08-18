var express = require("express");
var passport = require("passport");
var mongoose = require("mongoose");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");


// ===========================USER SCHEMA-===================
var UserSchema = new mongoose.Schema({
    fullName: String,
    username: String,
    password: String,
    email: String,
    budget: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget",
        autopopulate: true
    }]
});
UserSchema.plugin(require("mongoose-autopopulate"));
UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User", UserSchema);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));
passport.authenticate('local');

module.exports = User = mongoose.model("User", UserSchema);
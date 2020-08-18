const express = require("express");
const app = express(),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    session = require('express-session');

const cors = require("cors");
require("./routes/prod")(app);
const mongoose = require("mongoose");
const mongoUtil = require('./models/DB');
mongoUtil.connectToServer();
//mongoose.connect("mongodb://localhost/Budgetify", { useNewUrlParser: true, useUnifiedTopology: true });
if (process.env.NODE_ENV === 'production')
    useCaching = true;

mongoose.set('debug', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});





const indexRoutes = require("./routes/login-signup"),
      editBudgetRoutes = require("./routes/edit-budget"),
      viewRoute = require("./routes/view-budget"),
      createRoutes = require("./routes/create");
  
   

app.use('/', indexRoutes);
app.use('/', createRoutes);
app.use('/', editBudgetRoutes)
app.use('/', viewRoute);





app.listen(process.env.PORT || 3000, function () {
        console.log("The server has started on port" + process.env.PORT);
    });


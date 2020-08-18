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
app.use(session({
    resave: false,
    saveUninitialized: false,
    cookieName: 'session',
    secret: "8yf9-7GJG335{}+Ihdjhjh67ubhjk88985bbj__jA",
    duration: 1800000,
    activeDuration: 600000,
    //httpOnly: true,
    //secure: true,
    ephemeral: false
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());



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


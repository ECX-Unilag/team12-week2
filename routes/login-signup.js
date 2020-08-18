var router = require("express").Router();
var mongoose = require("mongoose"),
    passport = require("passport");
var mongoose = require("mongoose"),
        passport = require("passport"),
        cors = require("cors"),
        User = require("../models/User");
        const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.EMAIL_KEY);
    const schedule = require("node-schedule");


mongoose.set('debug', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
// ======================LOG IN===========================

router.get("/",  cors(), function(req, res){
    res.send({"success":"API for Budgetify, built by Charles Ugbana."})
})

router.post("/api/login", cors(), passport.authenticate("local"), function (req, res) {
        res.send({"message":"You are logged in."})
    });
    
router.post("/api/user", cors(),function (req, res) {
        const newUser = new User({
            fullName: req.body.fullName,
            username: req.body.username,
            email: req.body.email
        });
        User.register(newUser, req.body.password, function (err, user) {
            if (err) {
                res.send({"error": "Something went wrong!"});
            }else{
 // ===============================================================
                var rule = new schedule.RecurrenceRule();
                    rule.dayOfWeek = [new schedule.Range(0, 6)];
                    rule.hour = 18;
                    rule.minute = 0;
 
                var j = schedule.scheduleJob(rule, function(){
                    const msg = {
                        to: req.body.email,
                        from: 'developmenthub123@gmail.com',
                        subject: 'Hello! '+ req.body.fullName,
                        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                    };
                    sgMail.send(msg);});
//================================================================================================


                const msg = {
                    to: req.body.email,
                    from: 'developmenthub123@gmail.com',
                    subject: 'Hello! Welcome to Budgetify!',
                    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                };
                sgMail.send(msg).then(() => {
                    res.send({"success": "Sign up successful. Please login to begin."});
                }).catch(error => {
                    res.send({"success": "Sign up successful. Please login to begin."});
            })
            
        };
    });
})

router.get("/logout", cors(), function (req, res) {
        req.logout();
        res.send({"message":"Successfully logged out."})
    })
    


module.exports = router;
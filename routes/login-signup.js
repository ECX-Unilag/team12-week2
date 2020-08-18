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

router.post("/api/login", cors(), function (req, res, next) {
    passport.authenticate("local", function(err, user, info){
        if(err){
            return next(err);
        }
        if(!user){
            return res.send(401, {'message': 'Invalid credentials!'});
        }
        req.login(user, function(err){
            if(err){
                return next(err);
            }
            return res.send(401, {'message': 'You are logged in!'});
        })
    })(req, res, next);
       
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
                        html: '<p>This is just a subtle reminder that you should visit the budgetify app to create a budget if you have not. If you have, please visit the app to document all expenses made for the day. <br><br> Best Regards!</p>',
                    };
                    sgMail.send(msg);});
//================================================================================================


                const msg = {
                    to: req.body.email,
                    from: 'developmenthub123@gmail.com',
                    subject: 'Hello! Welcome to Budgetify!',
                    html: `<strong>Hello ${req.body.fullName}</strong> <br> We are glad to have you join our platform focused at helping you spend wisely. Have a great time here! <br><br> Best Regards.`,
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
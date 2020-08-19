var router = require("express").Router();
var mongoose = require("mongoose"),
    bodeyParser = require("body-parser"),
    cors = require("cors"),
    passport = require("passport"),
    User = require("../models/User"),
    Budget = require("../models/Budget"),
    isLoggedIn = require("../middleware/isLoggedIn");
    const circularStructureStringify = require('circular-structure-stringify');
    const schedule = require("node-schedule");
    const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY);


// ==========CREATE A BUDGET==================================
router.post("/api/new", cors(), isLoggedIn, function (req, res) {
    User.find({ username: req.body.user.username }, function (err, foundUser1) {
        if (err || foundUser1.length === 0) {
            res.send({"error":"Something went wrong creating a new budget."})
        } else {
            Budget.find({username: req.body.user.username}, function(err, foundUser){
                if(foundUser.length !== 0){
                    res.send({"message": "You have a running budget profile."})
                }else{
                    let budget = {username: req.body.user.username, gross: req.body.gross, unallocated: parseInt(req.body.gross) - parseInt(req.body.budget), 
                        expenditure:[{ title: req.body.title, budget: req.body.budget, expenses: 0 }]}
                    Budget.create(budget, function(err, newBudget){
                        if(err){
                            res.send({"error":"Something went wrong creating a new budget."})
                        }else{
                            Budget.find({username : req.body.user.username}).toArray((err, allData) => {
                                if(err){
                                    res.send({'error':'Something went wrong.'})
                                }else{
                                    res.send({ "user": foundUser1.toArray(), "budget":JSON.parse(circularStructureStringify(allData)), "message":"Budget created successfully."});
                                } 
                            })
                           
                            const msg = {
                                to: foundUser1.slice()[0].email,
                                from: 'developmenthub123@gmail.com',
                                subject: 'New Budget Created!',
                                html: `Way to go ${foundUser1.fullName}. <br> We can see that you just created a new budget profile. Keep up the good work! <br><br> Best Regards.`,
                            };
                            sgMail.send(msg)
                            let renewalTime = new Date(Date.now());
                            let endSub = new Date(renewalTime.getTime() + 2628002880);
                            let code = newBudget._id;
                            schedule.scheduleJob(endSub, function () {
                                Budget.findOneAndDelete(code, function (err, deletedBudget) {
                                    const msg = {
                                        to: foundUser1.slice()[0].email,
                                        from: 'developmenthub123@gmail.com',
                                        subject: 'Your budget profile has expired.',
                                        html: '<p><strong>Hello '+foundUser1.slice()[0].fullName+',</strong></p><p>Please visit Bugetify to create another budget profile for the month. Remember, you cannot be spending anyhow!</p><p><i>Warm Regards!</i></p>'
                                    };
                                    sgMail.send(msg)
                                })})
                            // ===============================================================
                           
        //================================================================================================
        
                           
                        }
                    })
                }
            })
           
        }

    })
});


//==========================ADD BUDGET===================================
router.post("/api/:id/add", cors(), isLoggedIn,  function (req, res) {
    Budget.findById(req.params.id, function (err, foundBudget) {
        if (err || foundBudget.length === 0) {
            res.send({"error":"Something went wrong."})
        } else {
            let newBudget = { title: req.body.title, budget: req.body.budget, expenses: 0 }
            if((foundBudget.gross - foundBudget.unallocated) < parseInt(req.body.budget)){
                User.find({username : foundBudget.username}, function(err, foundUser){
                    if(err){
                        console.log(err)
                    }else{
                        foundUser = foundUser.slice()[0]
                        const msg = {
                            to: foundUser.email,
                            from: 'developmenthub123@gmail.com',
                            subject: 'BUDGET CREATION ALERT',
                            html:     `Dear ${foundUser.fullName}. <br> The budget you are trying to create is greater than the available resources. Sorry!`,
                        };
                        sgMail.send(msg)
                        res.send({"message":"You are out of resources to contain this budget."})
                    }
                })
               
            }

            Budget.findByIdAndUpdate(req.params.id, {$push: {expenditure : newBudget }}, {new: true}, function (err, updatedBudget) {
                if(err){
                    res.send({"error":"Something went wrong."})
                }else{
                    updatedBudget.unallocated = updatedBudget.unallocated - parseInt(req.body.budget);
                    updatedBudget.save();
                    User.find({username : updatedBudget.username}, function(err, foundUser){
                        if(err){
                            console.log(err)
                        }else{
                            Budget.find({username : updatedBudget.username}).toArray(function(err, budget){
                                if(err){
                                    console.log(err)
                                }else{
                                    res.send({ "user": foundUser.toArray(), "budget":JSON.parse(circularStructureStringify(budget)), 
                                "message":"Item added successfully."});
                                }
                        })
                            
                        } 
                    })
                }
            })
        }
    })
    })


module.exports = router;
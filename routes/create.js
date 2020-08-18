var router = require("express").Router();
var mongoose = require("mongoose"),
    bodeyParser = require("body-parser"),
    cors = require("cors"),
    passport = require("passport"),
    User = require("../models/User"),
    Budget = require("../models/Budget"),
    isLoggedIn = require("../middleware/isLoggedIn");
    const circularStructureStringify = require('circular-structure-stringify');


// ==========CREATE A BUDGET==================================
router.post("/api/new", cors(), isLoggedIn, function (req, res) {
    User.find({ username: req.user.username }, function (err, foundUser1) {
        if (err || foundUser1.length === 0) {
            res.send({"error":"Something went wrong creating a new budget."})
        } else {
            let budget = {gross: req.body.gross, unallocated: parseInt(req.body.gross) - parseInt(req.body.budget), 
                expenditure:[{ title: req.body.title, budget: req.body.budget, expenses: 0 }]}
            Budget.create(budget, function(err, newBudget){
                if(err){
                    res.send({"error":"Something went wrong creating a new budget."})
                }else{
                    newBudget.username = req.user.username;
                    newBudget.save()
                    const msg = {
                        to: foundUser1.email,
                        from: 'developmenthub123@gmail.com',
                        subject: 'New Budget Created!',
                        html: `Way to go ${foundUser1.fullName}. <br> We can see that you just created a new budget profile. Keep up the good work! <br><br> Best Regards.`,
                    };
                    sgMail.send(msg)
                    Budget.find({username : req.user.username}).toArray((err, allData) => {
                        if(err){
                            res.send({'error':'Something went wrong.'})
                        }else{
                            res.send({ "user": foundUser1.toArray(), "budget":JSON.parse(circularStructureStringify(allData)), "message":"Budget created successfully."});
                        } 
                    })
                   
                }
            })
        }

    })
});


//==========================ADD BUDGET===================================
router.post("/api/:id/add", cors(), isLoggedIn, function (req, res) {
    Budget.findById(req.params.id, function (err, foundBudget) {
        if (err || foundBudget.length === 0) {
            res.send({"error":"Something went wrong."})
        } else {
            let newBudget = { title: req.body.title, budget: req.body.budget, expenses: 0 }
            Budget.findByIdAndUpdate(req.params.id, {$push: {expenditure : newBudget }}, {new: true}, function (err, updatedBudget) {
                if(err){
                    res.send({"error":"Something went wrong."})
                }else{
                    updatedBudget.unallocated = updatedBudget.unallocated - req.body.budget;
                    updatedBudget.save();
                    Budget.find({username : req.user.username}).toArray((err, allData) => {
                        if(err){
                            res.send({'error':'Something went wrong.'})
                        }else{
                            res.send({ "user": foundUser1.toArray(), "budget":JSON.parse(circularStructureStringify(allData)), 
                            "message":"Item added successfully."});
                        } 
                    })
                }
            })
        }

    })
});

module.exports = router;
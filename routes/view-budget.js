var router = require("express").Router();
var mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    User = require("../models/User"),
    cors = require("cors"),
    Budget = require("../models/Budget"),
    isLoggedIn = require("../middleware/isLoggedIn");
    const circularStructureStringify = require('circular-structure-stringify');


// ==========CREATE A BUDGET==================================
router.get("/api/budget", cors(), function (req, res) {
    User.find({ username: req.user.username }, function (err, foundUser1) {
        if (err || foundUser1.length === 0) {
            res.send({"error":"Something went wrong."})
        } else {
            Budget.find({username : req.user.username}).toArray((err, allData) => {
                if(err){
                    res.send({'error':'Something went wrong.'})
                }else{
                    res.send({ "user": foundUser1.toArray(), "budget":JSON.parse(circularStructureStringify(allData))
                    });
                } 
            })
        }

    })
});




module.exports = router;
const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Budget");
const isLoggedIn = require("../middleware/isLoggedIn");
const cors = require("cors");
const circularStructureStringify = require('circular-structure-stringify');


router.post("/api/:id/:item_id", cors(), isLoggedIn, function (req, res) {
    Budget.findById(req.params.id, function (err, foundBudget) {
        if (err || foundBudget.length === 0) {
            res.send({"error":"Something went wrong."})
        } else {
            const item = foundBudget.expenditure.find(item => String(item._id) === req.params.item_id);
            console.log(item)
            const updatedItem= {title:item.title, budget: item.budget, expenses: parseInt(req.body.amount)};
            const index = foundBudget.expenditure.indexOf(item);
            if(index !== -1){
                foundBudget.expenditure[index] = updatedItem;
                foundBudget.save();
                Budget.find({username : req.user.username}).toArray((err, allData) => {
                    if(err){
                        res.send({'error':'Something went wrong.'})
                    }else{
                        res.send({ "user": foundUser1.toArray(), "budget":JSON.parse(circularStructureStringify(allData)), 
                        "message":"Expenses recorded."});
                    } 
                })
            }else{
                res.send({"error":"Something went wrong."})
            }
        }

    })

});


module.exports = router;
const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const Budget = require("../models/Budget");
const isLoggedIn = require("../middleware/isLoggedIn");
const cors = require("cors");
const circularStructureStringify = require('circular-structure-stringify');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY);


router.post("/api/:id/:item_id", cors(), isLoggedIn, function (req, res) {
    Budget.findById(req.params.id, function (err, foundBudget) {
        if (err || foundBudget.length === 0) {
            res.send({"error":"Something went wrong."})
        } else {
            const item = foundBudget.expenditure.find(item => String(item._id) === req.params.item_id);
            if(parseInt(req.body.amount) > item.budget || parseInt(req.body.amount) > (item.budget - item.expenses)){
                res.send({"message": "You have spent over the budget. Unsuccessful operation."})
            }
            if((item.budget - item.expenses) < 0.05(item.budget)){
                User.find({username : foundBudget.username}, function(err, foundUser){
                    if(err){
                        console.log(err)
                    }else{
                        const msg = {
                            to: foundUser.email,
                            from: 'developmenthub123@gmail.com',
                            subject: 'EXPENSES ALERT!',
                            html:     `Dear ${foundUser.fullName}. <br> Expenses made on ${item.title} has overshot the 95% of the allocated budget! Watch it before you go broke!`,
                        };
                        sgMail.send(msg)
                    }
                })
               
            }
           
            const updatedItem= {title:item.title, budget: item.budget, expenses: parseInt(req.body.amount)};
            const index = foundBudget.expenditure.indexOf(item);
            if(index !== -1){
                foundBudget.expenditure[index] = updatedItem;
                foundBudget.save();
                Budget.find({username : foundBudget.username}).toArray((err, allData) => {
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
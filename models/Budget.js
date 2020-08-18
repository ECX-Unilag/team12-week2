const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
	gross: Number,
	unallocated: Number,
	username: String,
	expenditure:[{ title: String, budget: Number, expenses: Number }],
	created: { type: Date, default: Date.now } 
});

module.exports = Budget = mongoose.model("Budget", budgetSchema);




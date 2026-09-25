const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  title: {type: String,required: true,},
  owner: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true,},
  streak: {type: Number,default: 0,},
  lastCheckIn: {type: Date, default: null,},
  createdAt: {type: Date,default: Date.now,},
});

module.exports = mongoose.model("Habit", habitSchema);
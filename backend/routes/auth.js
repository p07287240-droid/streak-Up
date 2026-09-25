const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

router.post('/register',async(req,res,next)=>{
    try{
        const { name, email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();
        const normalizedName = name?.trim();
        if (!normalizedName || !normalizedEmail || !password) {
          return res.status(400).json({ error: "Name, email and password are required" });
        }
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) return res.status(409).json({ error: "An account with this email already exists" });
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({ name: normalizedName, email: normalizedEmail, password: hashedPassword });
        res.status(201).json({id: user._id,name: user.name,email: user.email});
    } catch (err) {next(err);}
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({id: user._id,name: user.name,email: user.email,});
  } catch (err) {next(err);
  }
});
module.exports = router;

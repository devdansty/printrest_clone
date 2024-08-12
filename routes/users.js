var express = require('express');
var router = express.Router();
const plm= require("passport-local-mongoose");

const mongoose=require("mongoose");

const schema=mongoose.Schema;
const user_schema = new schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add other fields as needed, such as profile picture, bio, etc.

})
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.plugin(plm);

module.exports = router;

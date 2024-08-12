var express = require('express');
var router = express.Router();
const plm= require('passport-local-mongoose');

const mongoose=require("mongoose");

const schema=mongoose.Schema;

const user_schema = new schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true, }
})

user_schema.plugin(plm);

const User = mongoose.model('User', user_schema);
module.exports = User;

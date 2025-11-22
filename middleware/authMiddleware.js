
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authRequired = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if(!token) return res.redirect('/users/login');
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const user = await User.findById(payload.id);
    if(!user) return res.redirect('/users/login');
    req.user = user;
    next();
  } catch(err){
    return res.redirect('/users/login');
  }
};

const ensureOwner = (modelName) => {
  // returns middleware to ensure req.user._id equals resource.user
  return async (req,res,next) => {
    const Model = require(`../models/${modelName}`);
    const doc = await Model.findById(req.params.id);
    if(!doc) return res.status(404).send('Not found');
    if(!doc.user.equals(req.user._id)){
      return res.status(403).send('Forbidden — not owner');
    }
    next();
  };
};

module.exports = { authRequired, ensureOwner };

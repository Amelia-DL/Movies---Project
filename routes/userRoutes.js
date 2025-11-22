
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

function validateEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.get('/register', (req,res) => {
  res.render('users/register', { errors: null, form: {} });
});

router.post('/register', async (req,res,next) => {
  try{
    const { username, email, password, password2 } = req.body;
    const errors = [];
    if(!username || !email || !password) errors.push('All fields required');
    if(!validateEmail(email)) errors.push('Email is invalid');
    if(password.length < 6) errors.push('Password must be at least 6 characters');
    if(password !== password2) errors.push('Passwords do not match');
    if(errors.length) return res.status(400).render('users/register', { errors, form: req.body });
    const existing = await User.findOne({ $or: [{email}, {username}] });
    if(existing) {
      errors.push('User with that email or username already exists');
      return res.status(400).render('users/register', { errors, form: req.body });
    }
    const user = new User({ username, email, password });
    await user.save();
    // create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly:true });
    res.redirect('/');
  }catch(e){ next(e); }
});

router.get('/login', (req,res) => {
  res.render('users/login', { errors:null });
});

router.post('/login', async (req,res,next) => {
  try{
    const { email, password } = req.body;
    const errors = [];
    if(!email || !password) {
      errors.push('All fields required');
      return res.status(400).render('users/login', { errors });
    }
    const user = await User.findOne({ email });
    if(!user) {
      errors.push('Invalid credentials');
      return res.status(401).render('users/login', { errors });
    }
    const match = await user.comparePassword(password);
    if(!match) {
      errors.push('Invalid credentials');
      return res.status(401).render('users/login', { errors });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly:true });
    res.redirect('/');
  }catch(e){ next(e); }
});

router.post('/logout', (req,res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;

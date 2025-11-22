
const express = require('express');
const router = express.Router();
const Movie = require('../models/movieModel');
const { authRequired, ensureOwner } = require('../middleware/authMiddleware');

function isIntString(s){
  return String(parseInt(s)) === String(s);
}

// home - list movies
router.get('/', async (req,res,next) => {
  try{
    const movies = await Movie.find().populate('user','username').sort({createdAt:-1}).limit(50);
    const user = req.cookies.token ? require('jsonwebtoken').verify(req.cookies.token, process.env.JWT_SECRET || 'devsecret') : null;
    res.render('index', { movies, user });
  }catch(e){ next(e); }
});

// add movie - form
router.get('/movies/add', authRequired, (req,res) => {
  res.render('movies/addMovie', { errors:null, form:{} });
});

// post add movie
router.post('/movies/add', authRequired, async (req,res,next) => {
  try{
    const { name, description, year, genres, rating } = req.body;
    const errors=[];
    if(!name || !description || !year) errors.push('Name, description, and year are required');
    if(year && (isNaN(Number(year)) || Number(year) < 1800 || Number(year) > new Date().getFullYear()+1)) errors.push('Year is invalid');
    if(rating && (isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 10)) errors.push('Rating must be between 0 and 10');
    if(errors.length) return res.status(400).render('movies/addMovie', { errors, form: req.body });
    const genresArr = genres ? genres.split(',').map(s=>s.trim()).filter(Boolean) : [];
    const user = require('jsonwebtoken').verify(req.cookies.token, process.env.JWT_SECRET || 'devsecret');
    const movie = new Movie({ name: String(name).trim(), description: String(description).trim(), year: Number(year), genres: genresArr, rating: Number(rating||0), user: user.id });
    await movie.save();
    res.redirect('/');
  }catch(e){ next(e); }
});

// details
router.get('/movies/:id', async (req,res,next) => {
  try{
    const movie = await Movie.findById(req.params.id).populate('user','username');
    if(!movie) return res.status(404).send('Not found');
    const user = req.cookies.token ? require('jsonwebtoken').verify(req.cookies.token, process.env.JWT_SECRET || 'devsecret') : null;
    res.render('movies/movieDetails', { movie, user });
  }catch(e){ next(e); }
});

// edit form
router.get('/movies/:id/edit', authRequired, ensureOwner('movieModel'), async (req,res,next) => {
  try{
    const movie = await Movie.findById(req.params.id);
    res.render('movies/editMovie', { errors:null, form: movie });
  }catch(e){ next(e); }
});

// update
router.put('/movies/:id', authRequired, ensureOwner('movieModel'), async (req,res,next) => {
  try{
    const { name, description, year, genres, rating } = req.body;
    const errors=[];
    if(!name || !description || !year) errors.push('Name, description, and year are required');
    if(year && (isNaN(Number(year)) || Number(year) < 1800 || Number(year) > new Date().getFullYear()+1)) errors.push('Year is invalid');
    if(rating && (isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 10)) errors.push('Rating must be between 0 and 10');
    if(errors.length) {
      const movie = await Movie.findById(req.params.id);
      return res.status(400).render('movies/editMovie', { errors, form: {...movie.toObject(), ...req.body} });
    }
    const genresArr = genres ? genres.split(',').map(s=>s.trim()).filter(Boolean) : [];
    await Movie.findByIdAndUpdate(req.params.id, { name: String(name).trim(), description: String(description).trim(), year: Number(year), genres: genresArr, rating: Number(rating||0) });
    res.redirect(`/movies/${req.params.id}`);
  }catch(e){ next(e); }
});

// delete
router.delete('/movies/:id', authRequired, ensureOwner('movieModel'), async (req,res,next) => {
  try{
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/');
  }catch(e){ next(e); }
});

module.exports = router;

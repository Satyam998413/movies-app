const express = require('express');
const { body } = require('express-validator');
const { auth, isAdmin } = require('../middleware/auth.middleware');
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesByGenre,
} = require('../controllers/movie.controller');

const router = express.Router();

// Validation middleware
const movieValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('releaseYear')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Please enter a valid release year'),
  body('genre').trim().notEmpty().withMessage('Genre is required'),
  body('director').trim().notEmpty().withMessage('Director is required'),
  body('posterUrl').isURL().withMessage('Please enter a valid poster URL'),
];

// Public routes
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.get('/genre/:genre', getMoviesByGenre);

// Protected routes (admin only)
router.post('/', auth, isAdmin, movieValidation, createMovie);
router.put('/:id', auth, isAdmin, movieValidation, updateMovie);
router.delete('/:id', auth, isAdmin, deleteMovie);

module.exports = router; 
const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth.middleware');
const {
  getMovieReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleLike,
} = require('../controllers/review.controller');

const router = express.Router();

// Validation middleware
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Review content must be at least 10 characters long'),
];

// Routes
router.get('/movie/:movieId', getMovieReviews);
router.post('/movie/:movieId', auth, reviewValidation, createReview);
router.put('/:id', auth, reviewValidation, updateReview);
router.delete('/:id', auth, deleteReview);
router.post('/:id/like', auth, toggleLike);

module.exports = router; 
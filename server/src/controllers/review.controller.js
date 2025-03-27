const { validationResult } = require('express-validator');
const Review = require('../models/review.model');
const Movie = require('../models/movie.model');
const User = require('../models/user.model');

const getMovieReviews = async (req, res) => {
  try {
    const { sort = 'recent', page = 1, limit = 10 } = req.query;
    const query = { movie: req.params.movieId };

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'popular':
        sortObj = { likes: -1, createdAt: -1 };
        break;
      case 'recent':
      default:
        sortObj = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const reviews = await Review.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username')
      .populate('likes', 'username');

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, content } = req.body;
    const movieId = req.params.movieId;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found.' });
    }

    // Check if user has already reviewed this movie
    const existingReview = await Review.findOne({
      movie: movieId,
      user: req.user._id,
    });
    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this movie.',
      });
    }

    // Create review
    const review = new Review({
      movie: movieId,
      user: req.user._id,
      rating,
      content,
    });

    await review.save();

    // Update movie's average rating
    await movie.updateAverageRating(rating);

    // Add review to movie's reviews array
    movie.reviews.push(review._id);
    await movie.save();

    // Populate user information
    await review.populate('user', 'username');

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    const { rating, content } = req.body;

    // Update review
    review.rating = rating;
    review.content = content;
    await review.save();

    // Update movie's average rating
    const movie = await Movie.findById(review.movie);
    await movie.updateAverageRating(rating);

    await review.populate('user', 'username');
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    const movie = await Movie.findById(review.movie);
    
    // Remove review from movie's reviews array
    movie.reviews = movie.reviews.filter(
      (reviewId) => reviewId.toString() !== review._id.toString()
    );

    // Update movie's average rating
    const allReviews = await Review.find({ movie: movie._id });
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
      movie.averageRating = totalRating / allReviews.length;
      movie.totalRatings = allReviews.length;
    } else {
      movie.averageRating = 0;
      movie.totalRatings = 0;
    }

    await movie.save();
    await review.remove();

    res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const toggleLike = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    await review.toggleLike(req.user._id);
    await review.populate('likes', 'username');

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getMovieReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleLike,
}; 
const { validationResult } = require('express-validator');
const Movie = require('../models/movie.model');

const getAllMovies = async (req, res) => {
  try {
    const { genre, sort, page = 1, limit = 10 } = req.query;
    const query = {};

    // Filter by genre if provided
    if (genre) {
      query.genre = genre;
    }

    // Build sort object
    let sortObj = {};
    if (sort) {
      switch (sort) {
        case 'rating':
          sortObj = { averageRating: -1 };
          break;
        case 'year':
          sortObj = { releaseYear: -1 };
          break;
        case 'title':
          sortObj = { title: 1 };
          break;
        default:
          sortObj = { createdAt: -1 };
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const movies = await Movie.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reviews', 'rating content user createdAt');

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'username',
        },
      });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found.' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const createMovie = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const movie = new Movie(req.body);
    await movie.save();

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const updateMovie = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found.' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found.' });
    }

    res.json({ message: 'Movie deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const getMoviesByGenre = async (req, res) => {
  try {
    const movies = await Movie.find({ genre: req.params.genre });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesByGenre,
}; 
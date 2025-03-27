const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    director: {
      type: String,
      required: true,
      trim: true,
    },
    cast: [{
      type: String,
      trim: true,
    }],
    posterUrl: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    }],
  },
  {
    timestamps: true,
  }
);

// Method to update average rating
movieSchema.methods.updateAverageRating = async function (newRating) {
  const total = this.averageRating * this.totalRatings + newRating;
  this.totalRatings += 1;
  this.averageRating = total / this.totalRatings;
  await this.save();
};

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie; 
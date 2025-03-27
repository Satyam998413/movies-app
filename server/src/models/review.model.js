const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
reviewSchema.index({ movie: 1, createdAt: -1 });
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

// Method to toggle like
reviewSchema.methods.toggleLike = async function (userId) {
  const index = this.likes.indexOf(userId);
  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }
  await this.save();
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 
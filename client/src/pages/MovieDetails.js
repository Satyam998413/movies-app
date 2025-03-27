import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMovieById, getMovieReviews, createReview, updateReview, deleteReview, toggleReviewLike } from '../services/movieService';
import { Button } from 'flowbite-react';
import { Modal } from 'flowbite-react';
import { Textarea } from 'flowbite-react';
import { Spinner } from 'flowbite-react';
import { Alert } from 'flowbite-react';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    content: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('newest');
  const [formErrors, setFormErrors] = useState({});
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
  }, [id, page, sort]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMovieById(id);
      setMovie(response);
    } catch (err) {
      setError('Failed to fetch movie details');
      console.error('Error fetching movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await getMovieReviews(id, {
        page,
        limit: 10,
        sort
      });
      setReviews(response.reviews);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to fetch reviews');
    }
  };

  const handleOpenReviewDialog = (review = null) => {
    if (review) {
      setEditingReview(review);
      setReviewForm({
        rating: review.rating,
        content: review.content
      });
    } else {
      setEditingReview(null);
      setReviewForm({
        rating: 0,
        content: ''
      });
    }
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setEditingReview(null);
    setReviewForm({
      rating: 0,
      content: ''
    });
    setFormErrors({});
  };

  const validateReviewForm = () => {
    const errors = {};
    if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }
    if (!reviewForm.content.trim()) {
      errors.content = 'Review content is required';
    } else if (reviewForm.content.trim().length < 10) {
      errors.content = 'Review content must be at least 10 characters long';
    }
    return errors;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const errors = validateReviewForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const reviewData = {
        rating: parseInt(reviewForm.rating),
        content: reviewForm.content.trim()
      };

      if (editingReview) {
        await updateReview(editingReview._id, reviewData);
      } else {
        await createReview(id, reviewData);
      }
      handleCloseReviewDialog();
      fetchReviews();
      fetchMovieDetails();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      fetchReviews();
      fetchMovieDetails();
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
    }
  };

  const handleToggleLike = async (reviewId) => {
    try {
      await toggleReviewLike(reviewId);
      fetchReviews();
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to update like status');
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert color="failure">{error}</Alert>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert color="info">Movie not found</Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="relative">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="xl" />
              </div>
            )}
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
              onLoad={handleImageLoad}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {movie.title}
          </h1>
          <div className="flex items-center mb-4">
            <span className="text-yellow-500">★</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {movie.averageRating.toFixed(1)} ({movie.totalRatings} ratings)
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {movie.releaseYear} • {movie.genre}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {movie.description}
          </p>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Director
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{movie.director}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Cast
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {movie.cast.join(', ')}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reviews
          </h2>
          {user && (
            <Button onClick={() => handleOpenReviewDialog()}>
              Write a Review
            </Button>
          )}
        </div>

        <div className="mb-6">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {review.user.username}
                  </h4>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-gray-600 dark:text-gray-400">
                      {review.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    color={review.likes.includes(user?._id) ? 'blue' : 'gray'}
                    onClick={() => handleToggleLike(review._id)}
                  >
                    {review.likes.length} Likes
                  </Button>
                  {user && (user._id === review.user._id || user.role === 'admin') && (
                    <>
                      <Button
                        size="sm"
                        color="blue"
                        onClick={() => handleOpenReviewDialog(review)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="failure"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {review.content}
              </p>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-8">
            No reviews yet
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  color={page === pageNum ? 'blue' : 'gray'}
                >
                  {pageNum}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      <Modal show={reviewDialogOpen} onClose={handleCloseReviewDialog} size="md">
        <Modal.Header>
          {editingReview ? 'Edit Review' : 'Write a Review'}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setReviewForm((prev) => ({ ...prev, rating: star }))
                    }
                    className={`text-2xl ${
                      star <= reviewForm.rating
                        ? 'text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {formErrors.rating && (
                <p className="text-red-500 text-xs italic mt-1">{formErrors.rating}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Review
              </label>
              <Textarea
                value={reviewForm.content}
                onChange={(e) =>
                  setReviewForm((prev) => ({ ...prev, content: e.target.value }))
                }
                color={formErrors.content ? 'failure' : 'gray'}
                helperText={formErrors.content}
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button color="gray" onClick={handleCloseReviewDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="blue"
                disabled={!reviewForm.rating || !reviewForm.content.trim()}
              >
                {editingReview ? 'Update' : 'Submit'}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MovieDetails; 
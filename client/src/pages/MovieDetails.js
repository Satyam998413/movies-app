import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import movieService from '../services/movieService';

const MovieDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    content: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('recent');

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
  }, [id, page, sort]);

  const fetchMovieDetails = async () => {
    try {
      const data = await movieService.getMovieById(id);
      setMovie(data);
    } catch (error) {
      setError('Failed to fetch movie details');
      console.error('Error fetching movie details:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await movieService.getMovieReviews(id, {
        page,
        sort,
      });
      setReviews(data.reviews);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewDialog = (review = null) => {
    if (review) {
      setEditingReview(review);
      setReviewForm({
        rating: review.rating,
        content: review.content,
      });
    } else {
      setEditingReview(null);
      setReviewForm({
        rating: 5,
        content: '',
      });
    }
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setEditingReview(null);
    setReviewForm({
      rating: 5,
      content: '',
    });
  };

  const handleReviewSubmit = async () => {
    try {
      if (editingReview) {
        await movieService.updateReview(editingReview._id, reviewForm);
      } else {
        await movieService.createReview(id, reviewForm);
      }
      handleCloseReviewDialog();
      fetchMovieDetails();
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await movieService.deleteReview(reviewId);
        fetchMovieDetails();
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleToggleLike = async (reviewId) => {
    try {
      await movieService.toggleReviewLike(reviewId);
      fetchReviews();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error || !movie) {
    return (
      <Container>
        <Typography color="error">{error || 'Movie not found'}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {movie.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {movie.releaseYear} • {movie.genre}
          </Typography>
          <Typography variant="body1" paragraph>
            {movie.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={movie.averageRating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({movie.totalRatings} ratings)
            </Typography>
          </Box>
          <Typography variant="subtitle1" gutterBottom>
            Director: {movie.director}
          </Typography>
          <Typography variant="subtitle1">
            Cast: {movie.cast.join(', ')}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Reviews</Typography>
          {user && (
            <Button
              variant="contained"
              onClick={() => handleOpenReviewDialog()}
            >
              Write a Review
            </Button>
          )}
        </Box>

        <FormControl sx={{ mb: 2, minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sort}
            label="Sort By"
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value="recent">Most Recent</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
          </Select>
        </FormControl>

        {reviews.map((review) => (
          <Paper key={review._id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle1">{review.user.username}</Typography>
                <Rating value={review.rating} readOnly size="small" />
              </Box>
              <Box>
                {user && user._id === review.user._id && (
                  <>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenReviewDialog(review)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
                <IconButton
                  size="small"
                  onClick={() => handleToggleLike(review._id)}
                >
                  {review.likes.includes(user?._id) ? (
                    <ThumbUpIcon color="primary" />
                  ) : (
                    <ThumbUpOutlinedIcon />
                  )}
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  {review.likes.length} likes
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {review.content}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(review.createdAt).toLocaleDateString()}
            </Typography>
          </Paper>
        ))}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Box>

      <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog}>
        <DialogTitle>
          {editingReview ? 'Edit Review' : 'Write a Review'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Rating
              value={reviewForm.rating}
              onChange={(e, value) =>
                setReviewForm({ ...reviewForm, rating: value })
              }
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Review"
              value={reviewForm.content}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, content: e.target.value })
              }
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button onClick={handleReviewSubmit} variant="contained">
            {editingReview ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MovieDetails; 
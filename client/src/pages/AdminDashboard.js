import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Box,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { movieService } from '../services/movieService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseYear: '',
    genre: '',
    director: '',
    cast: '',
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await movieService.getAllMovies();
      setMovies(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch movies');
      setLoading(false);
    }
  };

  const handleOpenDialog = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData({
        title: movie.title,
        description: movie.description,
        releaseYear: movie.releaseYear,
        genre: movie.genre,
        director: movie.director,
        cast: movie.cast.join(', '),
      });
    } else {
      setEditingMovie(null);
      setFormData({
        title: '',
        description: '',
        releaseYear: '',
        genre: '',
        director: '',
        cast: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMovie(null);
    setFormData({
      title: '',
      description: '',
      releaseYear: '',
      genre: '',
      director: '',
      cast: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const movieData = {
        ...formData,
        cast: formData.cast.split(',').map((actor) => actor.trim()),
      };

      if (editingMovie) {
        await movieService.updateMovie(editingMovie._id, movieData);
      } else {
        await movieService.createMovie(movieData);
      }

      handleCloseDialog();
      fetchMovies();
    } catch (err) {
      setError('Failed to save movie');
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await movieService.deleteMovie(movieId);
        fetchMovies();
      } catch (err) {
        setError('Failed to delete movie');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!user?.isAdmin) {
    return (
      <Container>
        <Alert severity="error">Access denied. Admin privileges required.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Movie
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {movie.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {movie.releaseYear} • {movie.genre}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Director: {movie.director}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Cast: {movie.cast.join(', ')}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(movie)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(movie._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMovie ? 'Edit Movie' : 'Add New Movie'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              label="Release Year"
              name="releaseYear"
              type="number"
              value={formData.releaseYear}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Director"
              name="director"
              value={formData.director}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Cast (comma-separated)"
              name="cast"
              value={formData.cast}
              onChange={handleChange}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingMovie ? 'Update' : 'Add'} Movie
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 
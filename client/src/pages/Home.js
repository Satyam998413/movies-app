import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  TextField,
} from '@mui/material';
import { Rating } from '@mui/material';
import movieService from '../services/movieService';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');

  const genres = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Sci-Fi',
    'Romance',
    'Documentary',
    'Animation',
  ];

  useEffect(() => {
    fetchMovies();
  }, [page, genre, sort, search]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        genre,
        sort,
        search,
      };
      const response = await movieService.getAllMovies(params);
      setMovies(response.movies);
      setTotalPages(response.totalPages);
    } catch (error) {
      setError('Failed to fetch movies');
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search movies"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select
                value={genre}
                label="Genre"
                onChange={(e) => setGenre(e.target.value)}
              >
                <MenuItem value="">All Genres</MenuItem>
                {genres.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sort}
                label="Sort By"
                onChange={(e) => setSort(e.target.value)}
              >
                <MenuItem value="">Latest</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="year">Year</MenuItem>
                <MenuItem value="title">Title</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {movies.map((movie) => (
          <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardActionArea
                component={RouterLink}
                to={`/movie/${movie._id}`}
                sx={{ flexGrow: 1 }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.posterUrl}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {movie.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {movie.releaseYear} • {movie.genre}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating
                      value={movie.averageRating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({movie.totalRatings})
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default Home; 
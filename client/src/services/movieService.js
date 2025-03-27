import axios from 'axios';

// declaration variables
let mqttHost = window.location.origin.split("//")[1].split(":")[0];
const API_URL = `http://${mqttHost}:5000/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Movie functions
export const getAllMovies = async (params = {}) => {
  const response = await api.get('/movies', { params });
  return response.data;
};

export const getMovieById = async (id) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const createMovie = async (movieData) => {
  const response = await api.post('/movies', movieData);
  return response.data;
};

export const updateMovie = async (id, movieData) => {
  const response = await api.put(`/movies/${id}`, movieData);
  return response.data;
};

export const deleteMovie = async (id) => {
  const response = await api.delete(`/movies/${id}`);
  return response.data;
};

export const getMoviesByGenre = async (genre) => {
  const response = await api.get(`/movies/genre/${genre}`);
  return response.data;
};

// Review functions
export const getMovieReviews = async (movieId, params = {}) => {
  const response = await api.get(`/reviews/movie/${movieId}`, { params });
  return response.data;
};

export const createReview = async (movieId, reviewData) => {
  const response = await api.post(`/reviews/movie/${movieId}`, reviewData);
  return response.data;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await api.put(`/reviews/${reviewId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

export const toggleReviewLike = async (reviewId) => {
  const response = await api.post(`/reviews/${reviewId}/like`);
  return response.data;
};

export default {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesByGenre,
  getMovieReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleReviewLike,
}; 
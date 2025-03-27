import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const movieService = {
  getAllMovies: async (params = {}) => {
    const response = await axios.get(`${API_URL}/movies`, { params });
    return response.data;
  },

  getMovieById: async (id) => {
    const response = await axios.get(`${API_URL}/movies/${id}`);
    return response.data;
  },

  createMovie: async (movieData) => {
    const response = await axios.post(`${API_URL}/movies`, movieData);
    return response.data;
  },

  updateMovie: async (id, movieData) => {
    const response = await axios.put(`${API_URL}/movies/${id}`, movieData);
    return response.data;
  },

  deleteMovie: async (id) => {
    const response = await axios.delete(`${API_URL}/movies/${id}`);
    return response.data;
  },

  getMoviesByGenre: async (genre) => {
    const response = await axios.get(`${API_URL}/movies/genre/${genre}`);
    return response.data;
  },

  getMovieReviews: async (movieId, params = {}) => {
    const response = await axios.get(`${API_URL}/reviews/movie/${movieId}`, {
      params,
    });
    return response.data;
  },

  createReview: async (movieId, reviewData) => {
    const response = await axios.post(
      `${API_URL}/reviews/movie/${movieId}`,
      reviewData
    );
    return response.data;
  },

  updateReview: async (reviewId, reviewData) => {
    const response = await axios.put(
      `${API_URL}/reviews/${reviewId}`,
      reviewData
    );
    return response.data;
  },

  deleteReview: async (reviewId) => {
    const response = await axios.delete(`${API_URL}/reviews/${reviewId}`);
    return response.data;
  },

  toggleReviewLike: async (reviewId) => {
    const response = await axios.post(`${API_URL}/reviews/${reviewId}/like`);
    return response.data;
  },
};

export default movieService; 
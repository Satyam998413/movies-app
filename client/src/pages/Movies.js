import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllMovies } from '../services/movieService';
import { Card } from 'flowbite-react';
import { Alert } from 'flowbite-react';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    genre: '',
    sort: 'recent',
    page: 1,
  });

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await getAllMovies(filters);
      setMovies(response.movies);
      setError(null);
    } catch (err) {
      setError('Failed to fetch movies');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert color="failure">{error}</Alert>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Movies</h1>
        <div className="flex space-x-4">
          <select
            name="genre"
            value={filters.genre}
            onChange={handleFilterChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Horror">Horror</option>
            <option value="Romance">Romance</option>
            <option value="Documentary">Documentary</option>
          </select>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
            <option value="year">Release Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link to={`/movies/${movie._id}`} key={movie._id}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {movie.releaseYear} • {movie.genre}
                </p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">
                    {movie.averageRating?.toFixed(1) || 'N/A'}
                  </span>
                  <span className="ml-2 text-gray-500">
                    ({movie.totalRatings || 0} ratings)
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                  {movie.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {movies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No movies found.</p>
        </div>
      )}
    </div>
  );
};

export default Movies; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';
import Image from '../components/Image';
import Loading from '../components/Loading';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [page, genre, sort, search]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await movieService.getAllMovies({
        page,
        limit: 12,
        genre,
        sort,
        search
      });
      setMovies(response.movies);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Failed to fetch movies');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  if (loading && page === 1) {
    return <Loading fullScreen />;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={handleSearch}
            className="input-field flex-1"
          />
          <select
            value={genre}
            onChange={handleGenreChange}
            className="input-field md:w-48"
          >
            <option value="">All Genres</option>
            <option value="action">Action</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="horror">Horror</option>
            <option value="sci-fi">Sci-Fi</option>
          </select>
          <select
            value={sort}
            onChange={handleSortChange}
            className="input-field md:w-48"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-alert mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link
            key={movie._id}
            to={`/movie/${movie._id}`}
            className="card hover:shadow-lg transition-shadow duration-300"
          >
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {movie.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {movie.releaseYear} • {movie.genre}
              </p>
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  {movie.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {movies.length === 0 && !loading && (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
          No movies found
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-4 py-2 rounded ${
                  page === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Home; 
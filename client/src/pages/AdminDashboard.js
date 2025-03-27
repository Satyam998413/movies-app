import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllMovies, createMovie, updateMovie, deleteMovie } from '../services/movieService';
import { Button } from 'flowbite-react';
import { Table } from 'flowbite-react';
import { Alert } from 'flowbite-react';
import { Modal } from 'flowbite-react';
import { TextInput, Label, Textarea } from 'flowbite-react';
import { Spinner } from 'flowbite-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseYear: '',
    genre: '',
    director: '',
    posterUrl: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchMovies();
  }, [navigate, currentPage]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await getAllMovies({ page: currentPage, limit: 10 });
      setMovies(response.movies || []);
      setTotalPages(response.totalPages || 1);
      setError(null);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError(error.response?.data?.message || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = (movieId) => {
    setImageLoading(prev => ({ ...prev, [movieId]: false }));
  };

  const handleImageError = (movieId) => {
    setImageLoading(prev => ({ ...prev, [movieId]: false }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.releaseYear) errors.releaseYear = 'Release year is required';
    if (!formData.genre.trim()) errors.genre = 'Genre is required';
    if (!formData.director.trim()) errors.director = 'Director is required';
    if (!formData.posterUrl.trim()) errors.posterUrl = 'Poster URL is required';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (editingMovie) {
        await updateMovie(editingMovie._id, formData);
      } else {
        await createMovie(formData);
      }
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        releaseYear: '',
        genre: '',
        director: '',
        posterUrl: '',
      });
      fetchMovies();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save movie');
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      releaseYear: movie.releaseYear,
      genre: movie.genre,
      director: movie.director,
      posterUrl: movie.posterUrl,
    });
    setShowModal(true);
  };

  const handleDeleteClick = (movie) => {
    setMovieToDelete(movie);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMovie(movieToDelete._id);
      setShowDeleteModal(false);
      setMovieToDelete(null);
      fetchMovies();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete movie');
    }
  };

  const handleAddNew = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      description: '',
      releaseYear: '',
      genre: '',
      director: '',
      posterUrl: '',
    });
    setShowModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.username}</p>
        </div>
        <div className="flex space-x-4">
          <Button onClick={handleAddNew}>Add New Movie</Button>
          <Button color="gray" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No movies found. Add your first movie!</p>
        </div>
      ) : (
        <>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Poster</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Genre</Table.HeadCell>
              <Table.HeadCell>Release Year</Table.HeadCell>
              <Table.HeadCell>Director</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {movies.map((movie) => (
                <Table.Row key={movie._id}>
                  <Table.Cell>
                    <div className="relative w-20 h-30">
                      {imageLoading[movie._id] !== false && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Spinner size="sm" />
                        </div>
                      )}
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-20 h-30 object-cover rounded"
                        onLoad={() => handleImageLoad(movie._id)}
                        onError={() => handleImageError(movie._id)}
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>{movie.title}</Table.Cell>
                  <Table.Cell>{movie.genre}</Table.Cell>
                  <Table.Cell>{movie.releaseYear}</Table.Cell>
                  <Table.Cell>{movie.director}</Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        color="blue"
                        onClick={() => handleEdit(movie)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="failure"
                        onClick={() => handleDeleteClick(movie)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              color="gray"
            >
              Previous
            </Button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              color="gray"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Add/Edit Movie Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Header>
          {editingMovie ? 'Edit Movie' : 'Add New Movie'}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <TextInput
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                color={formErrors.title ? 'failure' : 'gray'}
                helperText={formErrors.title}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                color={formErrors.description ? 'failure' : 'gray'}
                helperText={formErrors.description}
              />
            </div>

            <div>
              <Label htmlFor="releaseYear">Release Year</Label>
              <TextInput
                id="releaseYear"
                name="releaseYear"
                type="number"
                value={formData.releaseYear}
                onChange={handleChange}
                color={formErrors.releaseYear ? 'failure' : 'gray'}
                helperText={formErrors.releaseYear}
              />
            </div>

            <div>
              <Label htmlFor="genre">Genre</Label>
              <TextInput
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                color={formErrors.genre ? 'failure' : 'gray'}
                helperText={formErrors.genre}
              />
            </div>

            <div>
              <Label htmlFor="director">Director</Label>
              <TextInput
                id="director"
                name="director"
                value={formData.director}
                onChange={handleChange}
                color={formErrors.director ? 'failure' : 'gray'}
                helperText={formErrors.director}
              />
            </div>

            <div>
              <Label htmlFor="posterUrl">Poster URL</Label>
              <TextInput
                id="posterUrl"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                color={formErrors.posterUrl ? 'failure' : 'gray'}
                helperText={formErrors.posterUrl}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" color="blue">
                {editingMovie ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="md">
        <Modal.Header>Delete Movie</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p>Are you sure you want to delete this movie?</p>
            {movieToDelete && (
              <div className="flex items-center space-x-4">
                <img
                  src={movieToDelete.posterUrl}
                  alt={movieToDelete.title}
                  className="w-16 h-24 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{movieToDelete.title}</h3>
                  <p className="text-sm text-gray-500">{movieToDelete.genre} • {movieToDelete.releaseYear}</p>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end space-x-2">
            <Button color="gray" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button color="failure" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard; 
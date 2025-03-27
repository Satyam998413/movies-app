import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from 'flowbite-react';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} to="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Movie Rating App
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="/" active>
          Home
        </Navbar.Link>
       
        {user?.role === 'admin' && (
          <Navbar.Link as={Link} to="/admin">
            Admin Dashboard
          </Navbar.Link>
        )}
      </Navbar.Collapse>
      <Navbar.Collapse>
        {user ? (
          <>
            <Navbar.Link>
              Welcome, {user.username}
            </Navbar.Link>
            <Navbar.Link onClick={handleLogout}>
              Logout
            </Navbar.Link>
          </>
        ) : (
          <>
            <Navbar.Link as={Link} to="/login">
              Login
            </Navbar.Link>
            <Navbar.Link as={Link} to="/register">
              Register
            </Navbar.Link>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar; 
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from 'flowbite-react';
import { Alert } from 'flowbite-react';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert color="info">Please log in to view your profile.</Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Profile
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">{user.username}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <p className="mt-1 text-gray-900 dark:text-white capitalize">{user.role}</p>
            </div>
          </div>

          <div className="mt-6">
            <Button color="failure" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
# Movie Rating Website

A full-stack movie rating and review platform built with React.js, Node.js, and MongoDB.

## Features

- User authentication (signup/login) with JWT
- Movie listing and details
- Review and rating system
- Like/unlike reviews
- Review management (edit/delete)
- Admin dashboard for movie and review management
- Review sorting and pagination

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT

## Project Structure

```
movies-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── public/           # Static files
└── server/               # Node.js backend
    ├── src/
    │   ├── config/      # Configuration files
    │   ├── controllers/ # Route controllers
    │   ├── middleware/  # Custom middleware
    │   ├── models/      # MongoDB models
    │   ├── routes/      # API routes
    │   └── utils/       # Utility functions
    └── .env             # Environment variables
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd movies-app
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

4. Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. Start the backend server:
```bash
cd server
npm run dev
```

6. Start the frontend development server:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Movies
- GET /api/movies - Get all movies
- GET /api/movies/:id - Get movie details
- POST /api/movies - Create new movie (Admin only)
- PUT /api/movies/:id - Update movie (Admin only)
- DELETE /api/movies/:id - Delete movie (Admin only)

### Reviews
- GET /api/movies/:id/reviews - Get movie reviews
- POST /api/movies/:id/reviews - Create review
- PUT /api/reviews/:id - Update review
- DELETE /api/reviews/:id - Delete review
- POST /api/reviews/:id/like - Like/unlike review

## Testing

1. Run backend tests:
```bash
cd server
npm test
```

2. Run frontend tests:
```bash
cd client
npm test
```

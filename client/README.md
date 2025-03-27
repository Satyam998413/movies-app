# Movie Rating App - Client

This is the frontend client for the Movie Rating application. It provides a user interface for browsing movies, reading reviews, and managing movie data (for admin users).

## Features

- Browse movies with filtering and sorting options
- View detailed movie information
- Read and write reviews
- Like/unlike reviews
- User authentication (login/register)
- Admin dashboard for movie management
- Responsive design using Material-UI

## Tech Stack

- React.js
- React Router for navigation
- Material-UI for components and styling
- Axios for API requests
- Context API for state management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Backend server running on http://localhost:5000

## Setup

1. Clone the repository
2. Navigate to the client directory:
   ```bash
   cd client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000

## Project Structure

```
client/
├── public/
├── src/
│   ├── components/
│   │   └── Navbar.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── MovieDetails.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── AdminDashboard.js
│   ├── services/
│   │   └── movieService.js
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## API Integration

The client communicates with the backend API at http://localhost:5000. Make sure the backend server is running before starting the client application.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
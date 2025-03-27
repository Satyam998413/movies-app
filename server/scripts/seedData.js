const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/user.model');
const Movie = require('../src/models/movie.model');

const movies = [
  {
    title: "The Matrix Resurrections",
    description: "Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a construct, to truly know himself, Mr. Anderson will have to choose to follow the white rabbit once more.",
    releaseYear: 2025,
    genre: "Science Fiction",
    director: "Lana Wachowski",
    cast: ["Keanu Reeves", "Carrie-Anne Moss", "Yahya Abdul-Mateen II"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMGJkNDJlZWUtOGM1Ny00YjNwLThlMmUtZmluYW2M3NWQzNGMxXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg"
  },
  {
    title: "Avatar 3",
    description: "Jake Sully and Ney'tiri have formed a family and are doing everything to stay together. However, they must leave their home and explore the regions of Pandora when an ancient threat resurfaces.",
    releaseYear: 2025,
    genre: "Science Fiction",
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMzA2NDkwNTQtNzY5ZC00YjFmLTgwYzgtMGE1YjA1MmExNjQ4XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg"
  },
  {
    title: "Mission: Impossible 8",
    description: "Ethan Hunt and his IMF team embark on their most dangerous mission yet: to track down a terrifying new weapon that threatens all of humanity before it falls into the wrong hands.",
    releaseYear: 2025,
    genre: "Action",
    director: "Christopher McQuarrie",
    cast: ["Tom Cruise", "Hayley Atwell", "Ving Rhames"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTY3MDY2MzQ2NV5BMl5BanBnXkFtZTgwNDE2NzU1NTM@._V1_.jpg"
  },
  {
    title: "The Batman 2",
    description: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues. As the evidence begins to lead closer to home and the scale of the perpetrator's plans become clear, he must forge new relationships, unmask the culprit and bring justice to the abuse of power and corruption that has long plagued Gotham City.",
    releaseYear: 2025,
    genre: "Action",
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoe Kravitz", "Colin Farrell"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg"
  },
  {
    title: "Star Wars: Episode X",
    description: "The galaxy is in turmoil as a new threat emerges from the Unknown Regions. Rey must train a new generation of Jedi while confronting her own destiny.",
    releaseYear: 2025,
    genre: "Science Fiction",
    director: "Sharmeen Obaid-Chinoy",
    cast: ["Daisy Ridley", "Mark Hamill", "Oscar Isaac"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDljNTQ5ODItZmQwMy00M2ExLTljOTQtZTVjNGE2NTg0NGIxXkEyXkFqcGdeQXVyODkzNTgxMDg@._V1_.jpg"
  },
  {
    title: "Black Panther: Wakanda Forever",
    description: "The people of Wakanda fight to protect their home from intervening foreign powers in the wake of King T'Challa's death.",
    releaseYear: 2025,
    genre: "Action",
    director: "Ryan Coogler",
    cast: ["Letitia Wright", "Lupita Nyong'o", "Danai Gurira"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNTM4NjIxNmEtYWE5NS00NDczLTkyNWQtYThhNmQyZGQzMjM0XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg"
  },
  {
    title: "Indiana Jones and the Dial of Destiny",
    description: "Archaeologist Indiana Jones races against time to retrieve a legendary artifact that can change the course of history.",
    releaseYear: 2025,
    genre: "Adventure",
    director: "James Mangold",
    cast: ["Harrison Ford", "Phoebe Waller-Bridge", "Mads Mikkelsen"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZGM3MzA2ZmQtZDM4Yy00MzUyLWEyMDAtY2UyZjQ5NDU1YzgwXkEyXkFqcGdeQXVyNTA0OTU0OTg@._V1_.jpg"
  },
  {
    title: "The Flash",
    description: "Barry Allen uses his super speed to change the past, but his attempt to save his family creates a world without super heroes, forcing him to race for his life in order to save the future.",
    releaseYear: 2025,
    genre: "Action",
    director: "Andy Muschietti",
    cast: ["Ezra Miller", "Michael Keaton", "Sasha Calle"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDIzNzYwNTctZWY4Mi00YjQ2LWI5YWYtMzdmNDgwMGI4Yzk1XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg"
  },
  {
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    releaseYear: 2025,
    genre: "Science Fiction",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlNTU3YWEyZjkxXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg"
  },
  {
    title: "Spider-Man: Beyond the Spider-Verse",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    releaseYear: 2025,
    genre: "Animation",
    director: "Joaquim Dos Santos",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmEtMzU4MDQxYTMzMjU2XkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg"
  }
];

// Function to generate additional movies
const generateAdditionalMovies = () => {
  const genres = [
    "Action", "Science Fiction", "Drama", "Comedy", "Horror", 
    "Romance", "Thriller", "Animation", "Documentary", "Fantasy"
  ];
  
  const directors = [
    "Christopher Nolan", "Martin Scorsese", "Steven Spielberg", 
    "Quentin Tarantino", "David Fincher", "Peter Jackson", 
    "James Cameron", "Ridley Scott", "Alfonso Cuarón", "Denis Villeneuve"
  ];

  const additionalMovies = [];
  const movieCount = 95; // To reach 100+ with the original movies

  for (let i = 0; i < movieCount; i++) {
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const director = directors[Math.floor(Math.random() * directors.length)];
    const year = 2025;
    const movieNumber = i + 1;

    additionalMovies.push({
      title: `Movie ${movieNumber}: ${genre} Adventure`,
      description: `An epic ${genre.toLowerCase()} story that will keep you on the edge of your seat. Directed by ${director}, this masterpiece explores the depths of human imagination and emotion.`,
      releaseYear: year,
      genre: genre,
      director: director,
      cast: [
        "Actor 1", "Actor 2", "Actor 3", "Actor 4", "Actor 5"
      ],
      posterUrl: `https://picsum.photos/seed/${movieNumber}/500/750`
    });
  }

  return additionalMovies;
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/movie-rating-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});
    await Movie.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin@123', 10);
    const adminUser = new User({
      username: 'admin',
      role:"admin",
      email: 'admin@example.com',
      password: hashedPassword,
      isAdmin: true,
    });
    await adminUser.save();

    // Combine original movies with generated ones
    const allMovies = [...movies, ...generateAdditionalMovies()];

    // Add all movies
    for (const movie of allMovies) {
      const newMovie = new Movie(movie);
      await newMovie.save();
    }

    console.log(`Database seeded successfully! Added ${allMovies.length} movies.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const tmdbHeaders = {
  Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  "Content-Type": "application/json"
};

const getTrendingMovies = async (req, res) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/trending/movie/week?language=fr-FR`, {
      method: "GET",
      headers: tmdbHeaders
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const formattedMovies = data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      original_title: movie.original_title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      popularity: movie.popularity
    }));

    res.json(formattedMovies);
  } catch (error) {
    console.error("Erreur TMDB trending :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des films tendances" });
  }
};

const searchMovies = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ message: "Le paramètre q est obligatoire" });
    }

    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=fr-FR`,
      {
        method: "GET",
        headers: tmdbHeaders
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const formattedMovies = data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      original_title: movie.original_title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      popularity: movie.popularity
    }));

    res.json(formattedMovies);
  } catch (error) {
    console.error("Erreur TMDB search :", error);
    res.status(500).json({ message: "Erreur serveur lors de la recherche de films" });
  }
};

const getMovieDetails = async (req, res) => {
  try {
    const movieId = req.params.id;

    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?language=fr-FR`,
      {
        method: "GET",
        headers: tmdbHeaders
      }
    );

    const movie = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(movie);
    }

    const formattedMovie = {
      id: movie.id,
      title: movie.title,
      original_title: movie.original_title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      runtime: movie.runtime,
      genres: movie.genres,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      popularity: movie.popularity,
      budget: movie.budget,
      revenue: movie.revenue,
      status: movie.status
    };

    res.json(formattedMovie);
  } catch (error) {
    console.error("Erreur TMDB details :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du film" });
  }
};

module.exports = {
  getTrendingMovies,
  searchMovies,
  getMovieDetails
};
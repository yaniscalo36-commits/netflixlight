const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/movies.controller");

router.get("/trending", moviesController.getTrendingMovies);
router.get("/search", moviesController.searchMovies);
router.get("/:id", moviesController.getMovieDetails);

module.exports = router;
const express = require("express");
const router = express.Router();
const tmdbController = require("../controllers/tmdb.controller");

router.get("/test", tmdbController.testMovie);
router.get("/search", tmdbController.searchMovies);

module.exports = router;
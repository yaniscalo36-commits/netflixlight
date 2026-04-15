const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

router.post("/register", usersController.registerUser);
router.post("/authentification", usersController.loginUser);

module.exports = router;
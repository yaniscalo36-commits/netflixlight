require("dotenv").config();

const express = require("express");
const path = require("path");

const usersRoutes = require("./src/routes/users.routes");
const moviesRoutes = require("./src/routes/movies.routes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "web", "static")));

app.use("/api/users", usersRoutes);
app.use("/api/movies", moviesRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "templates", "index.html"));
});

app.get("/favoris.html", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "templates", "favoris.html"));
})

app.get("/film.html", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "templates", "film.html"));
})

app.get("/lecteur.html", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "templates", "lecteur.html"));
})

app.get("/authentification.html", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "templates", "login.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "templates", "register.html"));
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
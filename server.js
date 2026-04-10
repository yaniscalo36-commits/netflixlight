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

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
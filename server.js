const express = require("express");
const dotenv = require("dotenv").config();
const usersRoutes = require("./src/routes/users.routes");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "web", "static")));

app.use("/src/routes", usersRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "templates", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
const express = require("express");
const usersRoutes = require("./src/routes/users.routes");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "web", "static")));

app.use("/src/routes", usersRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "web", "static", "templates", "index.html"));
});

app.use("/api/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
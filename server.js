const express = require("express");
const usersRoutes = require("./src/routes/users.routes");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Node + SQLite OK");
});

app.use("/api/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
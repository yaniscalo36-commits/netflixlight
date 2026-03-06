const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "app.db");

console.log("Chemin DB :", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erreur de connexion a SQLite :", err.message);
  } else {
    console.log("Connexion SQLite réussie");
  }
});

module.exports = db;
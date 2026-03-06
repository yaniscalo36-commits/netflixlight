const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "data", "app.db");

const db = new sqlite3.Database(dbPath, (err) =>  {
    if (err) {
        console.error("Erreur de connexion a SQLite :", err.message);
    } else {
        console.log("Connecté à SQLite");
    }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);
});

module.exports = db;

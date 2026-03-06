const db = require("../data/database");

const getAllUsers = (req, res) => {
  const sql = "SELECT * FROM users";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
};

const getUserById = (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM users WHERE id = ?";

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(row);
  });
};

const createUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Les champs name et email sont obligatoires"
    });
  }

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";

  db.run(sql, [name, email], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      name,
      email
    });
  });
};

const updateUser = (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Les champs name et email sont obligatoires"
    });
  }

  const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";

  db.run(sql, [name, email, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({
      message: "Utilisateur mis à jour",
      user: {
        id: Number(id),
        name,
        email
      }
    });
  });
};

const deleteUser = (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur supprimé" });
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
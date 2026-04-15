const db = require("../data/database");
const crypto = require("crypto");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, originalHash] = storedHash.split(":");

  const hashBuffer = crypto.scryptSync(password, salt, 64);
  const originalHashBuffer = Buffer.from(originalHash, "hex");

  if (hashBuffer.length !== originalHashBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(hashBuffer, originalHashBuffer);
}

const registerUser = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Les champs username, email et password sont obligatoires"
    });
  }

  const checkSql = "SELECT id FROM users WHERE email = ?";

  db.get(checkSql, [email], (err, existingUser) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (existingUser) {
      return res.status(409).json({
        message: "Un compte avec cet email existe déjà"
      });
    }

    const passwordHash = hashPassword(password);

    const insertSql = `
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `;

    db.run(insertSql, [username, email, passwordHash], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Inscription réussie",
        user: {
          id: this.lastID,
          username,
          email
        }
      });
    });
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Les champs email et password sont obligatoires"
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.get(sql, [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    const isValidPassword = verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    res.json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  });
};

module.exports = {
  registerUser,
  loginUser
};
<<<<<<< HEAD
const API_BASE = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_BASE}/users/login`, {
=======
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("/api/users/login", {
>>>>>>> features/script
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

<<<<<<< HEAD
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "index.html";
      } else {
        alert("Email ou mot de passe incorrect");
      }

    } catch (err) {
      alert("Erreur serveur");
    }
  });
});
=======
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erreur lors de la connexion");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Connexion réussie");
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Erreur login :", error);
      alert("Erreur serveur");
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erreur lors de l'inscription");
        return;
      }

      alert("Inscription réussie, vous pouvez maintenant vous connecter");
      window.location.href = "/login.html";
    } catch (error) {
      console.error("Erreur register :", error);
      alert("Erreur serveur");
    }
  });
}
>>>>>>> features/script

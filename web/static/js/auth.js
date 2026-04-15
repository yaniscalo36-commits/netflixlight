const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

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
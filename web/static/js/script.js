const API_BASE = "http://localhost:3000/api";


// ==================== FETCH ====================
async function fetchData(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error("Erreur API");
    return await res.json();
  } catch (err) {
    console.error("Erreur API :", err);
    return null;
  }
}


// ==================== AFFICHAGE FILMS ====================
function displayMovies(movies, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !movies) return;

  container.innerHTML = "";

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" />
      <div class="info">
        <h4>${movie.title || movie.name}</h4>
        <p>⭐ ${movie.vote_average}</p>
        <p>${movie.release_date?.split("-")[0] || ""}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `film.html?id=${movie.id}`;
    });

    container.appendChild(card);
  });
}


// ==================== HERO SLIDER ====================
let heroMovies = [];
let currentIndex = 0;
let interval;

function showHero(index) {
  const movie = heroMovies[index];
  const hero = document.getElementById("hero");

  if (!hero || !movie) return;

  hero.style.backgroundImage =
    `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

  document.getElementById("heroTitle").textContent =
    movie.title || movie.name;

  document.getElementById("heroInfo").textContent =
    movie.overview || "Pas de description";
}

function nextSlide() {
  if (heroMovies.length === 0) return;
  currentIndex = (currentIndex + 1) % heroMovies.length;
  showHero(currentIndex);
}

function prevSlide() {
  if (heroMovies.length === 0) return;
  currentIndex = (currentIndex - 1 + heroMovies.length) % heroMovies.length;
  showHero(currentIndex);
}

function startAutoSlide() {
  clearInterval(interval);
  interval = setInterval(nextSlide, 5000);
}


// ==================== PAGE ACCUEIL ====================
async function loadHome() {
  const trending = await fetchData("/movies/trending");

  if (!trending || trending.length === 0) return;

  // 🎬 HERO
  heroMovies = trending.slice(0, 5);
  showHero(0);
  startAutoSlide();

  // 🔥 TENDANCES
  displayMovies(trending.slice(0, 15), "trending");

  // 🎥 FILMS (ceux avec title)
  const moviesOnly = trending.filter(m => m.title);
  displayMovies(moviesOnly.slice(0, 15), "movies");

  // 📺 SERIES (ceux avec name)
  const seriesOnly = trending.filter(m => m.name);
  displayMovies(seriesOnly.slice(0, 15), "series");

  // ⭐ TOP RATED
  const topRated = [...trending]
    .filter(m => m.vote_average)
    .sort((a, b) => b.vote_average - a.vote_average);

  displayMovies(topRated.slice(0, 15), "top");

  // 🎬 ACTION
  const action = trending.filter(m => m.genre_ids?.includes(28));
  displayMovies(action.slice(0, 15), "action");

  // 😂 COMEDIE
  const comedy = trending.filter(m => m.genre_ids?.includes(35));
  displayMovies(comedy.slice(0, 15), "comedy");
}


// ==================== PAGE DETAIL ====================
async function loadFilmDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  const movie = await fetchData(`/movies/${id}`);
  if (!movie) return;

  // 🎬 HERO
  const hero = document.getElementById("filmHero");

  if (hero) {
    hero.style.backgroundImage =
      `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

    document.getElementById("filmTitle").textContent =
      movie.title || movie.name;

    document.getElementById("filmOverview").textContent =
      movie.overview || "Pas de description";

    document.getElementById("filmInfo").textContent =
      `⭐ ${movie.vote_average} | ${movie.release_date}`;
  }

  // ❤️ FAVORIS
  setupFavoriteButton(movie);

  // 🎭 CAST
  loadCast(id);

  // 🎬 SIMILAIRES
  loadSimilar(id);
}


// ==================== CAST ====================
async function loadCast(id) {
  const data = await fetchData(`/movies/${id}/credits`);
  if (!data || !data.cast) return;

  const container = document.getElementById("cast");
  if (!container) return;

  container.innerHTML = "";

  data.cast.slice(0, 10).forEach(actor => {
    if (!actor.profile_path) return;

    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${actor.profile_path}" />
      <div class="info">
        <h4>${actor.name}</h4>
        <p>${actor.character}</p>
      </div>
    `;

    container.appendChild(div);
  });
}


// ==================== SIMILAIRES ====================
async function loadSimilar(id) {
  const data = await fetchData(`/movies/${id}/similar`);
  if (!data) return;

  displayMovies(data, "similar");
}


// ==================== FAVORIS ====================
function setupFavoriteButton(movie) {
  const btn = document.getElementById("favBtn");
  if (!btn) return;

  let favoris = JSON.parse(localStorage.getItem("favoris")) || [];

  const isFav = favoris.find(f => f.id === movie.id);

  if (isFav) {
    btn.textContent = "Retirer des favoris";
  }

  btn.addEventListener("click", () => {
    let favoris = JSON.parse(localStorage.getItem("favoris")) || [];

    const index = favoris.findIndex(f => f.id === movie.id);

    if (index !== -1) {
      favoris.splice(index, 1);
      btn.textContent = "Ajouter aux favoris";
    } else {
      favoris.push(movie);
      btn.textContent = "Retirer des favoris";
    }

    localStorage.setItem("favoris", JSON.stringify(favoris));
  });
}


// ==================== LOGIN ====================
function setupLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      alert("Connexion réussie !");
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "index.html";
    } else {
      alert("Erreur de connexion");
    }
  });
}


// ==================== FAVORIS PAGE ====================
function loadFavoris() {
  const container = document.getElementById("favorisList");
  if (!container) return;

  const favoris = JSON.parse(localStorage.getItem("favoris")) || [];

  if (favoris.length === 0) {
    container.innerHTML = "<p>Aucun favori.</p>";
    return;
  }

  container.innerHTML = "";

  favoris.forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" />
      <p>${movie.title}</p>
    `;

    container.appendChild(div);
  });
}


// ==================== INIT GLOBAL ====================
document.addEventListener("DOMContentLoaded", () => {
  loadHome();
  loadFilmDetail();
  setupLogin();
  loadFavoris();

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);
  }
});
const API_BASE = "http://localhost:3000/api";

// ==================== FETCH ====================
async function fetchData(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`); //requete
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) { //données json
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

    const favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    const isFav = favoris.some(f => f.id === movie.id);

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" />

      <div class="info">
        <h4>${movie.title || movie.name}</h4>
        <p>⭐ ${movie.vote_average}</p>
        <p>${movie.release_date?.split("-")[0] || ""}</p>

        <div class="card-buttons">
          <button class="btn-detail">Détails</button>
          <button class="btn-fav">${isFav ? "Retirer" : "Favoris"}</button>
        </div>
      </div>
    `;

    // bouton détails
    card.querySelector(".btn-detail").onclick = (e) => {
      e.stopPropagation();
      window.location.href = `film.html?id=${movie.id}`;
    };

    // bouton favoris
    const favBtn = card.querySelector(".btn-fav");

    favBtn.onclick = (e) => {
      e.stopPropagation();

      let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
      const index = favoris.findIndex(f => f.id === movie.id);

      if (index !== -1) {
        favoris.splice(index, 1);


        if (containerId === "favorisList") {
          card.remove();
        } else {
          favBtn.textContent = "Favoris";
        }

      } else {
        favoris.push(movie);
        favBtn.textContent = "Retirer";
      }

      localStorage.setItem("favoris", JSON.stringify(favoris));
    };

    // clic carte
    card.onclick = () => {
      window.location.href = `film.html?id=${movie.id}`;
    };

    container.appendChild(card);
  });
}

// ==================== HERO ====================
let heroMovies = [];
let currentIndex = 0;
let interval;

function showHero(index) {
  const movie = heroMovies[index];
  const hero = document.getElementById("hero");

  if (!hero || !movie) return;

  hero.style.backgroundImage =
    `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

  document.getElementById("heroTitle").textContent = movie.title || movie.name;
  document.getElementById("heroInfo").textContent = movie.overview || "Pas de description";

  const detailBtn = document.getElementById("heroDetail");
  const favBtn = document.getElementById("heroFav");

  if (detailBtn) {
    detailBtn.onclick = () => {
      window.location.href = `film.html?id=${movie.id}`;
    };
  }

  if (favBtn) {
    let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    const isFav = favoris.some(f => f.id === movie.id);

    favBtn.textContent = isFav ? "Retirer" : "Favoris";

    favBtn.onclick = () => {
      let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
      const index = favoris.findIndex(f => f.id === movie.id);

      if (index !== -1) {
        favoris.splice(index, 1);
        favBtn.textContent = "Favoris";
      } else {
        favoris.push(movie);
        favBtn.textContent = "Retirer";
      }

      localStorage.setItem("favoris", JSON.stringify(favoris));
    };
  }
}

function nextSlide() {

  currentIndex = (currentIndex + 1) % heroMovies.length;
  showHero(currentIndex);
}

function startAutoSlide() {
  clearInterval(interval);
  interval = setInterval(nextSlide, 5000);
}

// ==================== PAGE ACCUEIL ====================
async function loadHome() {
  const trending = await fetchData("/movies/trending");
  if (!trending) return;

  heroMovies = trending.slice(0, 5);
  currentIndex = 0;
  showHero(currentIndex);
  startAutoSlide();

  displayMovies(trending.slice(0, 15), "trending");
  displayMovies(trending.slice(0, 15), "movies");
  displayMovies(trending.slice(5, 20), "series");

  const topRated = [...trending].sort((a, b) => b.vote_average - a.vote_average);
  displayMovies(topRated.slice(0, 15), "top");

  displayMovies(trending.slice(0, 10), "action");
  displayMovies(trending.slice(10, 20), "comedy");
}

// ==================== PAGE DETAIL ====================
async function loadFilmDetail() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  const movie = await fetchData(`/movies/${id}`);
  if (!movie) return;

  const hero = document.getElementById("filmHero");

  if (hero && movie.backdrop_path) {
    hero.style.backgroundImage =
      `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
  }

  document.getElementById("filmTitle").textContent = movie.title || movie.name;
  document.getElementById("filmOverview").textContent = movie.overview || "Pas de description";

  let info = `Note : ${movie.vote_average}`;

  if (movie.release_date) info += ` | ${movie.release_date}`;
  if (movie.runtime) info += ` | ${movie.runtime} min`;
  if (movie.genres) info += ` | ${movie.genres.map(g => g.name).join(", ")}`;

  document.getElementById("filmInfo").textContent = info;

  setupFavoriteButton(movie);
}

// ==================== FAVORIS DETAIL ====================
function setupFavoriteButton(movie) {
  const btn = document.getElementById("favBtn");
  if (!btn) return;

  let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
  const isFav = favoris.some(f => f.id === movie.id);

  if (isFav) btn.textContent = "Retirer des favoris";

  btn.onclick = () => {
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
  };
}

// ==================== PAGE FAVORIS ====================
function loadFavoris() {
  const container = document.getElementById("favorisList");
  if (!container) return;

  const favoris = JSON.parse(localStorage.getItem("favoris")) || [];
  if (!favoris.length) {
    container.innerHTML = "<p>Aucun favori.</p>";
    return;
  }

  displayMovies(favoris, "favorisList");
}
// ==================== LECTEUR VIDEO ====================
function initPlayer() {
  const video = document.getElementById("video");
  if (!video) return;

  const playPause = document.getElementById("playPause");
  const progress = document.getElementById("progress");
  const progressBar = document.getElementById("progressBar");
  const volume = document.getElementById("volume");
  const muteBtn = document.getElementById("mute");
  const timeDisplay = document.getElementById("time");
  const fullscreenBtn = document.getElementById("fullscreen");
  const controls = document.getElementById("controls");
  const player = document.getElementById("player");

  playPause.onclick = () => {
    if (video.paused) {
      video.play();
      playPause.textContent = "⏸";
    } else {
      video.pause();
      playPause.textContent = "▶";
    }
  };
  video.ontimeupdate = () => {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.width = percent + "%";
    const format = t => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, "0")}`;
    timeDisplay.textContent = `${format(video.currentTime)} / ${format(video.duration || 0)}`;
  };
  progress.onclick = (e) => {
    const rect = progress.getBoundingClientRect();
    video.currentTime = ((e.clientX - rect.left) / rect.width) * video.duration;
  };
  volume.oninput = () => video.volume = volume.value;
  muteBtn.onclick = () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
  };
  fullscreenBtn.onclick = () => {
    document.fullscreenElement ? document.exitFullscreen() : player.requestFullscreen();
  };
  let timeout;
  const showControls = () => {
    controls.classList.remove("hidden");
    clearTimeout(timeout);
    timeout = setTimeout(() => controls.classList.add("hidden"), 3000);
  };
  player.onmousemove = showControls;
  player.onclick = showControls;
}
// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
  loadHome();
  loadFilmDetail();
  loadFavoris();
  initPlayer();
  initTheme();
});
// ==================== THEME ====================

function initTheme() {
  const toggleBtn = document.getElementById("themeToggle");

  // récupérer le thème sauvegardé
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    if (toggleBtn) toggleBtn.textContent = "Mode sombre";
  }

  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    const isLight = document.body.classList.contains("light-mode");

    // sauvegarde
    localStorage.setItem("theme", isLight ? "light" : "dark");

    // changer texte bouton
    toggleBtn.textContent = isLight ? "Mode sombre" : "Mode clair";
  });
}

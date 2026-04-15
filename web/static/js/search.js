const searchInput = document.getElementById("searchInput");

let timer;

//  évite trop de requêtes pendant la saisie
function debounce(callback, delay) {
  return (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(value), delay);
  };
}

//  recherche principale
async function searchMovies(query) {
  const section = document.getElementById("searchSection");
  // cache si vide ou trop court
  if (!query || query.length < 2) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";

  try {
    const res = await fetch(`${API_BASE}/movies/search?q=${encodeURIComponent(query)}`);
    const movies = await res.json();

    displayMovies(movies, "searchResults");

  } catch (err) {
    console.error("Erreur recherche :", err);
  }
}

// version avec debounce
const search = debounce(searchMovies, 300);

// écoute utilisateur
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    search(e.target.value);
  });
}
const searchInput = document.getElementById("searchInput");

let debounceTimer;

// debounce 300ms
function debounceSearch(callback, delay) {
  return (...args) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => callback(...args), delay);
  };
}

// fonction principale
async function handleSearch(query) {
  const section = document.getElementById("searchSection");

  if (!query || query.length < 2) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";

  try {
    const res = await fetch(`${API_BASE}/movies/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    displayMovies(data, "searchResults");

  } catch (err) {
    console.error("Erreur recherche :", err);
  }
}

// version avec debounce
const debouncedSearch = debounceSearch(handleSearch, 300);

// écoute input
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    debouncedSearch(e.target.value);
  });
}
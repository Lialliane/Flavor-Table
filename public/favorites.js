document.addEventListener("DOMContentLoaded", () => {
  const favoritesDiv = document.getElementById("favoritesList");
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  function renderFavorites() {
    if (favorites.length === 0) {
      favoritesDiv.innerHTML = "<p id='error'>No favorites yet.</p>";
      return;
    }

    favoritesDiv.innerHTML = favorites.map((f, index) => `
      <div class="card" onclick="openRecipe('${f.id}')">
        <h3>${f.title}</h3>
        <img src="${f.image}" alt="${f.title}">
        <button onclick="removeFavorite(${index}, event)">Remove</button>
      </div>
    `).join("");
  }

  renderFavorites();

  window.removeFavorite = (index, event) => {
    event.stopPropagation();
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  };
});

async function openRecipe(id)
{
  window.location.href = `/recipeDetails.html?id=${id}`;
}

document.addEventListener("DOMContentLoaded", loadFavorites);

async function loadFavorites() {
  const res = await fetch("/favorites");
  const data = await res.json();
  console.log(data);

  const favoritesDiv = document.getElementById("favoritesList");

  favoritesDiv.innerHTML = data.map(recipe => `
    <div class="card" onclick="openRecipe('${recipe.recipe_id}')">
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}">
      <button onclick="removeFavorite(${recipe.id}, event)">Delete</button>
    </div>
  `).join("");
}

async function removeFavorite(id, event) {
  event.stopPropagation();
  await fetch(`/favorites/${id}`, { method: "DELETE" });
  loadFavorites();
}

async function openRecipe(id)
{
  console.log(id);
  window.location.href = `/recipeDetails.html?id=${id}`;
}


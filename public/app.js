document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  
  if (searchButton) {
      searchButton.addEventListener("click", search);
  }
});

function saveFavorite(title, image, id, event) {
  event.stopPropagation();
  console.log("clicked button");
  console.log(event);
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push({ title, image , id });
  localStorage.setItem("favorites", JSON.stringify(favorites));
}


async function search() {
  const resultsDiv = document.getElementById("results");
  try {
    const ingredients = document.getElementById("ingredient-input").value;
    const response = await fetch(`/recipes/search?ingredients=${ingredients}`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error ${response.status}: ${text}`);
    }

    const data = await response.json();

    console.log(data);

    if(!data.length)
    {
      throw("Nothing Found :(");
    }
  
    resultsDiv.innerHTML = data.map(res =>
        `<div id=${res.title} class="card" onclick="openRecipe('${res.id}')">
          <h3>${res.title}</h3>
          <img src="${res.image}" alt="${res.title}">
          <p>Used: ${res.usedIngredients.join(", ")}</p>
          <p>Missing: ${res.missedIngredients.join(", ")}</p>
          <button onclick="saveFavorite('${res.title}', '${res.image}' , '${res.id}' , event)">Save</button>
        </div>`
      ).join("");
  } 
  catch (err) {
      console.error("Search failed:", err);
      resultsDiv.innerHTML = `<p id="error">Search failed: ${err.message? err.message: err}</p>`;
  }
}

async function openRecipe(id)
{
  window.location.href = `/recipeDetails.html?id=${id}`;
}
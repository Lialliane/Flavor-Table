document.addEventListener("DOMContentLoaded", async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    console.log(id);

    const response = await fetch(`/recipes/details/${id}`);
    const data = await response.json();

    const recipeDiv = document.getElementById("recipe");
    console.log(data);

    recipeDiv.innerHTML = `
      <h2>${data.title}</h2>
      <img src="${data.image}" alt="${data.title}">
      <div>
        <h4>Servings: ${data.servings? data.servings: "-"}</h4>
        <h4>Cooking time: ${data.cookingTime?data.cookingTime: "-"}</h4>
        <h4>Total prep time:${data.duration? data.duration: "-"} </h4>
      </div>
      <ol>${data.ingredients.map(ingredient => `<li>${ingredient}</li>`).join("")}</ol>
      <p>${data.instructions}</p>
      <button onclick="saveFavorite('${data.title}', '${data.image}', '${data.id}')">Save</button>
    `;
    
  } 
  catch (error) {
    console.error(error);
    document.getElementById("recipe").textContent = "Failed to load recipe :(";
  }
});

function saveFavorite(title, image, id) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push({ title, image , id });
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
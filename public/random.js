document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/recipes/random");
    const data = await res.json();

    const recipeDiv = document.getElementById("recipe");

    recipeDiv.innerHTML = `
      <h2>${data.title}</h2>
      <img src="${data.image}" alt="${data.title}">
      <div>
        <h4>Servings: ${data.servings? data.servings: "-"}</h4>
        <h4>Cooking time: ${data.cookingTime?data.cookingTime: "-"}</h4>
        <h4>Total prep time:${data.readyin? data.readyin: "-"} </h4>
      </div>
      <ol>${data.ingredients.map(ingredient => `<li>${ingredient}</li>`).join("")}</ol>
      <p>${data.instructions}</p>
      <button onclick="saveFavorite('${data.title}', 
      '${data.image}', 
      '${data.recipe_id? data.recipe_id: data.id}', 
      '${data.instructions}', 
      '${data.ingredients}', 
      '${data.readyin}',)">Save</button>
    `;
    
  } 
  catch (error) {
    console.error(error);
    document.getElementById("recipe").textContent = "Failed to load recipe :(";
  }
});


async function saveFavorite(title, image, id, instructions, ingredients, readyin) {
  
  await fetch("/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, title, image, instructions, ingredients, readyin })
  });
}



document.addEventListener("DOMContentLoaded", async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    let exist = 0;
    let ingredients;

    const res = await fetch("/favorites");
    let data = await res.json();

    console.log(data);

    let i;
    for(i = 0; i < data.length; i++)
    {
      if(data[i].recipe_id == id)
      {
        exist = 1;
        break ;
      }
    }
    if(!exist)
    {
      const response = await fetch(`/recipes/details/${id}`);
      data = await response.json();
      ingredients = data.ingredients;
    }
    else
      data = data[i];

    const recipeDiv = document.getElementById("recipe");

    recipeDiv.innerHTML = `
      <h2>${data.title}</h2>
      <img src="${data.image}" alt="${data.title}">
      <div>
        <h4>Servings: ${data.servings? data.servings: "-"}</h4>
        <h4>Cooking time: ${data.cookingTime? data.cookingTime: "-"}</h4>
        <h4>Total prep time:${data.readyin? data.readyin: "-"} </h4>
      </div>
      <ol>${data.ingredients.map(ingredient => `<li>${ingredient}</li>`).join("")}</ol>
      <p>${data.instructions}</p>
      ${exist 
      ? `<button onclick="editRecipe(
        '${data.id}', 
        '${data.title}',
        '${data.image}',
        '${data.instructions}',
        '${data.ingredients}',
        '${data.readyin}')">Edit Recipe</button>`
      : `<button onclick="saveFavorite(
        \`${data.title}\`, 
        \`${data.image}\`, 
        '${data.recipe_id}', 
        \`${data.instructions}\`, 
        \`${data.ingredients}\`, 
        \`${data.readyin}\`)">Save</button>`}`;
    
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

async function editRecipe(id, title, image, instructions, ingredients, readyin)
{
  window.location.href = `/editRecipe.html?id=${id}&title=${title}&image=${image}&instructions=${instructions}&ingredients=${ingredients}&readyin=${readyin}`;
}
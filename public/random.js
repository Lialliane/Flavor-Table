document.addEventListener("DOMContentLoaded", async () => {
  editIfLoggedIn();

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
      <button onclick="saveFavorite('${escapeJS(data.title)}', 
      '${escapeJS(data.image)}', 
      '${escapeJS(data.recipe_id? data.recipe_id: data.id)}', 
      '${escapeJS(data.instructions)}', 
      '${escapeJS(data.ingredients)}', 
      '${escapeJS(data.readyin)}',)">Save</button>
    `;
    
  } 
  catch (error) {
    console.error(error);
    document.getElementById("recipe").textContent = "Failed to load recipe :(";
  }
});


async function saveFavorite(title, image, id, instructions, ingredients, readyin) {

  const token = localStorage.getItem("token");
  if(!token)
  {
    openModal('modal-1', "<h3> you need to login to save recipes!</h3>");
    return ;
  }
  
  await fetch("/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, title, image, instructions, ingredients, readyin })
  });
}

function openModal(id, contentHTML) {
  
    let content = document.getElementById("content");
    content.innerHTML = contentHTML;
    
    document.getElementById(id).classList.add('open');
    document.body.classList.add('modal-open');
}

function closeModal() {
    document.querySelector('.modal.open').classList.remove('open');
    document.body.classList.remove('modal-open');
}


function editIfLoggedIn() 
{
  const nav = document.querySelector("nav");
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  if (token) {
    const payload = decodeToken(token);
    console.log(payload);
    const name = payload?.username || "Unknown";

    const loginButton = document.getElementById("login-nav");
    if (loginButton) {
      nav.removeChild(loginButton);
    }
    document.getElementById("fav-nav").classList.remove("hidden");
    const profileItem = document.createElement("div");
    profileItem.classList.add("nav-item");
    let contentHTML = `<h2>Name: ${name}</h2><h2>Email: ${email}</h2>`;
    profileItem.innerHTML = `
      <img src="./profile.png" alt="profile icon"/>
      <a onclick="openModal('modal-1', '${contentHTML}')" href="#">Profile</a>
    `;

    nav.appendChild(profileItem);
  }
  else
  {
    document.getElementById("fav-nav").classList.add("hidden");
  }
};

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}

function escapeJS(str) 
{
  if(typeof(str) == 'string')
  {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, "\\n");
  }
  else
      return str;
}
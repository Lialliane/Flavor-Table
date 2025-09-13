document.addEventListener("DOMContentLoaded", () => {
  loadFavorites();

  const nav = document.querySelector("nav");
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const payload = decodeToken(token);
  const name = payload?.username || "Unknown";

  const profileItem = document.createElement("div");
  profileItem.classList.add("nav-item");
  let contentHTML = `<h2>Name: ${name}</h2><h2>Email: ${email}</h2>`;
  profileItem.innerHTML = `
    <img src="./profile.png" alt="profile icon"/>
    <a onclick="openModal('modal-1', '${contentHTML}')" href="#">Profile</a>
  `;

  nav.appendChild(profileItem);
});



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

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}

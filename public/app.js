document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  
  if (searchButton) {
      searchButton.addEventListener("click", search);
  }

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
});

async function saveFavorite(title, image, id, event) {
  event.stopPropagation();
  const token = localStorage.getItem("token");
  if(!token)
  {
    openModal('modal-1', "<h3> you need to login to save recipes!</h3>");
    return ;
  }

  const response = await fetch(`/recipes/details/${id}`);
  const data = await response.json();

  await fetch("/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      id, 
      title , 
      image , 
      instructions: data.instructions,
      ingredients: data.ingredients, 
      readyin: data.readyin })
  });
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
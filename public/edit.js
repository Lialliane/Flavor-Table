document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const title = params.get("title");
    const image = params.get("image");
    const instructions = params.get("instructions");
    const ingredients = params.get("ingredients");
    const readyin = params.get("readyin");


    if (!id) {
        document.getElementById("recipe").innerHTML = "Failed to load recipe :(";
        return ;
    }

    document.getElementById("recipeId").value = id;
    document.getElementById("title").value = title;
    document.getElementById("image").value = image;
    document.getElementById("instructions").value = instructions || "";
    document.getElementById("ingredients").value = ingredients ? ingredients : "";
    document.getElementById("readyin").value = readyin || "";

    document.getElementById("editForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const updated = {
            title: document.getElementById("title").value,
            image: document.getElementById("image").value,
            instructions: document.getElementById("instructions").value,
            ingredients: document.getElementById("ingredients").value.split(",").map(i => i.trim()),
            readyin: document.getElementById("readyin").value
        };

        await fetch(`/favorites/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
        });

        window.location.href = "favorites.html";
    });
});
let email = document.getElementById("email-input");
let username = document.getElementById("username-input");
let password = document.getElementById("password-input");
let button = document.getElementById("login-button");
let current_tab = "login";


let inActiveTab = document.getElementById("register-tab");

inActiveTab.addEventListener("click" , switchTab);

document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const updated = current_tab === "login"
    ? { username: username.value, password: password.value }
    : { username: username.value, email: email.value, password: password.value };

    const response = await fetch(`/api/auth/${current_tab}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.log(errorText);
        openModal("modal-1", `<h3>${errorText}</h3>`);
        return;
    }

    const data = await response.json();

    if (current_tab === "login") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email.value);
        window.location.href = "index.html";
    } else {
        openModal("modal-1", `<h3>Registration successful! Please log in.</h3>`);
        switchTab();
    }
});


function switchTab()
{
    let loginTab = document.getElementById("login-tab");
    let registerTab = document.getElementById("register-tab");

    if(registerTab.classList.contains("inactive"))
    {
        registerTab.classList.remove("inactive");
        current_tab = "register";
        email.classList.remove("hidden");
        email.required = true;
        registerTab.removeEventListener("click", switchTab);
        loginTab.classList.add("inactive");
        loginTab.addEventListener("click", switchTab);
        
    }
    else
    {
        loginTab.classList.remove("inactive");
        current_tab = "login";
        email.classList.add("hidden");
        email.required = false;
        loginTab.removeEventListener("click", switchTab);
        registerTab.classList.add("inactive");
        registerTab.addEventListener("click", switchTab);
    }
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
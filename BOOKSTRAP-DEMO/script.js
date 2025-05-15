function checkUser() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const message  = document.getElementById("message").value

    const validUsername = "alainazpt@gmail.com";
    const validPassword = "12345";

    if (username === validUsername && password === validPassword) {
        message.style.color = "green";
        message.textContent = "Login successful!";
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);
    } else {
        message.style.color = "red";
        message.textContent = "Invalid username or password";
    }
}

    
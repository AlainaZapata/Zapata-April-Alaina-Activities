document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting in the default way

    // Get the form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Prepare the data to send in the POST request
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Send the login request via AJAX
    fetch('/check_user', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // If login is successful, redirect to the dashboard
            window.location.href = '/dashboard';
        } else {
            // Show error message if login fails
            document.getElementById('error-message').innerText = 'Invalid username or password';
        }
    })
    .catch(error => {
        // Handle any errors that occur during the fetch
        document.getElementById('error-message').innerText = 'An error occurred. Please try again later.';
    });
});

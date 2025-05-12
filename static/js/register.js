document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting in the default way

    // Get the form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        document.getElementById('error-message').innerText = 'Passwords do not match.';
        return;
    }

    // Prepare the data to send in the POST request
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Send the registration request via AJAX
    fetch('/create_user', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User created successfully') {
            // Redirect to login page if registration is successful
            window.location.href = '/';
        } else {
            // Show error message if registration fails
            document.getElementById('error-message').innerText = 'An error occurred. Please try again.';
        }
    })
    .catch(error => {
        // Handle any errors that occur during the fetch
        document.getElementById('error-message').innerText = 'An error occurred. Please try again later.';
    });
});

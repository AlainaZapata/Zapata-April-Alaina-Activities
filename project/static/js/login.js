document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    
    // Check if the error parameter is in the URL
    if (params.get("error") === "1") {
        showAlert("Incorrect username or password.");
    }
});

function showAlert(message) {
    // Create a div element for the alert
    const alertBox = document.createElement("div");

    // Updated class names for the alert with more refined design
    alertBox.className = "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full flex justify-between items-center p-4 bg-red-600 text-white text-lg font-semibold rounded-xl shadow-xl transition-all duration-300 opacity-100";

    alertBox.innerHTML = `
        <div class="flex items-center space-x-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 12 2c5.523 0 10 4.477 10 10z"></path>
            </svg>
            <span class="text-sm sm:text-base font-medium">${message}</span>
        </div>
        <button onclick="closeAlert(this)" class="ml-4 bg-red-700 hover:bg-red-800 rounded-full p-2 focus:outline-none transition-all duration-300">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    `;
    
    // Add the alert to the body
    document.body.appendChild(alertBox);

    // Hide the alert after 5 seconds
    setTimeout(() => {
        alertBox.classList.remove("opacity-100");
        alertBox.classList.add("opacity-0");
        
        // Remove alert after fade-out transition
        setTimeout(() => {
            alertBox.remove();
        }, 300);
    }, 5000); // The alert will disappear after 5 seconds
}

// Close the alert manually when the close button is clicked
function closeAlert(button) {
    const alertBox = button.closest('div');
    alertBox.classList.remove("opacity-100");
    alertBox.classList.add("opacity-0");
    
    setTimeout(() => {
        alertBox.remove();
    }, 300); // Duration of the fade-out effect
}

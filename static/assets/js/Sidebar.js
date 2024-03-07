// Call the functions when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Immediately collapse the sidebar on page load
    document.querySelector(".sidebar").classList.add("collapsed");

    // Add click event listener for toggling
    document.getElementById("navbar-toggler-icon").addEventListener("click", function() {
        document.querySelector(".sidebar").classList.toggle("collapsed");
    });
});



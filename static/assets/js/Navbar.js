document.addEventListener("DOMContentLoaded", function() {
    // Check authentication status
    fetch('/api/authentication/status', {
        credentials: 'include', // Include credentials to ensure session cookies are sent
    })
    .then(response => response.json())
    .then(data => {
        var isLoggedIn = data.isLoggedIn;
        var loginStatusElement = document.querySelector(".logged-in");
        var signInButtonElement = document.querySelector(".navbar-button-sign-in");

        if (!isLoggedIn) {
            loginStatusElement.style.display = "none";
            signInButtonElement.style.display = "flex";
        } else {
            var fullNameLink = document.querySelector("#user-full-name .nav-link");
            fullNameLink.innerText = data.firstName + " " + data.lastName;
            fullNameLink.href = fullNameLink.getAttribute('data-profile-url');
        }
    })
    .catch(error => {
        console.error('Error fetching authentication status:', error);
        document.querySelector(".logged-in").style.display = "none";
        document.querySelector(".navbar-button-sign-in").style.display = "flex";
    });

    // Logout functionality
    var logoutButton = document.querySelector("#logout .nav-link");
    logoutButton.addEventListener("click", function(event) {
        event.preventDefault();

        fetch('/api/authentication/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials for session management
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect on successful logout
                window.location.href = data.redirect_url;
            } else {
                console.error('Error during logout:', data.error);
            }
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');

    searchInput.addEventListener('input', debounce(function(e) {
        const query = e.target.value;
        if (query.length < 3) {
            resultsContainer.innerHTML = '';
            return;
        }

        fetch(`/api/global-relationships/search/?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Ensure session cookies are included
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Search endpoint not found');
            }
            return response.json();
        })
        .then(data => {
            resultsContainer.innerHTML = '';
            if (data && data.length > 0) {
                // Eliminate duplicates based on type and unique_id
                const uniqueData = eliminateDuplicates(data);
                
                uniqueData.forEach(item => {
                    const div = document.createElement('div');
                    div.textContent = `${item.display_text} (${item.type})`;
                    div.addEventListener('click', function() {
                        selectResult(item.type, item.unique_id);
                    });
                    resultsContainer.appendChild(div);
                });
            } else {
                resultsContainer.innerHTML = 'No results found';
            }

            // Explicitly force the display to 'block'
            resultsContainer.style.display = 'block'; 
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            resultsContainer.innerHTML = 'Error fetching search results';
        });
    }, 250));

    // Function to eliminate duplicates from search results
    function eliminateDuplicates(data) {
        const uniqueResults = [];
        const uniqueKeys = new Set();

        data.forEach(item => {
            const key = `${item.type}_${item.unique_id}`;
            if (!uniqueKeys.has(key)) {
                uniqueKeys.add(key);
                uniqueResults.push(item);
            }
        });

        return uniqueResults;
    }

    // Selection functionality
    function selectResult(type, uniqueId) {
        fetch(`/api/global-relationships/select/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: type, unique_id: uniqueId }),
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Selection successful:', data);
            } else {
                console.error('Selection failed:', data.error);
            }
        })
        .catch(error => console.error('Error selecting result:', error));
    }
});

// Debounce function to limit how often a function can fire
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
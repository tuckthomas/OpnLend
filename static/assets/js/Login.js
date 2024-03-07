document.addEventListener('DOMContentLoaded', function() {
    // Function to parse query string and return value for a given key
    function getQueryParam(param) {
        var search = window.location.search.substring(1);
        var params = new URLSearchParams(search);
        return params.get(param);
    }

    // Auto-fill the email field if 'email' query param is present
    var emailInput = document.getElementById('exampleInputEmail');
    var emailParam = getQueryParam('email');
    if (emailInput && emailParam) {
        emailInput.value = decodeURIComponent(emailParam);
    }

    var loginForm = document.querySelector('.user'); // Assuming 'user' is the class of your form

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission

            var email = document.getElementById('exampleInputEmail').value;
            var password = document.getElementById('exampleInputPassword').value;

            fetch('/api/authentication/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect_url;
                } else {
                    showPopupMessage('Login failed: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                showPopupMessage('Error: ' + error.message);
            });
        });
    }

    function showPopupMessage(message) {
        // Remove existing popup if any
        let existingPopup = document.getElementById('loginErrorPopup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Create the popup container
        let popup = document.createElement('div');
        popup.id = 'loginErrorPopup';
        popup.style.position = 'fixed';
        popup.style.bottom = '20px';
        popup.style.right = '20px';
        popup.style.padding = '10px';
        popup.style.border = '1px solid #FF0000';
        popup.style.backgroundColor = 'white';
        popup.style.color = 'black';
        popup.style.zIndex = '1000';
        popup.style.borderRadius = '5px';
        popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';

        // Add the message to the popup
        popup.textContent = message;

        // Add a close button
        let closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.marginLeft = '10px';
        closeButton.style.color = 'red';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.onclick = function() {
            popup.remove();
        };

        popup.appendChild(closeButton);

        // Show the popup
        document.body.appendChild(popup);

        // Automatically close after 5 seconds
        setTimeout(() => {
            if (popup) {
                popup.remove();
            }
        }, 5000);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting in the traditional way

        // Collect form data into an object
        var formData = {
            first_name: document.getElementById('firstName'),
            last_name: document.getElementById('lastName'),
            email: document.getElementById('email'),
            password: document.getElementById('password'),
            password_repeat: document.getElementById('passwordRepeat'),
            company_name: document.getElementById('companyName'),
            job_title: document.getElementById('jobTitle'),
        };

        // Client-side validation
        var missingFields = [];
        var isValid = true;

        Object.keys(formData).forEach(function(key) {
            var element = formData[key];
            if (!element.value.trim()) {
                // Highlight the input field with a thicker red border
                element.style.border = '4px solid #8B0000'; // Darker shade of red
                isValid = false;
                missingFields.push(key.replace('_', ' '));
            } else {
                // Reset the border style if the field is not missing
                element.style.border = '';
            }
        });

        // Password match validation
        if (formData.password.value !== formData.password_repeat.value) {
            alert('Passwords do not match.');
            return;
        }

        // Password strength validation
        var password = formData.password.value;
        if (password.length < 12) {
            alert('Password must be at least 12 characters long.');
            return;
        }

        if (!/\d/.test(password)) {
            alert('Password must contain at least one numeric digit.');
            return;
        }

        if (!/(?=.*[A-Z])/.test(password)) {
            alert('Password must contain at least one uppercase letter.');
            return;
        }

        // Send the registration request to the server
        fetch('/api/authentication/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: formData.first_name.value,
                last_name: formData.last_name.value,
                email: formData.email.value,
                password: formData.password.value,
                password_repeat: formData.password_repeat.value,
                company_name: formData.company_name.value,
                job_title: formData.job_title.value,
            }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data));
            }
            return response.json();
        })
        .then(data => {
            if(data.success) {
                // If registration is successful, redirect to the URL provided by the server
                window.location.href = data.redirect_url;
            } else {
                // If the server responds with an error, alert the user
                alert('Registration failed: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        });
    });

    // Navigate to Login Page if 'I Have an Account' button is pressed
    var loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', function() {
        var url = this.getAttribute('data-url'); // Retrieve the URL from the data-url attribute
        if(url) {
            window.location.href = url; // Navigate to the specified URL
        } else {
            console.error('URL not found');
        }
    });

});

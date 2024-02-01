document.querySelectorAll('.Dropdown-List').forEach(dropdownList => {
    dropdownList.querySelector('.dropdown-toggle').addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default behavior on the dropdown toggle
        e.stopPropagation(); // Stop the event from bubbling up to parent elements

        var dropdownMenu = dropdownList.querySelector('.dropdown-menu');
        dropdownMenu.classList.toggle('show'); // Toggle the visibility of the dropdown menu
    });

    dropdownList.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default behavior on dropdown items
            e.stopPropagation(); // Stop the event from bubbling up to parent elements

            var dropdownButton = dropdownList.querySelector('.dropdown-toggle');
            dropdownButton.textContent = this.textContent; // Update button text

            if (dropdownList.contains(document.getElementById('businessPropertyTypeInput'))) {
                document.getElementById('businessPropertyTypeInput').value = this.textContent;
            } else if (dropdownList.contains(document.getElementById('personalPropertyTypeInput'))) {
                document.getElementById('personalPropertyTypeInput').value = this.textContent;
            }

            var dropdownMenu = dropdownList.querySelector('.dropdown-menu');
            dropdownMenu.classList.remove('show'); // Hide the dropdown menu
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    getCsrfToken() 

    // Add New Global Relationship Button Event
    var button = document.querySelector('[button-name="Add-New-Global-Relationship"]');
    if (button) {
        button.addEventListener('click', clearFormAndUpdateSessionStorage);
    }
    
    // Function to initialize the display property of elements
    function initializeDisplayProperty() {
        // Selectors for specific forms to hide
        const formsToHide = [
            '.Tabular-Form[data-form-id="Business-Account-Management-Form"]',
            '.Tabular-Form[data-form-id="Personal-Account-Management-Form"]'
        ];
    
        // Initialize elements
        document.querySelectorAll('.Tabular-Form, .table-responsive').forEach(element => {
            // Set initial opacity and transition
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.5s ease';

            // Hide the specific forms by default
            if (formsToHide.some(selector => element.matches(selector))) {
                element.style.display = "none";
            } else {
                element.style.display = "block";
                // Allow a moment for display change, then set opacity
                setTimeout(() => element.style.opacity = '1', 10);
                populateSessionDataIntoFields();
            }
        });
    }

    initializeDisplayProperty() 

    function toggleVisibility(element) {
        console.log("Toggling visibility for element:", element);
        // Check if the element is currently visible
        if (element.style.display === "none") {
            element.style.display = "block";
            // Set opacity to '1' after a very short delay to ensure display change is rendered
            setTimeout(() => {
                element.style.opacity = '1'; // Smooth transition for showing

                // Check if the target form is a descendant of the element
                const businessAccountForm = element.querySelector('.Business-Account-Form');
                const accountAddressForm = element.querySelector('.Account-Address-Form');

                if (businessAccountForm && !businessAccountForm.dataset.eventAttached) {
                    console.log("Business Account Form is now visible, attaching event handler.");
                    attachFormSubmitHandler(businessAccountForm); // Attach handler to the business account form
                }

                if (accountAddressForm && !accountAddressForm.dataset.eventAttached) {
                    console.log("Account Address Form is now visible, attaching event handler.");
                    attachAccountAddressFormSubmitHandler(accountAddressForm); // Attach handler to the account address form
                }

            }, 250);
        } else {
            element.style.opacity = '0';
            // Wait for the opacity transition to finish before setting display to 'none'
            setTimeout(() => element.style.display = 'none', 500); // Smooth transition for hiding
        }
    }

    // Adding event listeners to all SVG icons
    const icons = document.querySelectorAll('svg[data-form-target]');
    console.log("Found icons: ", icons.length);

    icons.forEach(icon => {
        console.log("Adding listener to icon: ", icon);
        icon.addEventListener('click', function() {
            // Get the data-form-target of the clicked icon
            const targetId = this.getAttribute('data-form-target');
            console.log("Clicked icon, targetId: ", targetId);

            // Find the corresponding element (form or table)
            const targetElement = document.querySelector(`.Tabular-Form[data-form-id="${targetId}"], .table-responsive[data-form-id="${targetId}"]`);
            console.log("Target element: ", targetElement);

            // Toggle the visibility of the element
            if (targetElement) {
                toggleVisibility(targetElement);
                copyValuesToForm()
            }
        });
    });
    
    // Attach event listeners
    attachEventListeners()
    
    // Handles jointly condition-based jointly reported individual fields
    handleTaxFilingStatusChange()
    
    // Calls functoin to format the tables
    styleTable()
    
});

// Function that consolidates attaching event listeners
function attachEventListeners() {
    var headOfHouseholdRadio = document.getElementById('headOfHousehold');
    var jointlyReportedRadio = document.getElementById('jointlyReported');

    headOfHouseholdRadio.addEventListener('change', handleTaxFilingStatusChange);
    jointlyReportedRadio.addEventListener('change', handleTaxFilingStatusChange);
}

// Submits Account Address Forms to Server
function attachAccountAddressFormSubmitHandler(form) {
    console.log('Attaching submit event handler to Account Address Form');
    form.dataset.eventAttached = 'true';

    // Attach event listeners to dropdown items
    document.querySelectorAll('.Dropdown-List .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            var dropdownButton = document.getElementById('dropdownMenuButton');
            dropdownButton.textContent = this.textContent;
            var propertyTypeInput = form.querySelector('input[name="Property_Type"]');
            if (propertyTypeInput) {
                propertyTypeInput.value = this.textContent;
            }
        });
    });

    // Function to copy values into the form from session data
    function copyValuesIntoForm() {
        // Obtain session data values from hidden input fields
        var globalRelationshipID = document.querySelector('input[name="Global_Relationship_ID"]').value;
        var uniqueID = document.querySelector('input[name="Unique_ID"]').value;

        // Populate the form fields with these values
        var formGlobalRelationshipID = form.querySelector('input[name="Global_Relationship_ID"]');
        var formUniqueID = form.querySelector('input[name="Unique_ID"]');

        if (formGlobalRelationshipID) {
            formGlobalRelationshipID.value = globalRelationshipID;
        }
        if (formUniqueID) {
            formUniqueID.value = uniqueID;
        }
    }

    // Attach event listener to the form's submit event
    form.addEventListener('submit', function(e) {
        console.log('Account Address Form submit event triggered');
        e.preventDefault(); // Prevent default form submission

        copyValuesIntoForm(); // Copy values into the form before submitting

        var formData = new FormData(this);
        
        // Log formData for debugging
        console.log('Form Data:', Array.from(formData.entries()));

        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCsrfToken()
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Handle success
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors
        });
    });
}

// Formats the tables to interchange colors of rows beginning with the Header row and every other thereafter
function styleTable() {
    // Style the header cells
    var headerCells = document.querySelectorAll('.table thead th');
    headerCells.forEach(function(cell) {
        cell.style.backgroundColor = 'rgba(23, 75, 84, 0.20'; // Corrected color: Primary color with 15% opacity
        cell.style.textAlign = 'left';
    });

    // Style every other table row starting from the first row after the header
    var tableRows = document.querySelectorAll('.table tbody tr');
    tableRows.forEach(function(row, index) {
        if (index % 2 === 0) { // Odd rows (0-indexed)
            row.style.backgroundColor = 'rgba(23, 75, 84, 0.20)'; // Corrected color: Primary color with 15% opacity for odd rows
        } else { // Even rows
            row.style.backgroundColor = '#ffffff'; // White for even rows
        }
    });
}

// Handles hiding or unhiding the fields for the jointly reported individual
function handleTaxFilingStatusChange() {
    var headOfHouseholdSelected = document.getElementById('headOfHousehold').checked;
    var jointlyReportedSelected = document.getElementById('jointlyReported').checked;
    var jointlyReportedDiv = document.querySelector('.Jointly-Reported-Account-Details-Div');
    var taxFilingStatusJointAccountField = document.querySelector('input[form-field="Tax-Filing-Status-Joint-Account"]');

    // Hide or show the div based on the selection
    if (headOfHouseholdSelected || !jointlyReportedSelected) {
        jointlyReportedDiv.style.display = 'none';
    } else if (jointlyReportedSelected) {
        jointlyReportedDiv.style.display = 'block';
    }

    // Set the value for the 'Jointly Reported' field if it is selected
    if (jointlyReportedSelected) {
        taxFilingStatusJointAccountField.removeAttribute('readonly'); // Enable write access
        taxFilingStatusJointAccountField.value = 'Jointly Reported';
        taxFilingStatusJointAccountField.setAttribute('readonly', true); // Restore read-only status
    }
}

// Function to handle the Business Account form submission
function attachFormSubmitHandler(form) {
    if (!form.dataset.eventAttached) {
        form.addEventListener('submit', function(event) {
            console.log("Form submit event triggered");
            event.preventDefault(); // Prevent the default form submission

            let formData = new FormData(form);
            
            // Convert FormData to a plain JavaScript object for logging
            let formDataObject = {};
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });

            // Log the formDataObject
            console.log("Form data being sent to the server:", formDataObject);

            fetch(form.getAttribute('action'), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                // Convert data received from the server to a plain JavaScript object for logging
                let dataObject = JSON.parse(JSON.stringify(data));
                console.log("Received data from server:", dataObject); // Log the received data
                if (dataObject.success) {
                    console.log("Form submitted successfully");
                    console.log("Generated IDs:", dataObject.generated_ids);
                
                    alert("Business account submitted successfully!");
                
                    // Update all input fields with the name "Global_Relationship_ID"
                    let globalRelationshipInputs = document.querySelectorAll('input[name="Global_Relationship_ID"]');
                    globalRelationshipInputs.forEach(input => {
                        input.value = dataObject.generated_ids.Global_Relationship_ID;
                    });
                
                    // Update the "Meta_ID" field
                    let metaIdInput = document.querySelector('input[name="Meta_ID"]');
                    if (metaIdInput) {
                        metaIdInput.value = dataObject.generated_ids.Meta_ID;
                    }
                
                    // Update the "Unique_ID" field
                    let uniqueIDInput = document.querySelectorAll('input[name="Unique_ID"]');
                    if (uniqueIDInput) {
                        console.log("Inserting Unique_ID:", dataObject.generated_ids.Unique_ID);
                        uniqueIDInput.forEach(input => {
                            input.value = dataObject.generated_ids.Unique_ID;
                            console.log("Unique ID successfully inserted");
                        });
                    }
                
                    // Refresh the CSRF token
                    refreshCsrfToken();

                } else {
                    console.error('Form submission errors:', dataObject.errors);
                    // Handle and display errors appropriately
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle and display network errors appropriately
            });
        });

        form.dataset.eventAttached = 'true';
    }
    console.log("Finished attachFormSubmitHandler attachment function.....");
}

function getCsrfToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

function refreshCsrfToken() {
    // Make an AJAX request to get a new CSRF token
    fetch('/refresh-csrf-token/') // Replace with the actual URL to refresh the token
        .then(response => response.json())
        .then(data => {
            if (data.csrf_token) {
                // Update the CSRF token value in the form
                document.querySelector('[name=csrfmiddlewaretoken]').value = data.csrf_token;
                console.log("CSRF token refreshed:", data.csrf_token);
            } else {
                console.error("Failed to refresh CSRF token");
            }
        })
        .catch(error => {
            console.error('Error refreshing CSRF token:', error);
        });
}

// Copies values from Header inputs and places them into Business form fields
function copyValuesToForm() {
    var globalRelationshipID = document.querySelector('input[name="Global_Relationship_ID"]').value;
    var metaID = document.querySelector('input[name="Meta_ID"]').value;
    var uniqueID = document.querySelector('input[name="Unique_ID"]').value; // Retrieve Unique_ID

    // Copy to Business Account Form
    document.querySelectorAll('#business-account-form input[name="Global_Relationship_ID"]').forEach(function(input) {
        input.value = globalRelationshipID;
        console.log("Copying to Business Account Form - Global_Relationship_ID:", globalRelationshipID);
    });
    document.querySelectorAll('#business-account-form input[name="Meta_ID"]').forEach(function(input) {
        input.value = metaID;
        console.log("Copying to Business Account Form - Meta_ID:", metaID);
    });
    document.querySelectorAll('#business-account-form input[name="Unique_ID"]').forEach(function(input) {
        input.value = uniqueID;
        console.log("Copying to Business Account Form - Unique_ID:", uniqueID);
    });

    // Copy to Account Address Form
    if (document.getElementById('Account-Address-Form')) {
        document.querySelectorAll('#Account-Address-Form input[name="Global_Relationship_ID"]').forEach(function(input) {
            input.value = globalRelationshipID;
        });
        document.querySelectorAll('#Account-Address-Form input[name="Unique_ID"]').forEach(function(input) {
            input.value = uniqueID;
        });
    }

    // Copy to Beneficial Ownership Form
    if (document.getElementById('Beneficial-Ownership-Form')) {
        document.querySelectorAll('#Beneficial-Ownership-Form input[name="Global_Relationship_ID"]').forEach(function(input) {
            input.value = globalRelationshipID;
        });
        document.querySelectorAll('#Beneficial-Ownership-Form input[name="Unique_ID"]').forEach(function(input) {
            input.value = uniqueID;
        });
    }
}


function setupAccountAddressForm() {
    // Update dropdown button text on selection
    document.querySelectorAll('.Dropdown-List .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            var dropdownButton = document.getElementById('dropdownMenuButton');
            dropdownButton.textContent = this.textContent; // Set button text to item's text
            document.querySelector('input[name="Property_Type"]').value = this.textContent; // Update hidden input field
        });
    });

    // Handle form submission
    document.getElementById('Account-Address-Form').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData(this);
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCsrfToken() // Use your existing getCsrfToken function
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Handle success
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors
        });
    });
}

function clearFormAndUpdateSessionStorage() {
    // Clear all input fields
    var inputs = document.querySelectorAll('input');
    inputs.forEach(function(input) {
        input.value = ""; // Set each input field to an empty string
    });

    // Set all values to empty strings
    let globalRelationshipID = "";
    let metaID = "";
    let uniqueID = "";
    let jointlyReportedUniqueID = "";

    // Update session storage with empty values
    localStorage.setItem('Global_Relationship_ID', globalRelationshipID);
    localStorage.setItem('Meta_ID', metaID);
    localStorage.setItem('Unique_ID', uniqueID);
    localStorage.setItem('Jointly_Reported_Unique_ID', jointlyReportedUniqueID);

    // Log the action
    console.log('Clearing session data and updating server...', { Global_Relationship_ID: globalRelationshipID, Meta_ID: metaID, Unique_ID: uniqueID, Jointly_Reported_Unique_ID: jointlyReportedUniqueID });

    // Retrieve CSRF token
    const csrftoken = getCookie('csrftoken');

    // AJAX request with CSRF token to send empty values to the server
    fetch('/update-session/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrftoken
        },
        body: `Global_Relationship_ID=${encodeURIComponent(globalRelationshipID)}&Meta_ID=${encodeURIComponent(metaID)}&Unique_ID=${encodeURIComponent(uniqueID)}&Jointly_Reported_Unique_ID=${encodeURIComponent(jointlyReportedUniqueID)}`
    }).then(response => response.json())
    .then(data => console.log('Data successfully received by server:', data))
    .catch((error) => console.error('Error sending data to server:', error));
}


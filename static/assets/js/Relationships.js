document.querySelectorAll('.Dropdown-List').forEach(dropdownList =>
{
    dropdownList.querySelector('.dropdown-toggle').addEventListener('click', function (e)
    {
        e.preventDefault(); // Prevent default behavior on the dropdown toggle
        e.stopPropagation(); // Stop the event from bubbling up to parent elements

        var dropdownMenu = dropdownList.querySelector('.dropdown-menu');
        dropdownMenu.classList.toggle('show'); // Toggle the visibility of the dropdown menu
    });

    dropdownList.querySelectorAll('.dropdown-item').forEach(item =>
    {
        item.addEventListener('click', function (e)
        {
            e.preventDefault(); // Prevent default behavior on dropdown items
            e.stopPropagation(); // Stop the event from bubbling up to parent elements

            var dropdownButton = dropdownList.querySelector('.dropdown-toggle');
            dropdownButton.textContent = this.textContent; // Update button text

            if (dropdownList.contains(document.getElementById('businessPropertyTypeInput')))
            {
                document.getElementById('businessPropertyTypeInput').value = this.textContent;
            } else if (dropdownList.contains(document.getElementById('personalPropertyTypeInput')))
            {
                document.getElementById('personalPropertyTypeInput').value = this.textContent;
            }

            var dropdownMenu = dropdownList.querySelector('.dropdown-menu');
            dropdownMenu.classList.remove('show'); // Hide the dropdown menu
        });
    });
});

document.addEventListener('DOMContentLoaded', function ()
{
    console.log("DOM fully loaded and parsed");

    getCsrfToken()
    
    // Toggle visibility of DL/ID upload
    const headers = document.querySelectorAll('.Identification-Upload-Header');
      headers.forEach(header => {
        header.addEventListener('click', function() {
          const container = this.nextElementSibling; // Get the next sibling (the container)
          container.classList.toggle('show');
		});
	});

    // Add New Global Relationship Button Event
    var button = document.querySelector('[button-name="Add-New-Global-Relationship"]');
    if (button)
    {
        button.addEventListener('click', clearFormAndUpdateSessionStorage);
    }

    // Add Business Account to Existing Global Relationship Button Event
    var button = document.querySelector('[button-name="Add-New-Business-Account"]');
    if (button)
    {
        button.addEventListener('click', clearBusinessAccountFormFields);
    }

    // Function to initialize the display property of elements
    function initializeDisplayProperty()
    {
        // Selectors for specific forms to hide
        const formsToHide = [
            '.Tabular-Form[data-form-id="Business-Account-Management-Form"]',
            '.Tabular-Form[data-form-id="Personal-Account-Management-Form"]'
        ];

        // Initialize elements
        document.querySelectorAll('.Tabular-Form, .table-responsive').forEach(element =>
        {
            // Set initial opacity and transition
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.5s ease';

            // Hide the specific forms by default
            if (formsToHide.some(selector => element.matches(selector)))
            {
                element.style.display = "none";
            } else
            {
                element.style.display = "block";
                // Allow a moment for display change, then set opacity
                setTimeout(() => element.style.opacity = '1', 10);
                populateSessionDataIntoFields();
            }
        });
    }

    initializeDisplayProperty()

    function toggleVisibility(element)
    {
        console.log("Toggling visibility for element:", element);
        // Check if the element is currently visible
        if (element.style.display === "none")
        {
            element.style.display = "block";
            // Set opacity to '1' after a very short delay to ensure display change is rendered
            setTimeout(() =>
            {
                element.style.opacity = '1'; // Smooth transition for showing

                // Check if the target form is a descendant of the element
                const businessAccountForm = element.querySelector('.Business-Account-Form');
                const accountAddressForm = element.querySelector('.Account-Address-Form');

                if (businessAccountForm && !businessAccountForm.dataset.eventAttached)
                {
                    console.log("Business Account Form is now visible, attaching event handler.");
                    attachFormSubmitHandler(businessAccountForm); // Attach handler to the business account form
                }

                if (accountAddressForm && !accountAddressForm.dataset.eventAttached)
                {
                    console.log("Account Address Form is now visible, attaching event handler.");
                    attachAccountAddressFormSubmitHandler(accountAddressForm); // Attach handler to the account address form
                }

            }, 250);
        } else
        {
            element.style.opacity = '0';
            // Wait for the opacity transition to finish before setting display to 'none'
            setTimeout(() => element.style.display = 'none', 500); // Smooth transition for hiding
        }
    }

    // Adding event listeners to all SVG icons
    const icons = document.querySelectorAll('svg[data-form-target]');
    console.log("Found icons: ", icons.length);

    icons.forEach(icon =>
    {
        console.log("Adding listener to icon: ", icon);
        icon.addEventListener('click', function ()
        {
            // Get the data-form-target of the clicked icon
            const targetId = this.getAttribute('data-form-target');
            console.log("Clicked icon, targetId: ", targetId);

            // Find the corresponding element (form or table)
            const targetElement = document.querySelector(`.Tabular-Form[data-form-id="${targetId}"], .table-responsive[data-form-id="${targetId}"]`);
            console.log("Target element: ", targetElement);

            // Toggle the visibility of the element
            if (targetElement)
            {
                toggleVisibility(targetElement);
            }
        });
    });

    // Attach event listeners
    attachEventListeners()

    // Handles jointly condition-based jointly reported individual fields
    handleTaxFilingStatusChange()

    // Calls functoin to format the tables
    styleTable()
    
    // Setup for DL/ID upload
    setupImageUpload()

});

// Function that consolidates attaching event listeners
function attachEventListeners()
{
    var headOfHouseholdRadio = document.getElementById('headOfHousehold');
    var jointlyReportedRadio = document.getElementById('jointlyReported');

    headOfHouseholdRadio.addEventListener('change', handleTaxFilingStatusChange);
    jointlyReportedRadio.addEventListener('change', handleTaxFilingStatusChange);
}

// Submits Account Address Forms to Server
function attachAccountAddressFormSubmitHandler(form)
{
    console.log('Attaching submit event handler to Account Address Form');
    form.dataset.eventAttached = 'true';

    // Attach event listeners to dropdown items
    document.querySelectorAll('.Dropdown-List .dropdown-item').forEach(item =>
    {
        item.addEventListener('click', function (e)
        {
            e.preventDefault();
            var dropdownButton = document.getElementById('dropdownMenuButton');
            dropdownButton.textContent = this.textContent;
            var propertyTypeInput = form.querySelector('input[name="Property_Type"]');
            if (propertyTypeInput)
            {
                propertyTypeInput.value = this.textContent;
            }
        });
    });

    // Function to copy values into the form from session data
    function copyValuesIntoForm()
    {
        // Obtain session data values from hidden input fields
        var globalRelationshipID = document.querySelector('input[name="Global_Relationship_ID"]').value;
        var uniqueID = document.querySelector('input[name="Unique_ID"]').value;

        // Populate the form fields with these values
        var formGlobalRelationshipID = form.querySelector('input[name="Global_Relationship_ID"]');
        var formUniqueID = form.querySelector('input[name="Unique_ID"]');

        if (formGlobalRelationshipID)
        {
            formGlobalRelationshipID.value = globalRelationshipID;
        }
        if (formUniqueID)
        {
            formUniqueID.value = uniqueID;
        }
    }

    // Attach event listener to the form's submit event
    form.addEventListener('submit', function (e)
    {
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
            .then(data =>
            {
                console.log('Success:', data);
                // Handle success
            })
            .catch((error) =>
            {
                console.error('Error:', error);
                // Handle errors
            });
    });
}

// Formats the tables to interchange colors of rows beginning with the Header row and every other thereafter
function styleTable()
{
    // Style the header cells
    var headerCells = document.querySelectorAll('.table thead th');
    headerCells.forEach(function (cell)
    {
        cell.style.backgroundColor = 'rgba(23, 75, 84, 0.20'; // Corrected color: Primary color with 15% opacity
        cell.style.textAlign = 'left';
    });

    // Style every other table row starting from the first row after the header
    var tableRows = document.querySelectorAll('.table tbody tr');
    tableRows.forEach(function (row, index)
    {
        if (index % 2 === 0)
        { // Odd rows (0-indexed)
            row.style.backgroundColor = 'rgba(23, 75, 84, 0.20)'; // Corrected color: Primary color with 15% opacity for odd rows
        } else
        { // Even rows
            row.style.backgroundColor = '#ffffff'; // White for even rows
        }
    });
}

// Handles hiding or unhiding the fields for the jointly reported individual
function handleTaxFilingStatusChange()
{
    var headOfHouseholdSelected = document.getElementById('headOfHousehold').checked;
    var jointlyReportedSelected = document.getElementById('jointlyReported').checked;
    var jointlyReportedDiv = document.querySelector('.Jointly-Reported-Account-Details-Div');
    var taxFilingStatusJointAccountField = document.querySelector('input[form-field="Tax-Filing-Status-Joint-Account"]');

    // Hide or show the div based on the selection
    if (headOfHouseholdSelected || !jointlyReportedSelected)
    {
        jointlyReportedDiv.style.display = 'none';
    } else if (jointlyReportedSelected)
    {
        jointlyReportedDiv.style.display = 'block';
    }

    // Set the value for the 'Jointly Reported' field if it is selected
    if (jointlyReportedSelected)
    {
        taxFilingStatusJointAccountField.removeAttribute('readonly'); // Enable write access
        taxFilingStatusJointAccountField.value = 'Jointly Reported';
        taxFilingStatusJointAccountField.setAttribute('readonly', true); // Restore read-only status
    }
}

// Function to handle the Business Account form submission
function attachFormSubmitHandler(form) {
    if (!form.dataset.eventAttached) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission
            console.log("Form submit event triggered");

            let formData = new FormData(form);

            // Debug: Log the OC_EPC_Indication value
            const ocEpcIndicationValue = formData.get('OC_EPC_Indication');
            console.log("OC_EPC_Indication value before submission:", ocEpcIndicationValue);

            // Convert FormData to a JSON object
            let formDataObject = {};
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });

            // Convert the formDataObject to a JSON string for submission
            let jsonPayload = JSON.stringify(formDataObject);

            // Log the JSON payload
            console.log("JSON payload being sent to the server:", jsonPayload);

            fetch(form.getAttribute('action'), {
                method: 'POST',
                body: jsonPayload,
                headers: {
                    'Content-Type': 'application/json',
                    // 'X-CSRFToken': getCsrfToken(), // Uncomment if CSRF protection is required
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Received data from server:", data); // Log the received data
                if (data.success) {
                    console.log("Form submitted successfully");
                    console.log("Generated IDs:", data.generated_ids);

                    alert("Business account submitted successfully!");

                    // Store generated IDs in session storage
                    sessionStorage.setItem('Global_Relationship_ID', data.generated_ids.Global_Relationship_ID);
                    sessionStorage.setItem('Meta_ID', data.generated_ids.Meta_ID);
                    sessionStorage.setItem('Unique_ID', data.generated_ids.Unique_ID);
                    console.log("IDs sent to session storage:", data.generated_ids); // Log IDs sent to session storage

                    // First, reset the form to clear all fields
                    form.reset();

                    // Then, repopulate the form with necessary data
                    // Assuming updateFormWithData is designed to handle repopulation based on the provided data
                    updateFormWithData(data); // You'll need to ensure this function correctly handles the repopulation, including setting the correct radio button if applicable
                } else {
                    console.error('Form submission errors:', data.errors);
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



function setupAccountAddressForm()
{
    // Update dropdown button text on selection
    document.querySelectorAll('.Dropdown-List .dropdown-item').forEach(item =>
    {
        item.addEventListener('click', function (e)
        {
            e.preventDefault(); // Prevent default link behavior
            var dropdownButton = document.getElementById('dropdownMenuButton');
            dropdownButton.textContent = this.textContent; // Set button text to item's text
            document.querySelector('input[name="Property_Type"]').value = this.textContent; // Update hidden input field
        });
    });

    // Handle form submission
    document.getElementById('Account-Address-Form').addEventListener('submit', function (e)
    {
        e.preventDefault(); // Prevent default form submission

        let formDataObject = {};
        new FormData(this).forEach((value, key) =>
        {
            formDataObject[key] = value;
        });

        let jsonPayload = JSON.stringify(formDataObject);

        fetch('/api/account-addresses/', { // Ensure this URL matches your Django Ninja API endpoint
            method: 'POST',
            body: jsonPayload,
            headers: {
                'Content-Type': 'application/json',
                // Include any additional headers your API requires for authentication
            }
        })
            .then(response =>
            {
                if (!response.ok)
                {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data =>
            {
                console.log('Success:', data);
                if (data.success)
                {
                    alert('Address submitted successfully!');
                    this.reset(); // Clear the form after successful submission
                    // Optionally, update the UI or redirect the user
                } else
                {
                    console.error('Submission errors:', data.errors);
                    // Optionally, display errors to the user
                }
            })
            .catch((error) =>
            {
                console.error('Error:', error);
                // Handle network or other errors
            });
    });
}

function updateFormWithData(formData)
{
    // Assuming formData is an object containing the form data to repopulate
    Object.keys(formData).forEach(key =>
    {
        let input = document.querySelector(`input[name="${key}"]`);
        if (input)
        {
            input.value = formData[key];
        } else
        {
            // Handle other types of form controls like select, radio, etc.
            let select = document.querySelector(`select[name="${key}"]`);
            if (select)
            {
                select.value = formData[key];
            }
            // Add more else-if blocks as necessary for other control types
        }
    });

    // Call the existing updateFields function for updating generated IDs
    updateFields(formData.generated_ids);
}


function updateFields(generatedIds)
{
    // Update all input fields with the name "Global_Relationship_ID"
    let globalRelationshipInputs = document.querySelectorAll('input[name="Global_Relationship_ID"]');
    globalRelationshipInputs.forEach(input =>
    {
        input.value = generatedIds.Global_Relationship_ID;
    });

    // Update the "Meta_ID" field
    let metaIdInput = document.querySelector('input[name="Meta_ID"]');
    if (metaIdInput)
    {
        metaIdInput.value = generatedIds.Meta_ID;
    }

    // Update the "Unique_ID" field
    let uniqueIDInputs = document.querySelectorAll('input[name="Unique_ID"]');
    uniqueIDInputs.forEach(input =>
    {
        input.value = generatedIds.Unique_ID;
        console.log("Unique ID successfully inserted");
    });
}

function getCsrfToken()
{
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

function refreshCsrfToken()
{
    // Make an AJAX request to get a new CSRF token
    fetch('/refresh-csrf-token/') // Replace with the actual URL to refresh the token
        .then(response => response.json())
        .then(data =>
        {
            if (data.csrf_token)
            {
                // Update the CSRF token value in the form
                document.querySelector('[name=csrfmiddlewaretoken]').value = data.csrf_token;
                console.log("CSRF token refreshed:", data.csrf_token);
            } else
            {
                console.error("Failed to refresh CSRF token");
            }
        })
        .catch(error =>
        {
            console.error('Error refreshing CSRF token:', error);
        });
}

// Copies values from Header inputs and places them into Business form fields
function copyValuesToForm() {
    var globalRelationshipID = document.querySelector('input[name="Global_Relationship_ID"]').value;
    var metaID = document.querySelector('input[name="Meta_ID"]').value;
    var uniqueID = document.querySelector('input[name="Unique_ID"]').value; // Retrieve Unique_ID

    // Copy to Business Account Form
    document.querySelectorAll('#business-account-form input[name="Global_Relationship_ID"]').forEach(function (input)
    {
        input.value = globalRelationshipID;
        console.log("Copying to Business Account Form - Global_Relationship_ID:", globalRelationshipID);
    });
    document.querySelectorAll('#business-account-form input[name="Meta_ID"]').forEach(function (input)
    {
        input.value = metaID;
        console.log("Copying to Business Account Form - Meta_ID:", metaID);
    });
    document.querySelectorAll('#business-account-form input[name="Unique_ID"]').forEach(function (input)
    {
        input.value = uniqueID;
        console.log("Copying to Business Account Form - Unique_ID:", uniqueID);
    });

    // Copy to Account Address Form
    if (document.getElementById('Account-Address-Form'))
    {
        document.querySelectorAll('#Account-Address-Form input[name="Global_Relationship_ID"]').forEach(function (input)
        {
            input.value = globalRelationshipID;
        });
        document.querySelectorAll('#Account-Address-Form input[name="Unique_ID"]').forEach(function (input)
        {
            input.value = uniqueID;
        });
    }

    // Copy to Beneficial Ownership Form
    if (document.getElementById('Beneficial-Ownership-Form'))
    {
        document.querySelectorAll('#Beneficial-Ownership-Form input[name="Global_Relationship_ID"]').forEach(function (input)
        {
            input.value = globalRelationshipID;
        });
        document.querySelectorAll('#Beneficial-Ownership-Form input[name="Unique_ID"]').forEach(function (input)
        {
            input.value = uniqueID;
        });
    }
}

function clearFormAndUpdateSessionStorage()
{
    // Clear all input fields
    var inputs = document.querySelectorAll('input');
    inputs.forEach(function (input)
    {
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

function clearBusinessAccountFormFields() {
    // Log current session storage data
    console.log('Current session storage data:', {
        Global_Relationship_ID: localStorage.getItem('Global_Relationship_ID'),
        Meta_ID: localStorage.getItem('Meta_ID'),
        Unique_ID: localStorage.getItem('Unique_ID'),
        Unique_Jointly_Reported_ID: localStorage.getItem('Unique_Jointly_Reported_ID')
    });

    // Select all input fields within the div that has the 'data-form-id' attribute set to 'Business-Account-Management-Form'
    var inputs = document.querySelectorAll('[data-form-id="Business-Account-Management-Form"] input');
    inputs.forEach(function(input) {
        input.value = ""; // Set each input field to an empty string
    });

    // Assuming you have a function to retrieve the CSRF token
    const csrftoken = getCookie('csrftoken'); // Ensure you have this function defined to get CSRF token

    // AJAX request with CSRF token to attempt to clear the Unique_ID on the server
    fetch('/update-session/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrftoken
        },
        body: "Unique_ID=" // Sending an empty Unique_ID to the server
    })
    .then(response => {
        console.log('Data being sent to server:', "Unique_ID="); // Log the data being sent to the server
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data successfully received by server:', data);
        // Assuming the server clears the Unique_ID and confirms via response
        // Now clear the Unique_ID in session storage to reflect the server's action
        localStorage.setItem('Unique_ID', "");

        console.log('Unique_ID in session storage cleared.', { Unique_ID: localStorage.getItem('Unique_ID') });

        // Update Displayed and Hidden Global Header Inputs with Session Storage Data
        populateSessionDataIntoFields(); // Call this function to update the UI accordingly
    })
    .catch((error) => {
        console.error('Error sending data to server:', error);
    });
}

// Formats text input fields based upon custom element 'format' value
function setupTextFields() {
    // Select all text fields
    const textFields = document.querySelectorAll('input[type="text"]');

    textFields.forEach(field => {
        // Align text to the right for specific formats
        const format = field.getAttribute('format');
        if (['numeric-whole', 'numeric', 'currency', 'percent'].includes(format)) {
            field.style.textAlign = 'right';
        }

        // Attach input event listener based on format
        switch (format) {
            case 'numeric-whole':
                field.addEventListener('input', function() {
                    this.value = this.value.replace(/[^\d]/g, ''); // Allow only digits
                    this.value = formatNumber(this.value); // Format with commas
                });
                break;
            case 'numeric':
            case 'percent':
                field.addEventListener('input', function() {
                    // Allow only numbers and a single decimal point, and format with commas
                    this.value = formatNumberWithDecimal(this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'), format);
                });
                break;
            case 'currency':
                field.addEventListener('input', function() {
                    // Process numeric value, then format
                    let numericValue = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                    if (numericValue) {
                        numericValue = parseFloat(numericValue).toFixed(2); // Ensure two decimal places for currency
                        this.value = `$${formatNumber(numericValue)}`; // Prepend $ after formatting
                    } else {
                        this.value = '';
                    }
                });
                break;
        }
    });

    // Helper function for formatting numbers with commas (for whole numbers)
    function formatNumber(value) {
        // Split the value in case it contains decimals
        let parts = value.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    // Helper function for formatting numbers with decimals and commas
    function formatNumberWithDecimal(value, format) {
        let parts = value.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let formattedValue = parts.join('.');
        // Append '%' for percent format
        if (format === 'percent' && !formattedValue.includes('%')) {
            formattedValue += '%';
        }
        return formattedValue;
    }
}


function setupImageUpload() {
  const dropAreas = document.querySelectorAll('.Driver-License-Section .col-md-6');

  dropAreas.forEach(dropArea => {
    // ... (Drag-and-drop event listeners from previous example) ...

    // Handle the file drop
    dropArea.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      handleImageFiles(files, dropArea);
    });
  });

  // Click-to-upload functionality
  const fileInputs = document.querySelectorAll('.Driver-License-Section input[type="file"]');
  fileInputs.forEach(input => {
    const label = input.nextElementSibling;
    label.addEventListener('click', () => input.click());

    input.addEventListener('change', (e) => {
      handleImageFiles(e.target.files, input.closest('.col-md-6'));
    });
  });
}

function handleImageFiles(files, dropArea) {
  if (files.length > 0) {
    const file = files[0]; // Assumes you're handling one image at a time

    // Basic image type check
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Create an image element for preview
        const previewImage = document.createElement('img');
        previewImage.src = e.target.result;
        previewImage.style.maxWidth = '100%';

        // Clear any existing preview and append the new image
        dropArea.innerHTML = ''; 
        dropArea.appendChild(previewImage);
      };
      reader.readAsDataURL(file); 
    } else {
      alert('Please upload a valid image file.');
    }
  }
}
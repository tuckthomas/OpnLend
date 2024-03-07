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

// Obtains Business Accounts of User's Active Global Relationship
async function getUserBusinessAccounts()
{
    try
    {
        // Refresh CSRF Token
        refreshCsrfToken();

        // Obtain CSRF token from the DOM
        const csrftokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
        if (!csrftokenElement)
        {
            console.error('CSRF token element not found.');
            return;
        }
        const csrftoken = csrftokenElement.value;

        const response = await fetch('/api/global-relationships/user-business-accounts/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken, // Include the CSRF token in the headers
            },
            credentials: 'include' // Include credentials in the request
        });

        if (!response.ok)
        {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.accounts && Array.isArray(data.accounts))
        {
            // Select the table body where the accounts will be populated
            const tableBody = document.querySelector('#Bussiness-Accounts-Table tbody');

            // Clear existing rows in the tbody
            while (tableBody.firstChild)
            {
                tableBody.removeChild(tableBody.firstChild);
            }

            // Populate the table with new data
            data.accounts.forEach(account =>
            {
                const newRow = tableBody.insertRow(-1); // Inserts a row at the end of the table
                const cell1 = newRow.insertCell(0);
                const cell2 = newRow.insertCell(1);
                const cell3 = newRow.insertCell(2);
                const cell4 = newRow.insertCell(3);

                cell1.textContent = account.Business_Legal_Name;
                cell1.style.textAlign = 'left'; // Align text to the left
                cell2.textContent = account.DBA_Name;
                cell2.style.textAlign = 'left'; // Align text to the left
                // Populate cell3 and cell4 as needed for additional account details
                cell4.innerHTML = `<div class="d-xxl-flex justify-content-xxl-center Account-Management-Icons">
                                        <i class="fa fa-pencil-square Account-Mgmt-Edit-Icon" data-bs-toggle="tooltip" title="Edit"></i>
                                        <i class="fa fa-trash Account-Mgmt-Delete-Icon" data-bs-toggle="tooltip" style="font-size: 35px;color: rgb(92,30,24);padding-right: 2.5px;padding-left: 2.5px;width: 35px;height: 35px;" title="Delete"></i>
                                    </div>`;
            });
        } else
        {
            console.error('Expected data to contain an "accounts" array, but it was not found:', data);
        }
    } catch (error)
    {
        console.error('Error fetching user business accounts:', error);
    }
}

function initializeBusinessAddressTabActivationListener() {
    console.log('Initializing tab activation listener...');
    
    // Listen for the tab activation event
    const tabLink = document.querySelector('.Tab-Link[href="#tab-2"]');
    tabLink.addEventListener('shown.bs.tab', function(event) {
        // Check if the tab is now active
        if (event.target.getAttribute('href') === '#tab-2') {
            console.log('Tab-2 is now active. Fetching and populating table data...');
            // Call the function to fetch and populate the table data
            getUserBusinessAddresses();
        }
    });
}

async function getUserBusinessAddresses() {
    try {
        // Refresh CSRF Token
        refreshCsrfToken();

        // Obtain CSRF token from the DOM
        const csrftokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
        if (!csrftokenElement) {
            console.error('CSRF token element not found.');
            return;
        }
        const csrftoken = csrftokenElement.value;

        const response = await fetch('/api/global-relationships/user-business-addresses/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken, // Include the CSRF token in the headers
            },
            credentials: 'include' // Include credentials in the request
        });

        const data = await response.json();

        if (response.ok) {
            // Select the table body where the addresses will be populated
            const tableBody = document.querySelector('#Business-Address-Table tbody');

            // Clear existing rows in the tbody
            while (tableBody.firstChild) {
                tableBody.removeChild(tableBody.firstChild);
            }

            if (data.addresses && Array.isArray(data.addresses) && data.addresses.length > 0) {
                // Populate the table with new data
                data.addresses.forEach(address => {
                    const newRow = tableBody.insertRow(-1); // Inserts a row at the end of the table
                    const cell1 = newRow.insertCell(0);
                    const cell2 = newRow.insertCell(1);
                    const cell3 = newRow.insertCell(2);
                    const cell4 = newRow.insertCell(3);

                    cell1.textContent = address.Property_Type;
                    cell1.style.textAlign = 'left'; // Align text to the left
                    cell2.textContent = address.Address_1 + (address.Address_2 ? ', ' + address.Address_2 : '');
                    cell2.style.textAlign = 'left'; // Align text to the left
                    cell3.textContent = `${address.City}, ${address.State} ${address.Zip_Code}`;
                    cell4.innerHTML = `<div class="d-xxl-flex justify-content-xxl-center Account-Management-Icons">
                                            <i class="fa fa-pencil-square Account-Mgmt-Edit-Icon" data-bs-toggle="tooltip" title="Edit"></i>
                                            <i class="fa fa-trash Account-Mgmt-Delete-Icon" data-bs-toggle="tooltip" style="font-size: 35px;color: rgb(92,30,24);padding-right: 2.5px;padding-left: 2.5px;width: 35px;height: 35px;" title="Delete"></i>
                                        </div>`;
                });
            } else {
                console.error('No addresses available.');
            }
        } else {
            console.error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching user business addresses:', error);
    }
}

document.addEventListener('DOMContentLoaded', function ()
{
    console.log("DOM fully loaded and parsed");

    // Toggle visibility of DL/ID upload
    const headers = document.querySelectorAll('.Identification-Upload-Header');
    headers.forEach(header =>
    {
        header.addEventListener('click', function ()
        {
            const container = this.nextElementSibling; // Get the next sibling (the container)
            container.classList.toggle('show');
        });
    });

    // Add Global Relationship Button Event
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

    // Add Personal Account to Existing Relationship Button Event
    var button = document.querySelector('[button-name="Add-New-Personal-Account"]');
    if (button)
    {
        button.addEventListener('click', clearPersonalAccountFormFields);
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

    // Obtain Business Accounts in Active Global Relationship
    getUserBusinessAccounts()

    // Attaches event listener to 'Account Addresses' tab within the Business section,
    // which then populates the address table
    initializeBusinessAddressTabActivationListener()

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
async function attachAccountAddressFormSubmitHandler(form)
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

    // Attach event listener to the form's submit event
    form.addEventListener('submit', async function (event)
    {
        console.log('Account Address Form submit event triggered');
        event.preventDefault(); // Prevent default form submission

        var formData = new FormData(this);

        // Log formData for debugging
        console.log('Form Data:', Array.from(formData.entries()));

        // Refresh and Get CSRF Token
        refreshCsrfToken();
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        // Log to indicate the start of fetching session data
        console.log('Fetching session data...');

        try
        {
            // Make a GET request to the user-session API endpoint with credentials included
            const sessionResponse = await fetch('/api/user-profiles/user-session/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken, // Include the CSRF token in the headers
                },
                credentials: 'include', // Include credentials like cookies in the request
            });

            // Log to indicate the completion of fetching session data
            console.log('Session data fetched successfully.');

            if (!sessionResponse.ok)
            {
                throw new Error(`Network response was not ok: ${sessionResponse.status}`);
            }

            // Parse the JSON response to get Global_Relationship_ID and Business_Unique_ID
            const sessionData = await sessionResponse.json();
            console.log('Session Data:', sessionData); // Log session data to console for debugging

            // Ensure sessionData contains the expected fields
            if (!sessionData.Global_Relationship_ID || !sessionData.Business_Unique_ID)
            {
                console.error('Session data does not contain expected fields.');
                return;
            }

            const Global_Relationship_ID = sessionData.Global_Relationship_ID;
            const Unique_ID = sessionData.Business_Unique_ID;
            console.log('Business Unique ID:', Unique_ID); // Log Business_Unique_ID to console
            console.log('Global Relationship ID:', Global_Relationship_ID); // Log Global_Relationship_ID to console

            // Set Global_Relationship_ID and Business_Unique_ID in the form
            console.log('Setting Global_Relationship_ID in form:', Global_Relationship_ID);
            document.querySelector('[name=Global_Relationship_ID]').value = Global_Relationship_ID;
            console.log('Setting Unique_ID in form:', Unique_ID);
            document.querySelector('[name=Unique_ID]').value = Unique_ID;

            // Extract form data
            const formData = new FormData(event.target);
            const formDataObject = {};
            formData.forEach((value, key) =>
            {
                formDataObject[key] = value;
            });

            // Ensure Unique_ID is set in the form data object
            formDataObject['Unique_ID'] = Unique_ID;

            const jsonPayload = JSON.stringify(formDataObject);

            // Print JSON payload to console
            console.log('JSON Payload:', jsonPayload);

            // Make POST request to the account-addresses API endpoint
            const response = await fetch('/api/global-relationships/account-addresses/', {
                method: 'POST',
                body: jsonPayload,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken, // Include the CSRF token in the headers
                    // Include any additional headers your API requires for authentication
                },
                credentials: 'include', // Include credentials in the request
            });

            if (!response.ok)
            {
                console.error(`HTTP error! Status: ${response.status}`);
                return;
            }

            // Parse the JSON response
            try
            {
                // Parse the JSON response
                const responseData = await response.json();
                console.log('Response Data:', responseData); // Log the response data
                if (responseData.success)
                {
                    alert('Address submitted successfully!');
                    event.target.reset(); // Clear the form after successful submission
                    // Optionally, update the UI or redirect the user
                } else
                {
                    console.error('Submission errors:', responseData.errors);
                    // Optionally, display errors to the user
                }
            } catch (error)
            {
                console.error('Error occurred:', error);
                // Handle network or other errors
            }
        } catch (error)
        {
            console.error('Error occurred:', error);
            // Handle network or other errors
        }
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

document.querySelectorAll('input[name="OC_EPC_Indication"]').forEach(radio => {
    radio.addEventListener('change', function() {
        console.log("Radio value on change:", this.value);
    });
});


// Function to handle the Business Account form submission
async function attachFormSubmitHandler(form)
{
    if (!form.dataset.eventAttached)
    {
        form.addEventListener('submit', async function (event)
        {
            event.preventDefault(); // Prevent the default form submission
            console.log("Form submit event triggered");

            var formData = new FormData(this);

            // Log form data entries to inspect
            console.log("Form data entries:", [...formData.entries()]);

            // Validation: Check if OC_EPC_Indication is not empty
            const ocEpcIndicationValue = formData.get('OC_EPC_Indication') ? formData.get('OC_EPC_Indication').trim() : '';
            if (!ocEpcIndicationValue)
            {
                console.log("OC_EPC_Indication value before submission:", ocEpcIndicationValue);
                alert("OC/EPC Indication is required.");
                return; // Stop the form submission
            }

            // Validation: Check if Business_Legal_Name is not empty or doesn't only contain spaces
            const businessLegalNameValue = formData.get('Business_Legal_Name') ? formData.get('Business_Legal_Name').trim() : '';
            if (!businessLegalNameValue)
            {
                alert("Business Legal Name is required and cannot be empty.");
                return; // Stop the form submission
            }

            // Convert FormData to a JSON object and handle empty strings for specific fields
            let formDataObject = {};
            formData.forEach((value, key) =>
            {
                // For Unique_ID and Global_Relationship_ID, set to null if empty
                if ((key === 'Unique_ID' || key === 'Global_Relationship_ID') && !value)
                {
                    formDataObject[key] = null;
                }
                // For date fields, check for valid date or set to null if empty
                else if ((key === 'Date_of_Formation' || key === 'Business_Entity_Report_Expiration_Date') && !value)
                {
                    formDataObject[key] = null;
                }
                else
                {
                    // Trim other values to ensure no leading/trailing whitespace
                    formDataObject[key] = value.trim();
                }
            });

            // Convert the formDataObject to a JSON string for submission
            let jsonPayload = JSON.stringify(formDataObject);

            // Log the JSON payload
            console.log("JSON payload being sent to the server:", jsonPayload);

            try
            {
                // Obtain CSRF Token
                const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                // Perofrm API Post
                const response = await fetch(form.getAttribute('action'), {
                    method: 'POST',
                    body: jsonPayload,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken, // Include the CSRF token in the headers
                    },
                    credentials: 'include' // Include credentials in the request
                });

                console.log("Response status code:", response.status); // Log status code for the response

                if (!response.ok)
                {
                    console.error('Network response was not ok:', response.statusText);
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log("Received data from server:", data); // Log the received data

                if (data.success)
                {
                    console.log("Form submitted successfully", data);
                    alert("Business account submitted successfully!");

                    // Extract generated IDs
                    const { Unique_ID, Global_Relationship_ID, Meta_ID } = data.generated_ids;

                    // Make a POST request to update the user session
                    const updateData = {
                        Global_Relationship_ID,
                        Meta_ID,
                        Business_Unique_ID: Unique_ID
                    };

                    refreshCsrfToken()
                    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                    const updateResponse = await fetch('/api/user-profiles/update_session/', {
                        method: 'POST',
                        body: JSON.stringify(updateData),
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken, // Include the CSRF token in the headers
                        },
                        credentials: 'include' // Include credentials in the request
                    });

                    if (updateResponse.ok)
                    {
                        const updateResponseData = await updateResponse.json();
                        if (updateResponseData.success)
                        {
                            console.log("User session updated successfully", updateResponseData);
                            // Repopulate Field Headers
                            populateSessionDataIntoFields(),
                            getUserBusinessAccounts(),
                            form.reset();
                        } else
                        {
                            console.error('Error updating user session:', updateResponseData.error);
                            // Handle and display errors appropriately
                        }
                    } else
                    {
                        console.error('Error with update request:', updateResponse.statusText);
                        // Handle and display network errors appropriately
                    }
                } else
                {
                    console.error('Form submission errors:', data.errors);
                    // Handle and display errors appropriately
                }
            } catch (error)
            {
                console.error('Error with fetch operation:', error.message);
                // Handle and display network errors appropriately
            }
        });

        form.dataset.eventAttached = 'true';
        console.log("Form event handler attached.");
    } else
    {
        console.log("Form event handler already attached.");
    }
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

// New Global Relationship Button
async function clearFormAndUpdateSessionStorage()
{
    try
    {
        // Refresh CSRF Token
        refreshCsrfToken();

        // Obtain CSRF token from the DOM
        const csrftokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
        if (!csrftokenElement)
        {
            console.error('CSRF token element not found.');
            return;
        }
        const csrftoken = csrftokenElement.value;

        // Log the CSRF token value
        console.log("CSRF Token:", csrftoken);

        // Send blank/null values to update the session storage
        const updateData = {
            Global_Relationship_ID: null,
            Meta_ID: null,
            Business_Unique_ID: null,
            Personal_Unique_ID: null
        };

        // Log the updateData object
        console.log("Request Payload:", updateData);

        const response = await fetch('/api/user-profiles/update_session/', {
            method: 'POST',
            body: JSON.stringify(updateData),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken // Include the CSRF token in the headers
            },
            credentials: 'include' // Include credentials in the request
        });

        if (response.ok)
        {
            const responseData = await response.json();
            if (responseData.success)
            {
                console.log("Session storage updated successfully", responseData);
            } else
            {
                console.error('Error updating session storage:', responseData.error);
                // Handle and display errors appropriately
                return; // Stop execution if there's an error
            }
        } else
        {
            console.error('Error with update request:', response.statusText);
            // Handle and display network errors appropriately
            return; // Stop execution if there's an error
        }
    } catch (error)
    {
        console.error('Error with fetch operation:', error.message);
        // Handle and display network errors appropriately
        return; // Stop execution if there's an error
    }

    // Unhide and reset the form for Business Account Management
    const businessAccountParent = document.querySelector('[data-form-id="Business-Account-Management-Form"]');
    if (businessAccountParent && isElementHidden(businessAccountParent))
    {
        resetForm(businessAccountParent);
    }

    // Unhide and reset the form for Personal Account Management
    const personalAccountParent = document.querySelector('[data-form-id="Personal-Account-Management-Form"]');
    if (personalAccountParent && isElementHidden(personalAccountParent))
    {
        resetForm(personalAccountParent);
    }

    populateSessionDataIntoFields(),

    // Select the table body where the accounts will be populated
    tableBody = document.querySelector('#Bussiness-Accounts-Table tbody');
    // Clear existing rows in the tbody
    while (tableBody.firstChild)
    {
        tableBody.removeChild(tableBody.firstChild);
    }
    getUserBusinessAddresses()
    refreshCsrfToken();
}

function isElementHidden(element)
{
    const style = window.getComputedStyle(element);
    return style.display === 'none';
}

function unhideAndResetForm(element)
{
    unhideElement(element);
    // Clear all input fields within the element
    const inputs = element.querySelectorAll('input');
    inputs.forEach(function (input)
    {
        if (input.type === 'color')
        {
            input.value = '#000000'; // Set color input fields to black
        } else
        {
            input.value = ''; // Set other input fields to an empty string
        }
    });

    // Reset all forms within the element
    element.querySelectorAll('form').forEach(form =>
    {
        const formInputs = form.querySelectorAll('input');
        formInputs.forEach(input =>
        {
            if (input.type === 'color')
            {
                input.value = '#000000'; // Set color input fields to black
            } else
            {
                input.value = ''; // Set other input fields to an empty string
            }
        });
        form.reset(); // Reset the form
    });

    // Return the element to its original hidden state if necessary
    returnToOriginalHiddenState(element);
}

function unhideElement(element)
{
    element.style.display = 'block';
}

function returnToOriginalHiddenState(element)
{
    element.style.display = 'none';
}

// New Business Account to Existing Relationship
async function clearBusinessAccountFormFields()
{
    try
    {
        // First, get session data
        const sessionData = await getSessionData();
        if (!sessionData)
        {
            console.error('Failed to retrieve session data.');
            return;
        }

        // Extract required IDs from session data
        const { Global_Relationship_ID, Meta_ID, Business_Unique_ID, Personal_Unique_ID } = sessionData;

        // Set Business_Unique_ID to null before sending the IDs in the API POST
        const updateData = {
            Global_Relationship_ID,
            Meta_ID,
            Business_Unique_ID: null,
            Personal_Unique_ID
        };

        // Obtain CSRF token from the DOM
        const csrftokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
        if (!csrftokenElement)
        {
            console.error('CSRF token element not found.');
            return;
        }
        const csrftoken = csrftokenElement.value;

        // Log the CSRF token value
        console.log("CSRF Token:", csrftoken);

        // Log the updateData object
        console.log("Request Payload:", updateData);

        const response = await fetch('/api/user-profiles/update_business/', {
            method: 'POST',
            body: JSON.stringify(updateData),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken // Include the CSRF token in the headers
            },
            credentials: 'include' // Include credentials in the request
        });

        if (response.ok)
        {
            const responseData = await response.json();
            if (responseData.success)
            {
                console.log("Session storage updated successfully", responseData);
            } else
            {
                console.error('Error updating session storage:', responseData.error);
                // Handle and display errors appropriately
                return; // Stop execution if there's an error
            }
        } else
        {
            console.error('Error with update request:', response.statusText);
            // Handle and display network errors appropriately
            return; // Stop execution if there's an error
        }
    } catch (error)
    {
        console.error('Error with fetch operation:', error.message);
        // Handle and display network errors appropriately
        return; // Stop execution if there's an error
    }

    // Reset the form for Business Account Management
    const businessAccountParent = document.querySelector('[data-form-id="Business-Account-Management-Form"]');
    if (businessAccountParent)
    {
        toggleVisibility(businessAccountParent);
        // Assuming a standard resetForm implementation:
        resetForm(businessAccountParent); 
    }
    populateSessionDataIntoFields();
    refreshCsrfToken();

}

function resetFormRadios(formElement)
{
    // Find all radio button inputs within the given form and loop through them
    formElement.querySelectorAll('input[type="radio"]').forEach(radio =>
    {
        radio.checked = false; // Deselect each radio button
    });
}

// New Business Account to Existing Relationship
async function clearPersonalAccountFormFields()
{
    try
    {
        // Refresh CSRF Token
        refreshCsrfToken();

        // Obtain CSRF token from the DOM
        const csrftokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
        if (!csrftokenElement)
        {
            console.error('CSRF token element not found.');
            return;
        }
        const csrftoken = csrftokenElement.value;

        // Log the CSRF token value
        console.log("CSRF Token:", csrftoken);

        // Send blank/null values to update the session storage
        const updateData = {
            Personal_Unique_ID: null,
        };

        // Log the updateData object
        console.log("Request Payload:", updateData);

        const response = await fetch('/api/user-profiles/update_personal/', {
            method: 'POST',
            body: JSON.stringify(updateData),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken // Include the CSRF token in the headers
            },
            credentials: 'include' // Include credentials in the request
        });

        if (response.ok)
        {
            const responseData = await response.json();
            if (responseData.success)
            {
                console.log("Session storage updated successfully", responseData);
            } else
            {
                console.error('Error updating session storage:', responseData.error);
                // Handle and display errors appropriately
                return; // Stop execution if there's an error
            }
        } else
        {
            console.error('Error with update request:', response.statusText);
            // Handle and display network errors appropriately
            return; // Stop execution if there's an error
        }
    } catch (error)
    {
        console.error('Error with fetch operation:', error.message);
        // Handle and display network errors appropriately
        return; // Stop execution if there's an error
    }

    // Reset the form for Business Account Management
    const personalAccountParent = document.querySelector('[data-form-id="Personal-Account-Management-Form"]');
    if (personalAccountParent)
    {
        resetForm(personalAccountParent);
        toggleVisibility(personalAccountParent);
    }
    populateSessionDataIntoFields();
    refreshCsrfToken();
}


function resetForm(element) {
    // Clear text fields, textareas, and select elements:
    const clearableInputs = element.querySelectorAll('input[type="text"], input[type="number"], input[type="email"], textarea, select');
    clearableInputs.forEach(input => {
        input.value = '';
    });

    // Reset checkboxes and radio buttons:
    const checkables = element.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    checkables.forEach(input => {
        input.checked = false;
    });

    // Reset color input fields to black:
    const colorInputs = element.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        input.value = '#000000'; 
    });

    // Reset drop-down menus:
    const selectElements = element.querySelectorAll('select');
    selectElements.forEach(select => {
        select.selectedIndex = 0; 
    });

    // Reset forms (using the native reset method)
    element.querySelectorAll('form').forEach(form => form.reset());
}

// Formats text input fields based upon custom element 'format' value
function setupTextFields()
{
    // Select all text fields
    const textFields = document.querySelectorAll('input[type="text"]');

    textFields.forEach(field =>
    {
        // Align text to the right for specific formats
        const format = field.getAttribute('format');
        if (['numeric-whole', 'numeric', 'currency', 'percent'].includes(format))
        {
            field.style.textAlign = 'right';
        }

        // Attach input event listener based on format
        switch (format)
        {
            case 'numeric-whole':
                field.addEventListener('input', function ()
                {
                    this.value = this.value.replace(/[^\d]/g, ''); // Allow only digits
                    this.value = formatNumber(this.value); // Format with commas
                });
                break;
            case 'numeric':
            case 'percent':
                field.addEventListener('input', function ()
                {
                    // Allow only numbers and a single decimal point, and format with commas
                    this.value = formatNumberWithDecimal(this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'), format);
                });
                break;
            case 'currency':
                field.addEventListener('input', function ()
                {
                    // Process numeric value, then format
                    let numericValue = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                    if (numericValue)
                    {
                        numericValue = parseFloat(numericValue).toFixed(2); // Ensure two decimal places for currency
                        this.value = `$${formatNumber(numericValue)}`; // Prepend $ after formatting
                    } else
                    {
                        this.value = '';
                    }
                });
                break;
        }
    });

    // Helper function for formatting numbers with commas (for whole numbers)
    function formatNumber(value)
    {
        // Split the value in case it contains decimals
        let parts = value.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    // Helper function for formatting numbers with decimals and commas
    function formatNumberWithDecimal(value, format)
    {
        let parts = value.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let formattedValue = parts.join('.');
        // Append '%' for percent format
        if (format === 'percent' && !formattedValue.includes('%'))
        {
            formattedValue += '%';
        }
        return formattedValue;
    }
}


function setupImageUpload()
{
    const dropAreas = document.querySelectorAll('.Driver-License-Section .col-md-6');

    dropAreas.forEach(dropArea =>
    {
        // ... (Drag-and-drop event listeners from previous example) ...

        // Handle the file drop
        dropArea.addEventListener('drop', (e) =>
        {
            const files = e.dataTransfer.files;
            handleImageFiles(files, dropArea);
        });
    });

    // Click-to-upload functionality
    const fileInputs = document.querySelectorAll('.Driver-License-Section input[type="file"]');
    fileInputs.forEach(input =>
    {
        const label = input.nextElementSibling;
        label.addEventListener('click', () => input.click());

        input.addEventListener('change', (e) =>
        {
            handleImageFiles(e.target.files, input.closest('.col-md-6'));
        });
    });
}

function handleImageFiles(files, dropArea)
{
    if (files.length > 0)
    {
        const file = files[0]; // Assumes you're handling one image at a time

        // Basic image type check
        if (file.type.startsWith('image/'))
        {
            const reader = new FileReader();
            reader.onload = (e) =>
            {
                // Create an image element for preview
                const previewImage = document.createElement('img');
                previewImage.src = e.target.result;
                previewImage.style.maxWidth = '100%';

                // Clear any existing preview and append the new image
                dropArea.innerHTML = '';
                dropArea.appendChild(previewImage);
            };
            reader.readAsDataURL(file);
        } else
        {
            alert('Please upload a valid image file.');
        }
    }
}


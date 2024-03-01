// Function to populate session data into input fields
function populateSessionDataIntoFields() {
    // Retrieve session data from localStorage
    let globalRelationshipID = localStorage.getItem('Global_Relationship_ID');
    let metaID = localStorage.getItem('Meta_ID');
    let uniqueID = localStorage.getItem('Unique_ID');
    let uniqueJointlyReportedID = localStorage.getItem('Unique_Jointly_Reported_ID');

    console.log('Populating session data into fields...');
    console.log('Global_Relationship_ID:', globalRelationshipID);
    console.log('Meta_ID:', metaID);
    console.log('Unique_ID:', uniqueID);
    console.log('Unique_Jointly_Reported_ID:', uniqueJointlyReportedID);

    // Populate all input fields with 'name' attribute 'Global_Relationship_ID'
    document.querySelectorAll('input[name="Global_Relationship_ID"]').forEach(input => {
        if (globalRelationshipID) {
            input.value = globalRelationshipID;
            console.log('Updated Global_Relationship_ID field:', input);
        }
    });

    // Populate all input fields with 'name' attribute 'Meta_ID'
    document.querySelectorAll('input[name="Meta_ID"]').forEach(input => {
        if (metaID) {
            input.value = metaID;
            console.log('Updated Meta_ID field:', input);
        }
    });

    // Populate all input fields with 'name' attribute 'Unique_ID'
    document.querySelectorAll('input[name="Unique_ID"]').forEach(input => {
        if (uniqueID) {
            input.value = uniqueID;
            console.log('Updated Unique_ID field:', input);
        }
    });

    // Populate all input fields with 'name' attribute 'Unique_Jointly_Reported_ID'
    document.querySelectorAll('input[name="Unique_Jointly_Reported_ID"]').forEach(input => {
        if (uniqueJointlyReportedID) {
            input.value = uniqueJointlyReportedID;
            console.log('Updated Unique_Jointly_Reported_ID field:', input);
        }
    });
}

// Function to send session data to backend server
// This should be able to be removed in the future with proper session data management; currently testing
function sendGlobalIDSessionToServer() {
    let globalRelationshipID = document.querySelector('input[name="Global_Relationship_ID"]')?.value;
    let metaID = document.querySelector('input[name="Meta_ID"]')?.value;
    let uniqueID = document.querySelector('input[name="Unique_ID"]')?.value; // Retrieve Unique_ID
    let jointlyReportedUniqueID = document.querySelector('input[name="Jointly_Reported_Unique_ID"]')?.value; // Retrieve Jointly_Reported_Unique_ID

    // If the values are not available in the DOM, retrieve from localStorage
    if (!globalRelationshipID) {
        globalRelationshipID = localStorage.getItem('Global_Relationship_ID');
    }
    if (!metaID) {
        metaID = localStorage.getItem('Meta_ID');
    }
    if (!uniqueID) {
        uniqueID = localStorage.getItem('Unique_ID');
    }
    if (!jointlyReportedUniqueID) {
        jointlyReportedUniqueID = localStorage.getItem('Jointly_Reported_Unique_ID');
    }

    if (globalRelationshipID && metaID && uniqueID && jointlyReportedUniqueID) { // Ensure all values are available
        console.log('Updating server session data...', { Global_Relationship_ID: globalRelationshipID, Meta_ID: metaID, Unique_ID: uniqueID, Jointly_Reported_Unique_ID: jointlyReportedUniqueID });
        const csrftoken = getCookie('csrftoken'); // Retrieve CSRF token

        // AJAX request with CSRF token
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
    } else {
        console.log('One or more IDs are not available for sending to server.');
    }
}


// Toggle button for Global Headers bar's visibility
function setupToggleButton() {
    const parentDiv = document.querySelector('.Collapsible-Global-Identifiers-Header');
    const toggleButton = document.querySelector('.Collapsible-Toggle-Button');
    const icon = toggleButton.querySelector('svg');

    let isCollapsed = localStorage.getItem('isCollapsed') === 'true'; // Track collapsed state

    function toggleCollapse() {
        isCollapsed = !isCollapsed; // Toggle the state

        if (isCollapsed) {
            // Save input values to localStorage before hiding
            const globalRelationshipID = document.querySelector('input[name="Global_Relationship_ID"]');
            const metaID = document.querySelector('input[name="Meta_ID"]');
            const uniqueID = document.querySelector('input[name="Unique_ID"]'); // Add this line
            const jointlyReportedUniqueID = document.querySelector('input[name="Jointly_Reported_Unique_ID"]'); // Add this line

            if (globalRelationshipID && metaID && uniqueID && jointlyReportedUniqueID) {
                localStorage.setItem('Global_Relationship_ID', globalRelationshipID.value);
                localStorage.setItem('Meta_ID', metaID.value);
                localStorage.setItem('Unique_ID', uniqueID.value); // Add this line
                localStorage.setItem('Jointly_Reported_Unique_ID', jointlyReportedUniqueID.value); // Add this line
            }

            fadeOut(parentDiv);
            icon.style.transform = 'rotate(180deg)';
        } else {
            fadeIn(parentDiv);
            icon.style.transform = '';
        }

        localStorage.setItem('isCollapsed', isCollapsed.toString());
    }

    function fadeIn(element, duration = 500) {
        element.style.opacity = 0;
        element.style.display = 'block';

        let last = +new Date();
        let tick = function() {
            element.style.opacity = +element.style.opacity + (new Date() - last) / duration;
            last = +new Date();

            if (+element.style.opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
        };

        tick();
    }

    function fadeOut(element, duration = 500) {
        element.style.opacity = 1;

        let last = +new Date();
        let tick = function() {
            element.style.opacity = +element.style.opacity - (new Date() - last) / duration;
            last = +new Date();

            if (+element.style.opacity > 0) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            } else {
                element.style.display = 'none';
            }
        };

        tick();
    }

    // Set initial state from localStorage and add event listener
    if (toggleButton) {
        // Initialize the state based on localStorage
        if (isCollapsed) {
            parentDiv.style.display = 'none';
            parentDiv.style.opacity = 0;
            icon.style.transform = 'rotate(180deg)';
        } else {
            parentDiv.style.display = 'block';
            parentDiv.style.opacity = 1;
            icon.style.transform = '';
        }

        toggleButton.addEventListener('click', toggleCollapse);
    }

}

// Get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Dropdown-List Selection Update Functionality
document.querySelectorAll('.Dropdown-List .dropdown-toggle').forEach(dropdownButton => {
    // Find the dropdown menu related to this button
    var dropdownMenu = dropdownButton.nextElementSibling;

    if (dropdownMenu) {
        // Attach event listeners to all items in this dropdown menu
        dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default link behavior
                dropdownButton.textContent = this.textContent; // Set button text to item's text
            });
        });
    }
});

// Call the functions when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    populateSessionDataIntoFields();
    setupToggleButton();
});



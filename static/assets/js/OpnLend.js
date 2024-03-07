function getCsrfToken()
{
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

async function refreshCsrfToken()
{
    try
    {
        // Make an AJAX request to get a new CSRF token
        const response = await fetch('/refresh-csrf-token/');
        if (!response.ok)
        {
            throw new Error('Failed to refresh CSRF token');
        }

        const data = await response.json();
        if (!data.csrf_token)
        {
            throw new Error('CSRF token not found in response');
        }

        // Update the CSRF token value in the form
        const csrfTokenInput = document.querySelector('[name=csrfmiddlewaretoken]');
        if (!csrfTokenInput)
        {
            throw new Error('CSRF token input field not found');
        }

        csrfTokenInput.value = data.csrf_token;
        console.log("CSRF token refreshed:", data.csrf_token);
    } catch (error)
    {
        console.error('Error refreshing CSRF token:', error);
        throw error; // Rethrow the error to handle it outside this function
    }
}

// This is a bit redundant with the function below
// This one was created for re-useage throughout other functions
async function getSessionData() {
    // Refresh and Get CSRF Token
    refreshCsrfToken();
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    try {
        // Make a GET request to the user-session API endpoint with credentials included
        const response = await fetch('/api/user-profiles/user-session/get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken, // Include the CSRF token in the headers
            },
            credentials: 'include', // Include credentials like cookies in the request
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        console.log('Retrieved session data:', data);

        return data; // Return the session data
    } catch (error) {
        console.error('Failed to retrieve session data:', error);
        return null; // Return null if there's an error
    }
}

// Function to populate session data into input fields
async function populateSessionDataIntoFields() {
    // Refresh and Get CSRF Token
    refreshCsrfToken();
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    try {
        // Make a GET request to the user-session API endpoint with credentials included
        const response = await fetch('/api/user-profiles/user-session/get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken, // Include the CSRF token in the headers
            },
            credentials: 'include', // Include credentials like cookies in the request
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        console.log('Populating session data into fields...');
        console.log('Global_Relationship_ID:', data.Global_Relationship_ID);
        console.log('Meta_ID:', data.Meta_ID);
        console.log('Business_Unique_ID:', data.Business_Unique_ID);
        // Log other fields as needed

        // Populate all input fields with 'name' attribute 'Global_Relationship_ID'
        document.querySelectorAll('input[name="Global_Relationship_ID"]').forEach(input => {
            input.value = data.Global_Relationship_ID || '';
            console.log('Updated Global_Relationship_ID field:', input);
        });

        // Populate all input fields with 'name' attribute 'Meta_ID'
        document.querySelectorAll('input[name="Meta_ID"]').forEach(input => {
            input.value = data.Meta_ID || '';
            console.log('Updated Meta_ID field:', input);
        });

        // Populate all input fields with 'name' attribute 'Business_Unique_ID'
        document.querySelectorAll('input[name="Business_Unique_ID"]').forEach(input => {
            input.value = data.Business_Unique_ID || '';
            console.log('Updated Business_Unique_ID field:', input);
        });

        // Populate other fields as necessary
    } catch (error) {
        console.error('Failed to populate session data into fields:', error);
    }
    refreshCsrfToken();
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

// Function to create and initialize the chatbot
function initializeAIChatbot() {
    // Helper function to create and append an element
    function createElement(type, properties, parent) {
        var element = document.createElement(type);
        for (var prop in properties) {
            // Using hasOwnProperty to check if the property is directly on the object and not on the prototype chain
            if (properties.hasOwnProperty(prop)) {
                if (prop === 'innerHTML' || prop === 'textContent' || prop === 'onclick') {
                    element[prop] = properties[prop]; // Directly assign these properties
                } else {
                    element.setAttribute(prop, properties[prop]); // Set attributes for other properties
                }
            }
        }
        parent.appendChild(element);
        return element;
    }

    // Add custom styles
    var styles = `
        #chatbotIcon {
            position: fixed;
            bottom: 20px;
            right: 20px;
            cursor: pointer;
            width: 125px;
            height: 125px;
            box-shadow: 0 0 0 3px #0d571d, 0 0 0 12px #f5f5dc, 0 0 0 15px #0d571d;
            background: grey;
            border-radius: 50%;
            z-index: 1001;
        }
        #chatWindow {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 300px;
            height: 400px;
            border: 1px solid #ddd;
            background-color: white;
            display: none;
            padding: 10px;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
            overflow: auto;
            z-index: 1000; // Ensure this is under #speechBubble in stacking context
        }
        #speechBubble {
            position: fixed;
            bottom: 180px;
            right: 50px;
            padding: 10px;
            background-color: white;
            border: 1px solid black;
            border-radius: 10px;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
            width: 200px;
            z-index: 1002; // Ensure this is above #chatWindow in stacking context
        }
        #speechBubble:after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -10px;
            border-width: 10px;
            border-style: solid;
            border-color: white transparent transparent transparent;
        }
    `;
    createElement('style', { innerHTML: styles }, document.head);

    // Create and append the chatbot icon
    var chatbotIcon = createElement('img', {
        src: '/static/assets/img/Icons/OakenOracle.png',
        id: 'chatbotIcon',
        onclick: function() {
            chatWindow.style.display = 'block';
            speechBubble.style.display = 'none';
        }
    }, document.body);

    // Create and append the chat window
    var chatWindow = createElement('div', { id: 'chatWindow' }, document.body);

    // Placeholder message in chat window
    createElement('p', {
        textContent: 'Thanks for expressing interest! My features are currently in development. If you would like to learn more about my development and the OpnLend system, please contact my creator, Tucker Olson: tucker@opnlend.com!'
    }, chatWindow);

    // Create and append the speech bubble
    var speechBubble = createElement('div', {
        id: 'speechBubble',
        textContent: 'Greetings! I am the OakenOracle. I am a proprietary AI Large Language Model (LLM) undergoing development. I exist solely to assist you in anything related to credit and lending, as well as provide assistance when learning any OpnLend product offering.'
    }, document.body);
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
    initializeAIChatbot();
});
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
        textContent: 'Thanks for expressing interest! My features are currently in development, but will include a complete Loan Origination System guide, SBA SOP insight, and credit training. In the meantime, if you would like to speak to my creator regarding my development, please contact Tucker Olson at tuckerolson13@gmail.com!'
    }, chatWindow);

    // Create and append the speech bubble
    var speechBubble = createElement('div', {
        id: 'speechBubble',
        textContent: 'Greetings! I am the OakenOracle, an artificially intelligent entity enlightened in credit and lending, including the SBA SOP! I exist solely to assist you in anything related to credit and lending, as well as provide assistance when learning the OpnLend loan origination system.'
    }, document.body);
}
//DomContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    initializeToggleFunctionality();
    initializeAddSubfieldFunctionality();
    attachEventListeners();
    setupDateFieldForPeriod(1);
    setupStatementDateSyncForNewPeriod(1);

    var navbarContainer = document.getElementById('navbar-container');
    var sidebarBrandImg = document.querySelector('.sidebar-brand img');

    // Event listener for when the sidebar starts to be shown
    navbarContainer.addEventListener('show.bs.collapse', function () {
        updateSidebarTextVisibility(true);
    });

    // Event listener for when the sidebar is fully hidden
    navbarContainer.addEventListener('hidden.bs.collapse', function () {
        updateSidebarTextVisibility(false);
    });

    function updateSidebarTextVisibility(isVisible) {
        var sidebarTexts = document.querySelectorAll('#navbar-container .nav-text');
        sidebarTexts.forEach(function(text) {
            // Check if the element is not an icon
            if (!text.previousElementSibling || !text.previousElementSibling.classList.contains('sidebar-content')) {
                if (isVisible) {
                    text.style.display = 'inline-flex';
                    text.style.alignItems = 'center';
                    text.style.color = 'black';
                    text.style.whiteSpace = 'nowrap';
                } else {
                    text.style.display = 'none';
                }
            }
        });
    }
});

/// Temporary pop-up while in development
function createAndShowPopupforSpreading() {
    // Create the modal div and set its style
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.4)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    // Create the modal content div and set its style
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modalContent.style.textAlign = 'center';
    modalContent.style.maxWidth = '600px';
    modalContent.style.margin = '15px';

    // Add text to the modal
    const modalText = document.createElement('p');
    modalText.textContent = "Greetings. This page is an early example of my spreading application that serves as a personal learning project; learning new programming skills while applying my decade's worth of commercial credit experience. It is currently still in development, with some calculations not yet complete and bugs not yet resolved. I am sharing this solely as an early demonstration.";
    modalContent.appendChild(modalText);

    // Create an 'Okay' button
    const okayButton = document.createElement('button');
    okayButton.textContent = 'Okay';
    okayButton.style.marginTop = '10px';
    okayButton.onclick = function() {
        modal.style.display = 'none';
    };
    modalContent.appendChild(okayButton);

    // Append the content to the modal and the modal to the document body
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

//Upon page load, hides all sub-fields.
window.onload = function() {
    // Hide all sub-fields
    document.querySelectorAll('[data-id]').forEach(div => {
        div.style.display = 'none';
    });

    // Set the default dropdown selection
    const defaultSelection = document.querySelector('.dropdown-menu a:first-child');
    if (defaultSelection) {
        defaultSelection.style.fontWeight = 'bold';
    }

    // Attach event listeners to dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-menu a');
    const dropdownButton = document.querySelector('#dropdownMenuButton'); // Reference to the dropdown button

    dropdownItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior

            // Get the text of the clicked item
            const selectedItemText = this.textContent;

            // Update the dropdown button text
            dropdownButton.textContent = selectedItemText;

            // Toggle visibility of sections based on selection
            toggleVisibility(selectedItemText);
        });
    });

    // TEMPORARY: Create and show the custom pop-up
    createAndShowPopupforSpreading();

    // Initialize the chatbot
    initializeChatbot();

    // Setup conditional event listeners for all date inputs
    setupConditionalEventListeners();
    
    // Call the function to set up the fade-in on scroll
    setupFadeInOnScroll();
};

// Function to handle the Statement Date fields' (Income Statement & Balance Sheet) for when one or the other is changed
function setupStatementDateSyncForNewPeriod(period) {
    console.log('Function setupStatementDateSyncForNewPeriod called with period: ', period);

    var incomeStatement = document.querySelector('input[period="' + period + '"][statement="income-statement"][var="statement-date"]');
    var balanceSheet = document.querySelector('input[period="' + period + '"][statement="balance-sheet"][var="statement-date"]');

    console.log('Income Statement Element: ', incomeStatement);
    console.log('Balance Sheet Element: ', balanceSheet);

    // Rest of your code...

    incomeStatement.addEventListener('change', function() {
        console.log('Income Statement Date Changed: ', this.value);
        balanceSheet.value = this.value;
    });

    balanceSheet.addEventListener('change', function() {
        console.log('Balance Sheet Date Changed: ', this.value);
        if (this.value !== incomeStatement.value) {
            showPopup();
        }
    });
}

// Function to create and initialize the chatbot
function initializeChatbot() {
    // Create and append style element for custom styles
    var style = document.createElement('style');
    style.innerHTML = `
        #chatbotIcon {
            position: fixed;
            bottom: 20px;
            right: 20px;
            cursor: pointer;
            width: 125px;
            height: 125px;
            box-shadow: 
                0 0 0 3px #0d571d, /* Outermost green border */
                0 0 0 12px #f5f5dc,  /* Creme/bage background color */
                0 0 0 15px #0d571d; /* Inner green border */
            background: grey; /* Creme/bage background color */
            border-radius: 50%;
            z-index: 1001; /* Ensure icon is above speech bubble */
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
            z-index: 1000;
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
    document.head.appendChild(style);

    // Create chatbot icon
    var chatbotIcon = document.createElement('img');
    chatbotIcon.src = '/static/assets/img/Icons/OakenOracle.png';
    chatbotIcon.id = 'chatbotIcon';

    // Create chat window
    var chatWindow = document.createElement('div');
    chatWindow.id = 'chatWindow';

    // Placeholder message in chat window
    var placeholderMessage = document.createElement('p');
    placeholderMessage.textContent = 'Thanks for expressing interest! My features are currently in development, but will include a complete Loan Origination System guide, SBA SOP insight, and credit training. In the meantime, if you would like to speak to my creator regarding my development, please contact Tucker Olson at tuckerolson13@gmail.com!';
    chatWindow.appendChild(placeholderMessage);

    // Create speech bubble
    var speechBubble = document.createElement('div');
    speechBubble.id = 'speechBubble';
    speechBubble.textContent = "Greetings! I am the OakenOracle, an artifically intelligent entity enlightened in credit and lending, including the SBA SOP! I exist solely to assist you in anything related to credit and lending, as well as provide assistance when learning the OpnLend loan origination system.";

    // Append the chatbot icon, chat window, and speech bubble to the body
    document.body.appendChild(chatbotIcon);
    document.body.appendChild(chatWindow);
    document.body.appendChild(speechBubble);

    // Event listener to show the chat window and hide the speech bubble
    chatbotIcon.onclick = function() {
        chatWindow.style.display = 'block'; // Show the chat window
        speechBubble.style.display = 'none'; // Hide the speech bubble
    };
}

// Toggles the visibility of the Income Statement and Balance Sheet
function toggleVisibility(selectedItemText) {
    const incomeStatementSections = document.querySelectorAll('.income-statement-header, .income-statement');
    const balanceSheetSections = document.querySelectorAll('.balance-sheet-header, .balance-sheet');

    if (selectedItemText === 'Income Statement') {
        incomeStatementSections.forEach(section => section.style.display = 'block');
        balanceSheetSections.forEach(section => section.style.display = 'none');
    } else if (selectedItemText === 'Balance Sheet') {
        incomeStatementSections.forEach(section => section.style.display = 'none');
        balanceSheetSections.forEach(section => section.style.display = 'block');
    } else if (selectedItemText === 'Debt Schedule') {
        showDebtSchedulePopup();
    } else if (selectedItemText === 'Combined Income Statement and Balance Sheet') {
        // Show both sections
        incomeStatementSections.forEach(section => section.style.display = 'block');
        balanceSheetSections.forEach(section => section.style.display = 'block');

        // Scroll to Income Statement first, then to Balance Sheet
        smoothScrollTo('.income-statement-header');
        setTimeout(() => smoothScrollTo('.balance-sheet-header'), 1000); // Adjust time as needed
    } else {
        incomeStatementSections.forEach(section => section.style.display = 'block');
        balanceSheetSections.forEach(section => section.style.display = 'block');
    }
}

// Create the animateScrollToSection function
// Function to check if an element is in the viewport
function isElementInView(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Apply fade-in effect when the element is in the viewport
function applyFadeInEffect(element, delay = 0) {
    setTimeout(() => {
        if (isElementInView(element)) {
            element.style.opacity = '1';
            element.style.transition = 'opacity 2s ease-in';
        } else {
            element.style.opacity = '0';
            element.style.transition = 'opacity 2s ease-out';
        }
    }, delay);
}

// Initial fade-in on scroll
function applyInitialFadeIn(selector, delay = 0) {
    const element = document.querySelector(selector);
    if (element) {
        applyFadeInEffect(element, delay);
    }
}

// Create the animateScrollToSection function
function setupFadeInOnScroll() {
    // Scroll event listener
    window.addEventListener('scroll', function() {
        const balanceSheetHeader = document.querySelector('.balance-sheet-header');
        const balanceSheetSection = document.querySelector('.balance-sheet');
        const incomeStatementHeader = document.querySelector('.income-statement-header');
        const incomeStatementSection = document.querySelector('.income-statement');

        if (balanceSheetHeader) {
            applyFadeInEffect(balanceSheetHeader);
        }
        if (balanceSheetSection) {
            applyFadeInEffect(balanceSheetSection, 750); // Delay for balance sheet section
        }
        if (incomeStatementHeader) {
            applyFadeInEffect(incomeStatementHeader, 750); // Delay for income statement header
        }
        if (incomeStatementSection) {
            applyFadeInEffect(incomeStatementSection); // No delay for income statement section
        }
    });

    // Initial application of fade-in effect
    applyInitialFadeIn('.balance-sheet-header');
    applyInitialFadeIn('.balance-sheet', 750);
    applyInitialFadeIn('.income-statement-header', 750);
    applyInitialFadeIn('.income-statement');
}

// Temporary dynamic HTML and CSS to handle the pop-up notification
// informing the user that the Business Debt Schedule is currently
// in development and to check back at a later date.
function showDebtSchedulePopup() {
    // Create the popup container with inline CSS
    const popup = document.createElement('div');
    popup.id = 'debt-schedule-popup';
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = 'white';
    popup.style.border = '1px solid black';
    popup.style.padding = '20px';
    popup.style.zIndex = '1000';
    popup.style.textAlign = 'center';
    popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
    popup.style.borderRadius = '10px';
    popup.style.maxWidth = '300px';

    // Add the message
    const message = document.createElement('p');
    message.textContent = 'The Business Debt Schedule portion of this Loan Origination System is currently in development. Please check back at a later date.';
    popup.appendChild(message);

    // Add the "Ok" button with styling
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Ok';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.borderRadius = '5px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'lightgray';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
        document.body.removeChild(popup);
    };
    popup.appendChild(closeButton);

    // Append the popup to the body
    document.body.appendChild(popup);
}

// Toggles the visibitliy of nested fields
function initializeToggleFunctionality() {
    document.querySelectorAll('.toggle-subfields').forEach(button => {
        button.addEventListener('click', toggleDisplay);
    });

    document.querySelectorAll('.remove-subfield').forEach(button => {
        button.addEventListener('click', toggleDisplay);
    });
}

// Toggles the dispaly of generic and custom fields
function toggleDisplay() {
    const targetId = this.getAttribute('data-target');

    // Selecting the label and input container divs, the buttons, and the blank space divs
    const labelDivs = document.querySelectorAll('.nested-field-labels[data-id="' + targetId + '"]');
    const inputDivs = document.querySelectorAll('.nested-field-inputs[data-id="' + targetId + '"]');
    const targetButtons = document.querySelectorAll('.add-subfield[data-id="' + targetId + '"]');
    const removeButtons = document.querySelectorAll('.remove-subfield[data-id="' + targetId + '"]');
    const blankSpaceDivs = document.querySelectorAll('.btn-placeholder[data-id="' + targetId + '"]');

    // Function to toggle display
    const toggleElementDisplay = (element) => {
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    };

    // Toggling display for both divs, the buttons, and the blank space divs
    labelDivs.forEach(toggleElementDisplay);
    inputDivs.forEach(toggleElementDisplay);
    targetButtons.forEach(toggleElementDisplay);
    removeButtons.forEach(toggleElementDisplay);
    blankSpaceDivs.forEach(toggleElementDisplay);

    // Toggle rotation for arrow icons within the context of the toggled element
    const arrowIcons = document.querySelectorAll('.arrow-icon[data-id="' + targetId + '"]');
    arrowIcons.forEach(icon => {
        icon.classList.toggle('arrow-icon-rotated');
    });
}

// Clones the custom-label input fields; allowing for dynamic, unlimited field creation for each major category
function initializeAddSubfieldFunctionality() {
    // Use event delegation to handle all clicks on the document
    document.addEventListener('click', function(event) {
        // Check if the clicked element is an 'add-subfield' button
        if (event.target.classList.contains('add-subfield')) {
            const button = event.target;
            const targettoggleid = button.getAttribute('data-target');
            const originalDataId = button.getAttribute('data-id');

            // Selecting all divs with the specified toggle-id
            const targetDivs = document.querySelectorAll(`[toggle-id="${targettoggleid}"]`);

            // Calculate the next incremental value
            const nextIncrement = targetDivs.length + 1;

            targetDivs.forEach(targetDiv => {
                const clone = targetDiv.cloneNode(true);
                const toggleid = targetDiv.getAttribute('toggle-id');

                // Append an incremental value to the toggle-id
                clone.setAttribute('toggle-id', `${toggleid}_${nextIncrement}`);

                // Insert the clone below the original
                targetDiv.parentNode.insertBefore(clone, targetDiv.nextSibling);

                // Set up event listeners for input fields in the cloned div
                setupInputFieldEventListeners(clone);
            });

            // Modify the clicked button to be a "remove-subfield" button
            button.classList.remove('add-subfield');
            button.classList.add('remove-subfield', 'centered-content');
            button.textContent = '-';

            // Create a new 'add-subfield' button
            const newButton = document.createElement('button');
            newButton.classList.add('add-subfield');
            newButton.textContent = '+';
            newButton.setAttribute('data-target', `${targettoggleid}_${nextIncrement}`);
            newButton.setAttribute('data-id', originalDataId);

            // Insert the new button after the clicked button
            button.parentNode.insertBefore(newButton, button.nextSibling);

            // Reattach event listeners to the new subfields
            setupSubtotalListenersForGroup(clone);
        } else if (event.target.classList.contains('remove-subfield')) {
            // Handle removal of subfields
            const button = event.target;
            const targettoggleid = button.getAttribute('data-target');
            const userConfirmed = confirm('This will permanently remove this field for all periods shown. Are you sure you want to continue?');

            if (userConfirmed) {
                const targetDivs = document.querySelectorAll(`[toggle-id="${targettoggleid}"]`);

                targetDivs.forEach(targetDiv => {
                    targetDiv.parentNode.removeChild(targetDiv);
                });

                button.parentNode.removeChild(button);
            }
        }

        // Re-initalize the attach event listeners function
        attachEventListeners()
        // Re-initalize the attach event listener for field navigation (WASD + arrow keys)
        attachNavigationEventListeners(['.income-statement', '.balance-sheet']);
    });
}

// Removes custom fields that were previously added; first warning user of permanent deletion
function initializeRemoveSubfieldFunctionality() {
    document.querySelectorAll('.remove-subfield').forEach(button => {
        button.addEventListener('click', function() {
            const targettoggleid = this.getAttribute('data-target');

            // Display a confirmation dialog to the user
            const userConfirmed = confirm('This will permanently remove this field for all periods shown. Are you sure you want to continue?');

            // If the user clicked "OK", remove the fields
            if (userConfirmed) {
                // Selecting all divs with the specified toggle-id
                const targetDivs = document.querySelectorAll('[toggle-id="' + targettoggleid + '"]');

                // Remove the target divs and the button
                targetDivs.forEach(targetDiv => {
                    targetDiv.parentNode.removeChild(targetDiv);
                });

                // Remove the button
                this.parentNode.removeChild(this);
            }
        });
    });
}

// Adds financial period when selecting the "Add" button
function addPeriodHandler() {
    // Handling the Income Statement Container
    const incomeStatementContainer = this.closest('.container');
    const period = parseInt(incomeStatementContainer.getAttribute('period'));
    const newPeriod = period + 1;

    const clonedIncomeStatementContainer = incomeStatementContainer.cloneNode(true);
    clonedIncomeStatementContainer.setAttribute('period', newPeriod);
    clonedIncomeStatementContainer.classList.add('fade-in');

    // Reset all input fields within the cloned income statement container except 'fiscal-year-end-date', which is inherited from the previous period.
    const incomeInputs = clonedIncomeStatementContainer.querySelectorAll('input');
    incomeInputs.forEach(input => {
        if (input.getAttribute('var') !== 'fiscal-year-end-date') {
            input.value = '';
        }
        input.setAttribute('period', newPeriod); // Update the period attribute
    });

    // Append the cloned container to the income statement input container
    const incomeStatementInputContainer = document.querySelector('.input-container');
    incomeStatementInputContainer.appendChild(clonedIncomeStatementContainer);

    // Handling the Balance Sheet Container
    const balanceSheetContainer = document.getElementById("Balance-Sheets");
    const lastBalanceSheetPeriod = balanceSheetContainer.querySelector('.container:last-child');

    const clonedBalanceSheetContainer = lastBalanceSheetPeriod.cloneNode(true);
    clonedBalanceSheetContainer.setAttribute('period', newPeriod);
    clonedBalanceSheetContainer.classList.add('fade-in');

    // Reset all input fields within the cloned balance sheet container
    const balanceInputs = clonedBalanceSheetContainer.querySelectorAll('input');
    balanceInputs.forEach(input => {
        input.value = '';
        input.setAttribute('period', newPeriod);  // Update the period attribute
    });

    // Append the cloned container to the balance sheet input container
    balanceSheetContainer.appendChild(clonedBalanceSheetContainer);

    // Attach event listeners to the new 'add-period' and 'delete-period' buttons within the cloned containers
    const newAddPeriodButtons = [clonedIncomeStatementContainer.querySelector('.add-period'), clonedBalanceSheetContainer.querySelector('.add-period')];
    const newDeletePeriodButtons = [clonedIncomeStatementContainer.querySelector('.delete-period'), clonedBalanceSheetContainer.querySelector('.delete-period')];

    newAddPeriodButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', addPeriodHandler);
        }
    });

    newDeletePeriodButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', deletePeriodHandler);
        }
    });

    // Set up other event listeners after the containers are appended: Income Statement
    setupInputFieldEventListeners(clonedIncomeStatementContainer);
    attachCalculationListeners(clonedIncomeStatementContainer, newPeriod);
    attachNavigationEventListeners(clonedIncomeStatementContainer);
    // Set up other event listeners after the containers are appended: Balance Sheet
    setupInputFieldEventListeners(clonedBalanceSheetContainer);
    attachCalculationListeners(clonedBalanceSheetContainer, newPeriod);
    attachNavigationEventListeners(clonedBalanceSheetContainer);
    
    // Setup event listeners for date fields to calculate months-in-financial-period for newly added periods
    setupDateFieldForPeriod(newPeriod);
    
    // Attach event listener for handling the Statement Date fields
    setupStatementDateSyncForNewPeriod(newPeriod);
}

// Prompts the user to confirm desire to delete a financial period. If yes, then proceeds. If not, no change occurs.
function deletePeriodHandler() {
    const confirmDelete = confirm("Are you sure you want to delete this financial period? Once deleted and saved, it cannot be recovered.");
    if (confirmDelete) {
        const container = this.closest('.container');
        const periodToDelete = container.getAttribute('period');

        // Delete the Income Statement Container
        container.remove();

        // Delete the corresponding Balance Sheet Container
        const balanceSheetContainer = document.getElementById("Balance-Sheets");
        const balanceSheetPeriodToDelete = balanceSheetContainer.querySelector(`.container[period="${periodToDelete}"]`);

        if (balanceSheetPeriodToDelete) {
            balanceSheetPeriodToDelete.remove();
        }
    }
}

// Attaches calculation event listeners to new containers (i.e., financial periods); ensuring same functionality seen within the default container (period 1) is applied to all
function attachCalculationListeners(container, period) {
    // For gross-revenue-generic
    const genericInput = container.querySelector(`input[var="gross-revenue-generic"][period="${period}"]`);
    if (genericInput) {
        genericInput.addEventListener('change', updateSubtotal);
        genericInput.addEventListener('change', updateNetRevenue);
        genericInput.addEventListener('change', updateGrossProfit); 
    }

    // For all gross-revenue-custom fields
    container.querySelectorAll(`input[var="gross-revenue-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateSubtotal);
            input.addEventListener('change', updateNetRevenue);
            input.addEventListener('change', updateGrossProfit); 
        });

    // For gross-revenue-subtotal
    const subtotalInput = container.querySelector(`input[var="gross-revenue-subtotal"][period="${period}"]`);
    if (subtotalInput) {
        subtotalInput.addEventListener('change', updateNetRevenue);
        subtotalInput.addEventListener('change', updateGrossProfit); 
    }

    // For returns-and-allowances
    const returnsAndAllowancesInput = container.querySelector(`input[var="returns-and-allowances"][period="${period}"]`);
    if (returnsAndAllowancesInput) {
        returnsAndAllowancesInput.addEventListener('change', updateNetRevenue);
        returnsAndAllowancesInput.addEventListener('change', updateGrossProfit); 
    }

    // For net-revenue
    const netRevenueInput = container.querySelector(`input[var="net-revenue"][period="${period}"]`);
    if (netRevenueInput) {
        netRevenueInput.addEventListener('change', updateNetRevenue);
        netRevenueInput.addEventListener('change', updateGrossProfit);
        netRevenueInput.addEventListener('change', updateNetProfitAfterTaxes);
    }

    // For cost-of-goods-sold-subtotal
    const costOfGoodsSoldSubtotalInput = container.querySelector(`input[var="cost-of-goods-sold-subtotal"][period="${period}"]`);
    if (costOfGoodsSoldSubtotalInput) {
        // When the subtotal field is manually edited
        costOfGoodsSoldSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        costOfGoodsSoldSubtotalInput.addEventListener('change', updateGrossProfit);
        costOfGoodsSoldSubtotalInput.addEventListener('change', updateCostOfGoodsSoldSubtotal);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = costOfGoodsSoldSubtotalInput.closest('.Cost-of-Goods-Sold-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== costOfGoodsSoldSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        costOfGoodsSoldSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateCostOfGoodsSoldSubtotal.call(input);
                    });
                }
            });
        }
    }

    // For cost-of-goods-sold-generic
    const costOfGoodsSoldGenericInput = container.querySelector(`input[var="cost-of-goods-sold-generic"][period="${period}"]`);
    if (costOfGoodsSoldGenericInput) {
        costOfGoodsSoldGenericInput.addEventListener('change', updateCostOfGoodsSoldSubtotal, updateGrossProfit);
    }

    // For cost-of-goods-sold-depreciation
    const costOfGoodsSoldDepreciationInput = container.querySelector(`input[var="cost-of-goods-sold-depreciation"][period="${period}"]`);
    if (costOfGoodsSoldDepreciationInput) {
        costOfGoodsSoldDepreciationInput.addEventListener('change', updateCostOfGoodsSoldSubtotal, updateGrossProfit);
    }

    // For cost-of-goods-sold-custom
    container.querySelectorAll(`input[var="cost-of-goods-sold-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateCostOfGoodsSoldSubtotal, updateGrossProfit);
        });
    
    // For gross-profit
    const grossProfitInput = container.querySelector(`input[var="gross-profit"][period="${period}"]`);
    if (grossProfitInput) {
        grossProfitInput.addEventListener('change', updateGrossProfit);
        grossProfitInput.addEventListener('change', updateNetProfitAfterTaxes); // Attach updateNetProfitAfterTaxes here
    }

    // For other-operating-expenses-subtotal
    const otherOperatingExpensesSubtotalInput = container.querySelector(`input[var="other-operating-expenses-subtotal"][period="${period}"]`);
    if (otherOperatingExpensesSubtotalInput) {
        // When the subtotal field is manually edited
        otherOperatingExpensesSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        otherOperatingExpensesSubtotalInput.addEventListener('change', updateOtherOperatingExpensesSubtotal);
        otherOperatingExpensesSubtotalInput.addEventListener('change', updateTotalOperatingExpenses); 
        otherOperatingExpensesSubtotalInput.addEventListener('change', updateNetOperatingIncome);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = otherOperatingExpensesSubtotalInput.closest('.Other-Operating-Expenses-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== otherOperatingExpensesSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        otherOperatingExpensesSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateOtherOperatingExpensesSubtotal.call(input);
                    });
                }
            });
        }
    }

    // For other-operating-expenses-generic
    const otherOperatingExpensesGenericInput = container.querySelector(`input[var="other-operating-expenses-generic"][period="${period}"]`);
    if (otherOperatingExpensesGenericInput) {
        otherOperatingExpensesGenericInput.addEventListener('change', updateOtherOperatingExpensesSubtotal);
        otherOperatingExpensesGenericInput.addEventListener('change', updateTotalOperatingExpenses); // Attach updateTotalOperatingExpenses here
        otherOperatingExpensesGenericInput.addEventListener('change', updateNetOperatingIncome); // Attach updateNetOperatingIncome here
    }

    // For all other-operating-expenses-custom fields
    container.querySelectorAll(`input[var="other-operating-expenses-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateOtherOperatingExpensesSubtotal);
            input.addEventListener('change', updateTotalOperatingExpenses); // Attach updateTotalOperatingExpenses here
            input.addEventListener('change', updateNetOperatingIncome); // Attach updateNetOperatingIncome here
        });

    // Attach event listeners for the various operating expenses
    [
        'salaries-wages-and-payroll-taxes',
        'officer-compensation',
        'repairs-and-maintenance',
        'bad-debt',
        'rent',
        'taxes-and-licenses',
        'interest-expense',
        'depreciation-and-depletion',
        'amortization',
        'retirement-plans',
        'employee-benefits',
        'other-operating-expenses-generic'
    ].forEach(expenseVar => {
        const expenseInput = container.querySelector(`input[var="${expenseVar}"][period="${period}"]`);
        if (expenseInput) {
            expenseInput.addEventListener('change', updateTotalOperatingExpenses);
            console.log(`Attached updateTotalOperatingExpenses to ${expenseVar}`);

            expenseInput.addEventListener('change', updateNetOperatingIncome);
            console.log(`Attached updateNetOperatingIncome to ${expenseVar}`);
        }
    });

    // For total-operating-expenses
    const totalOperatingExpensesInput = container.querySelector(`input[var="total-operating-expenses"][period="${period}"]`);
    if (totalOperatingExpensesInput) {
        totalOperatingExpensesInput.addEventListener('change', updateTotalOperatingExpenses);
        totalOperatingExpensesInput.addEventListener('change', updateNetOperatingIncome);
    }

    // For net-operating-income
    const netOperatingIncomeInput = container.querySelector(`input[var="net-operating-income"][period="${period}"]`);
    if (netOperatingIncomeInput) {
        netOperatingIncomeInput.addEventListener('change', updateNetOperatingIncome);
        netOperatingIncomeInput.addEventListener('change', updateNetProfitAfterTaxes);
    }
    
    // For other-income-subtotal
    const otherIncomeSubtotalInput = container.querySelector(`input[var="other-income-subtotal"][period="${period}"]`);
    if (otherIncomeSubtotalInput) {
        // When the subtotal field is manually edited
        otherIncomeSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        otherIncomeSubtotalInput.addEventListener('change', updateOtherIncomeSubtotal);
        otherIncomeSubtotalInput.addEventListener('change', updateTotalOtherIncomeAndExpenses);
        otherIncomeSubtotalInput.addEventListener('change', updateNetOperatingIncome);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = otherIncomeSubtotalInput.closest('.Other-Income-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== otherIncomeSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        otherIncomeSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateOtherIncomeSubtotal.call(input);
                    });
                }
            });
        }
    }

    // For other-income-generic
    const otherIncomeGenericInput = container.querySelector(`input[var="other-income-generic"][period="${period}"]`);
    if (otherIncomeGenericInput) {
        otherIncomeGenericInput.addEventListener('change', updateOtherIncomeSubtotal);
        otherIncomeGenericInput.addEventListener('change', updateTotalOtherIncomeAndExpenses);
        otherIncomeGenericInput.addEventListener('change', updateNetOperatingIncome);
    }

    // For all other-income-custom fields
    container.querySelectorAll(`input[var="other-income-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateOtherIncomeSubtotal);
            input.addEventListener('change', updateTotalOtherIncomeAndExpenses);
            input.addEventListener('change', updateNetOperatingIncome);
        });

    // For other-expense-generic
    const otherExpenseGenericInput = container.querySelector(`input[var="other-expenses-generic"][period="${period}"]`);
    if (otherExpenseGenericInput) {
        otherExpenseGenericInput.addEventListener('change', updateOtherExpenseSubtotal);
        otherExpenseGenericInput.addEventListener('change', updateTotalOtherIncomeAndExpenses);
    }

    // For all other-expense-custom fields
    container.querySelectorAll(`input[var="other-expenses-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateOtherExpenseSubtotal);
            input.addEventListener('change', updateTotalOtherIncomeAndExpenses);
        });

    // For other-expense-subtotal
    const otherExpenseSubtotalInput = container.querySelector(`input[var="other-expenses-subtotal"][period="${period}"]`);
    if (otherExpenseSubtotalInput) {
        // When the subtotal field is manually edited
        otherExpenseSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        otherExpenseSubtotalInput.addEventListener('change', updateOtherExpenseSubtotal);
        otherExpenseSubtotalInput.addEventListener('change', updateTotalOtherIncomeAndExpenses);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = otherExpenseSubtotalInput.closest('.Other-Expenses-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== otherExpenseSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        otherExpenseSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateOtherExpenseSubtotal.call(input);
                    });
                }
            });
        }
    }

    // For loss on sale of assets
    const lossOnSaleOfAssetsInput = container.querySelector(`input[var="loss-on-sale-of-assets"][period="${period}"]`);
    if (lossOnSaleOfAssetsInput) {
        lossOnSaleOfAssetsInput.addEventListener('change', updateTotalOtherIncomeAndExpenses);
    }

    // For gain on sale of assets
    const gainOnSaleOfAssetsInput = container.querySelector(`input[var="gain-on-sale-of-assets"][period="${period}"]`);
    if (gainOnSaleOfAssetsInput) {
        gainOnSaleOfAssetsInput.addEventListener('change', updateTotalOtherIncomeAndExpenses);
    }

    // For investment income
    const investmentIncomeInput = container.querySelector(`input[var="investment-income"][period="${period}"]`);
    if (investmentIncomeInput) {
        investmentIncomeInput.addEventListener('change', updateTotalOtherIncomeAndExpenses);
    }
    
    // For net operating income
    const netOperatingIncomeField = container.querySelector(`input[var="net-operating-income"][period="${period}"]`);
    if (netOperatingIncomeField) {
        netOperatingIncomeField.addEventListener('change', updateNetIncome);
    }
    
    // Fopr total other income and expenses
    const totalOtherIncomeAndExpensesField = container.querySelector(`input[var="total-other-income-and-expenses"][period="${period}"]`);
    if (totalOtherIncomeAndExpensesField) {
        totalOtherIncomeAndExpensesField.addEventListener('change', updateNetIncome);
    }
    
    // For net-profit
    const netProfitInput = container.querySelector(`input[var="net-profit"][period="${period}"]`);
    if (netProfitInput) {
        netProfitInput.addEventListener('change', updateNetProfitAfterTaxes); // Attach updateNetProfitAfterTaxes here
    }
    
    // For corporate-taxes
    const corporateTaxesInput = container.querySelector(`input[var="corporate-taxes"][period="${period}"]`);
    if (corporateTaxesInput) {
        corporateTaxesInput.addEventListener('change', updateNetProfitAfterTaxes);
    }

    // For corporate-tax-refund
    const corporateTaxRefundInput = container.querySelector(`input[var="corporate-tax-refund"][period="${period}"]`);
    if (corporateTaxRefundInput) {
        corporateTaxRefundInput.addEventListener('change', updateNetProfitAfterTaxes);
    }
    
    
    ///LINE SEPERATOR FOR BALANCE SHEET///

    ///BALANCE SHEET CASH///
    // For bs-cash-subtotal
    const bsCashSubtotalInput = container.querySelector(`input[var="bs-cash-subtotal"][period="${period}"]`);
    if (bsCashSubtotalInput) {
        // When the subtotal field is manually edited
        bsCashSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsCashSubtotalInput.addEventListener('change', updateBalanceSheetCashSubtotal);
        bsCashSubtotalInput.addEventListener('change', updateTotalCurrentAssets);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsCashSubtotalInput.closest('.Balance-Sheet-Cash-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsCashSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsCashSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateBalanceSheetCashSubtotal.call(input);
                    });
                }
            });
        }
    }

    // For bs-cash-generic
    const bsCashGenericInput = container.querySelector(`input[var="bs-cash-generic"][period="${period}"]`);
    if (bsCashGenericInput) {
        bsCashGenericInput.addEventListener('change', updateBalanceSheetCashSubtotal);
        bsCashGenericInput.addEventListener('change', updateTotalCurrentAssets);
    }

    // For bs-cash-at-financial-institution
    const bsCashAtFinancialInstitutionInput = container.querySelector(`input[var="bs-cash-at-financial-institution"][period="${period}"]`);
    if (bsCashAtFinancialInstitutionInput) {
        bsCashAtFinancialInstitutionInput.addEventListener('change', updateBalanceSheetCashSubtotal);
        bsCashAtFinancialInstitutionInput.addEventListener('change', updateTotalCurrentAssets);
    }

    // For bs-cash-custom
    container.querySelectorAll(`input[var="bs-cash-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateBalanceSheetCashSubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
        }); 

    ///BALANCE SHEET ACCOUNTS RECEIVABLE///
    // For bs-accounts-receivable-subtotal
    const bsAccountsReceivableSubtotalInput = container.querySelector(`input[var="bs-accounts-receivable-subtotal"][period="${period}"]`);
    if (bsAccountsReceivableSubtotalInput) {
        // When the subtotal field is manually edited
        bsAccountsReceivableSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsAccountsReceivableSubtotalInput.addEventListener('change', updateBalanceSheetAccountsReceivableSubtotal);
        bsAccountsReceivableSubtotalInput.addEventListener('change', updateTotalCurrentAssets);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsAccountsReceivableSubtotalInput.closest('.Balance-Sheet-Accounts-Receivable-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsAccountsReceivableSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsAccountsReceivableSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateBalanceSheetAccountsReceivableSubtotal.call(input);
                    });
                }
            });
        }
    }

    // For bs-accounts-receivable-generic
    const bsAccountsReceivableGenericInput = container.querySelector(`input[var="bs-accounts-receivable-generic"][period="${period}"]`);
    if (bsAccountsReceivableGenericInput) {
        bsAccountsReceivableGenericInput.addEventListener('change', updateBalanceSheetAccountsReceivableSubtotal);
        bsAccountsReceivableGenericInput.addEventListener('change', updateTotalCurrentAssets);
    }

    // For bs-accounts-receivable-allowance-for-doubtful-accounts
    const bsAccountsReceivableAllowanceInput = container.querySelector(`input[var="bs-accounts-receivable-allowance-for-doubtful-accounts"][period="${period}"]`);
    if (bsAccountsReceivableAllowanceInput) {
        bsAccountsReceivableAllowanceInput.addEventListener('change', updateBalanceSheetAccountsReceivableSubtotal);
        bsAccountsReceivableAllowanceInput.addEventListener('change', updateTotalCurrentAssets);
    }

    // For bs-accounts-receivable-custom
    container.querySelectorAll(`input[var="bs-accounts-receivable-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateBalanceSheetAccountsReceivableSubtotal);
            bsAccountsReceivableAllowanceInput.addEventListener('change', updateTotalCurrentAssets);
        }); 
    
    ///INVENTORY///
    // For bs-inventory-subtotal
    const bsInventorySubtotalInput = container.querySelector(`input[var="bs-inventory-subtotal"][period="${period}"]`);
    if (bsInventorySubtotalInput) {
        // When the subtotal field is manually edited
        bsInventorySubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsInventorySubtotalInput.addEventListener('change', updateBalanceSheetInventorySubtotal);
        bsInventorySubtotalInput.addEventListener('change', updateTotalCurrentAssets);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsInventorySubtotalInput.closest('.Balance-Sheet-Inventory-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsInventorySubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsInventorySubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateBalanceSheetInventorySubtotal.call(input);
                    });
                }
            });
        }
    }

    // For bs-inventory-generic
    const bsInventoryGenericInput = container.querySelector(`input[var="bs-inventory-generic"][period="${period}"]`);
    if (bsInventoryGenericInput) {
        bsInventoryGenericInput.addEventListener('change', updateBalanceSheetInventorySubtotal);
        bsInventoryGenericInput.addEventListener('change', updateTotalCurrentAssets);
    }

    // For bs-inventory-raw-materials
    const bsInventoryRawMaterialsInput = container.querySelector(`input[var="bs-inventory-raw-materials"][period="${period}"]`);
    if (bsInventoryRawMaterialsInput) {
        bsInventoryRawMaterialsInput.addEventListener('change', updateBalanceSheetInventorySubtotal);
        bsInventoryRawMaterialsInput.addEventListener('change', updateTotalCurrentAssets);
    }

    // For bs-inventory-work-in-progress
    const bsInventoryWorkInProgressInput = container.querySelector(`input[var="bs-inventory-work-in-progress"][period="${period}"]`);
    if (bsInventoryWorkInProgressInput) {
        bsInventoryWorkInProgressInput.addEventListener('change', updateBalanceSheetInventorySubtotal);
        bsInventoryWorkInProgressInput.addEventListener('change', updateTotalCurrentAssets);
    }

    // For bs-inventory-finished-goods
    const bsInventoryFinishedGoodsInput = container.querySelector(`input[var="bs-inventory-finished-goods"][period="${period}"]`);
    if (bsInventoryFinishedGoodsInput) {
        bsInventoryFinishedGoodsInput.addEventListener('change', updateBalanceSheetInventorySubtotal);
        bsInventoryFinishedGoodsInput.addEventListener('change', updateTotalCurrentAssets);
    }

    // For bs-inventory-in-transit
    const bsInventoryInTransitInput = container.querySelector(`input[var="bs-inventory-in-transit"][period="${period}"]`);
    if (bsInventoryInTransitInput) {
        bsInventoryInTransitInput.addEventListener('change', updateBalanceSheetInventorySubtotal);
        bsInventoryInTransitInput.addEventListener('change', updateTotalCurrentAssets);
    }

    // For bs-inventory-custom
    container.querySelectorAll(`input[var="bs-inventory-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateBalanceSheetInventorySubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
        }); 

    ///BALANCE SHEET OTHER CURRENT ASSETS///
    // For bs-other-current-assets-subtotal
    const bsOtherCurrentAssetsSubtotalInput = container.querySelector(`input[var="bs-other-current-assets-subtotal"][period="${period}"]`);
    if (bsOtherCurrentAssetsSubtotalInput) {
        // When the subtotal field is manually edited
        bsOtherCurrentAssetsSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsOtherCurrentAssetsSubtotalInput.addEventListener('change', updateBalanceSheetOtherCurrentAssetsSubtotal);
        bsOtherCurrentAssetsSubtotalInput.addEventListener('change', updateTotalCurrentAssets);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsOtherCurrentAssetsSubtotalInput.closest('.Balance-Sheet-Other-Current-Assets-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsOtherCurrentAssetsSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsOtherCurrentAssetsSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateBalanceSheetOtherCurrentAssetsSubtotal.call(input);
                    });
                }
            });
        }
    }

    // For bs-other-current-assets-generic
    const bsOtherCurrentAssetsGenericInput = container.querySelector(`input[var="bs-other-current-assets-generic"][period="${period}"]`);
    if (bsOtherCurrentAssetsGenericInput) {
        bsOtherCurrentAssetsGenericInput.addEventListener('change', updateBalanceSheetOtherCurrentAssetsSubtotal);
        bsOtherCurrentAssetsGenericInput.addEventListener('change', updateTotalCurrentAssets);
    }

    // For bs-other-current-assets-deposits
    const bsOtherCurrentAssetsDepositsInput = container.querySelector(`input[var="bs-other-current-assets-deposits"][period="${period}"]`);
    if (bsOtherCurrentAssetsDepositsInput) {
        bsOtherCurrentAssetsDepositsInput.addEventListener('change', updateBalanceSheetOtherCurrentAssetsSubtotal);
        bsOtherCurrentAssetsDepositsInput.addEventListener('change', updateTotalCurrentAssets);
    }

    // For bs-other-current-assets-custom
    container.querySelectorAll(`input[var="bs-other-current-assets-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateBalanceSheetOtherCurrentAssetsSubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
        }); 
    
    ///BALANCE SHEET PROPERTY, PLANT, AND EQUIPMENT///
    const bsPropertyPlantEquipmentSubtotalInput = container.querySelector(`input[var="bs-property-plant-and-equipment-subtotal"][period="${period}"]`);
    if (bsPropertyPlantEquipmentSubtotalInput) {
        // When the subtotal field is manually edited
        bsPropertyPlantEquipmentSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetPropertyPlantAndEquipment);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetFixedAssets);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsPropertyPlantEquipmentSubtotalInput.closest('.Property-Plant-Equipment-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsPropertyPlantEquipmentSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsPropertyPlantEquipmentSubtotalInput.setAttribute('data-manual-entry', 'false');
                        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
                        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetPropertyPlantAndEquipment);
                        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetFixedAssets);
                    });
                }
            });
        }
    }

    // For bs-property-plant-and-equipment-generic
    const bsPropertyPlantEquipmentGenericInput = container.querySelector(`input[var="bs-property-plant-and-equipment-generic"][period="${period}"]`);
    if (bsPropertyPlantEquipmentGenericInput) {
        console.log(`Found bs-property-plant-and-equipment-generic input for period ${period}`);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetPropertyPlantAndEquipment);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetFixedAssets);
    }

    // For bs-machinery-and-equipment
    const bsMachineryAndEquipmentInput = container.querySelector(`input[var="bs-machinery-and-equipment"][period="${period}"]`);
    if (bsMachineryAndEquipmentInput) {
        console.log(`Found bs-machinery-and-equipment input for period ${period}`);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetPropertyPlantAndEquipment);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetFixedAssets);
    }

    // For bs-titled-vehicles
    const bsTitledVehiclesInput = container.querySelector(`input[var="bs-titled-vehicles"][period="${period}"]`);
    if (bsTitledVehiclesInput) {
        console.log(`Found bs-titled-vehicles input for period ${period}`);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetPropertyPlantAndEquipment);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetFixedAssets);
    }

    // For bs-computer-and-office-equipment
    const bsComputerAndOfficeEquipmentInput = container.querySelector(`input[var="bs-computer-and-office-equipment"][period="${period}"]`);
    if (bsComputerAndOfficeEquipmentInput) {
        console.log(`Found bs-computer-and-office-equipment input for period ${period}`);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetPropertyPlantAndEquipment);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetFixedAssets);
    }

    // For bs-leasehold-improvements
    const bsLeaseholdImprovementsInput = container.querySelector(`input[var="bs-leasehold-improvements"][period="${period}"]`);
    if (bsLeaseholdImprovementsInput) {
        console.log(`Found bs-leasehold-improvements input for period ${period}`);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetPropertyPlantAndEquipment);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetFixedAssets);
    }

    // For bs-buildings
    const bsBuildingsInput = container.querySelector(`input[var="bs-buildings"][period="${period}"]`);
    if (bsBuildingsInput) {
        console.log(`Found bs-buildings input for period ${period}`);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetPropertyPlantAndEquipment);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetFixedAssets);
    }

    // For bs-construction-in-progress
    const bsConstructionInProgressInput = container.querySelector(`input[var="bs-construction-in-progress"][period="${period}"]`);
    if (bsConstructionInProgressInput) {
        console.log(`Found bs-construction-in-progress input for period ${period}`);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetPropertyPlantAndEquipment);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetFixedAssets);
    }

    // For bs-property-plant-and-equipment-custom
    const bsPropertyPlantEquipmentCustomInput = container.querySelector(`input[var="bs-property-plant-and-equipment-custom"][period="${period}"]`);
    if (bsPropertyPlantEquipmentCustomInput) {
        console.log(`Found bs-property-plant-and-equipment-custom input for period ${period}`);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetPropertyPlantAndEquipment);
        bsPropertyPlantEquipmentCustomInput.addEventListener('change', updateNetFixedAssets);
    }

    // For bs-accumulated-depreciation
    const bsAccumulatedDepreciationInput = container.querySelector(`input[var="bs-accumulated-depreciation"][period="${period}"]`);
    if (bsAccumulatedDepreciationInput) {
        console.log(`Found bs-accumulated-depreciation input for period ${period}`);
        bsAccumulatedDepreciationInput.addEventListener('change', updateNetFixedAssets);
    }

    // For bs-land
    const bsLandInput = container.querySelector(`input[var="bs-land"][period="${period}"]`);
    if (bsLandInput) {
        console.log(`Found bs-land input for period ${period}`);
        bsLandInput.addEventListener('change', updateNetFixedAssets);
    }

    // For bs-intangible-assets-subtotal
    const bsIntangibleAssetsSubtotalInput = container.querySelector(`input[var="bs-intangible-assets-subtotal"][period="${period}"]`);
    if (bsIntangibleAssetsSubtotalInput) {
        // When the subtotal field is manually edited
        bsIntangibleAssetsSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsIntangibleAssetsSubtotalInput.addEventListener('change', updateIntangibleAssetsSubtotal);
        bsIntangibleAssetsSubtotalInput.addEventListener('change', updateNetIntangibleAssets);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsIntangibleAssetsSubtotalInput.closest('.Balance-Sheet-Intangible-Assets-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsIntangibleAssetsSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsIntangibleAssetsSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateIntangibleAssetsSubtotal.call(input);
                    });
                }
            });
        }
    }


    ///BALANCE SHEET INTANGIBLE ASSETS//
    // For bs-intangible-assets-generic
    const bsIntangibleAssetsGenericInput = container.querySelector(`input[var="bs-intangible-assets-generic"][period="${period}"]`);
    if (bsIntangibleAssetsGenericInput) {
        bsIntangibleAssetsGenericInput.addEventListener('change', updateIntangibleAssetsSubtotal);
        bsIntangibleAssetsGenericInput.addEventListener('change', updateNetIntangibleAssets);
    }

    // For bs-intangible-assets-trademarks-and-licenses
    const bsIntangibleAssetsTrademarksAndLicensesInput = container.querySelector(`input[var="bs-intangible-assets-trademarks-and-licenses"][period="${period}"]`);
    if (bsIntangibleAssetsTrademarksAndLicensesInput) {
        bsIntangibleAssetsTrademarksAndLicensesInput.addEventListener('change', updateIntangibleAssetsSubtotal);
        bsIntangibleAssetsTrademarksAndLicensesInput.addEventListener('change', updateNetIntangibleAssets);
    }

    // For bs-intangible-assets-financing-costs
    const bsIntangibleAssetsFinancingCostsInput = container.querySelector(`input[var="bs-intangible-assets-financing-costs"][period="${period}"]`);
    if (bsIntangibleAssetsFinancingCostsInput) {
        bsIntangibleAssetsFinancingCostsInput.addEventListener('change', updateIntangibleAssetsSubtotal);
        bsIntangibleAssetsFinancingCostsInput.addEventListener('change', updateNetIntangibleAssets);
    }

    // For bs-inangible-assets-custom
    container.querySelectorAll(`input[var="bs-inangible-assets-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateIntangibleAssetsSubtotal);
            input.addEventListener('change', updateNetIntangibleAssets);
        });
    
    ///BALANCE SHEET DUE FROM RELATED PARTIES///
    
    // For bs-due-from-related-parties-subtotal
    const bsDueFromRelatedPartiesSubtotalInput = container.querySelector(`input[var="bs-due-from-related-parties-subtotal"][period="${period}"]`);
    if (bsDueFromRelatedPartiesSubtotalInput) {
        // When the subtotal field is manually edited
        bsDueFromRelatedPartiesSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsDueFromRelatedPartiesSubtotalInput.addEventListener('change', updateDueFromRelatedPartiesSubtotal);
        bsDueFromRelatedPartiesSubtotalInput.addEventListener('change', updateTotalOtherLongTermAssets);
        bsDueFromRelatedPartiesSubtotalInput.addEventListener('change', updateTotalLongTermAssets);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsDueFromRelatedPartiesSubtotalInput.closest('.Balance-Sheet-Due-From-Related-Parties-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsDueFromRelatedPartiesSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsDueFromRelatedPartiesSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateDueFromRelatedPartiesSubtotal.call(input);
                        
                    });
                }
            });
        }
    }

    // For bs-due-from-related-parties-generic
    const bsDueFromRelatedPartiesGenericInput = container.querySelector(`input[var="bs-due-from-related-parties-generic"][period="${period}"]`);
    if (bsDueFromRelatedPartiesGenericInput) {
        bsDueFromRelatedPartiesGenericInput.addEventListener('change', updateDueFromRelatedPartiesSubtotal);
    }

    // For bs-due-from-related-parties-custom
    container.querySelectorAll(`input[var="bs-due-from-related-parties-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateDueFromRelatedPartiesSubtotal);
        });

    ///BALANCE SHEET DUE FROM SHAREHOLDERS///

    // For bs-due-from-shareholders-subtotal
    const bsDueFromShareholdersSubtotalInput = container.querySelector(`input[var="bs-due-from-shareholders-subtotal"][period="${period}"]`);
    if (bsDueFromShareholdersSubtotalInput) {
        // When the subtotal field is manually edited
        bsDueFromShareholdersSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsDueFromShareholdersSubtotalInput.addEventListener('change', updateDueFromShareholdersSubtotal);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsDueFromShareholdersSubtotalInput.closest('.Balance-Sheet-Due-From-Shareholders-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsDueFromShareholdersSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsDueFromShareholdersSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateDueFromShareholdersSubtotal.call(input);
                        updateTotalOtherLongTermAssets.call(input);
                        updateTotalLongTermAssets.call(input);
                        updateTotalAssets.call(input);
                    });
                }
            });
        }
    }

    // For bs-due-from-shareholders-generic
    const bsDueFromShareholdersGenericInput = container.querySelector(`input[var="bs-due-from-shareholders-generic"][period="${period}"]`);
    if (bsDueFromShareholdersGenericInput) {
        bsDueFromShareholdersGenericInput.addEventListener('change', updateDueFromShareholdersSubtotal);
    }

    // For bs-due-from-shareholders-custom
    container.querySelectorAll(`input[var="bs-due-from-shareholders-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateDueFromShareholdersSubtotal);
        });

    ///BALANCE SHEET OTHER LONG TERM ASSETS///
    // For bs-other-long-term-assets-subtotal
    const bsOtherLongTermAssetsSubtotalInput = container.querySelector(`input[var="bs-other-long-term-assets-subtotal"][period="${period}"]`);
    if (bsOtherLongTermAssetsSubtotalInput) {
        // When the subtotal field is manually edited
        bsOtherLongTermAssetsSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsOtherLongTermAssetsSubtotalInput.addEventListener('change', updateOtherLongTermAssetsSubtotal);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsOtherLongTermAssetsSubtotalInput.closest('.Balance-Sheet-Other-Long-Term-Assets-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsOtherLongTermAssetsSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsOtherLongTermAssetsSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateOtherLongTermAssetsSubtotal.call(input);
                        updateTotalOtherLongTermAssets.call(input);
                        updateTotalLongTermAssets.call(input);
                        updateTotalAssets.call(input);
                    });
                }
            });
        }
    }

    // For bs-other-long-term-assets-generic
    const bsOtherLongTermAssetsGenericInput = container.querySelector(`input[var="bs-other-long-term-assets-generic"][period="${period}"]`);
    if (bsOtherLongTermAssetsGenericInput) {
        bsOtherLongTermAssetsGenericInput.addEventListener('change', updateOtherLongTermAssetsSubtotal);
    }

    // For bs-other-long-term-assets-custom
    container.querySelectorAll(`input[var="bs-other-long-term-assets-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateOtherLongTermAssetsSubtotal);
        });

    ///BALANCE SHEET ACCOUNTS PAYABLE///
    // For bs-accounts-payable-subtotal
    const bsAccountsPayableSubtotalInput = container.querySelector(`input[var="bs-accounts-payable-subtotal"][period="${period}"]`);
    if (bsAccountsPayableSubtotalInput) {
        // When the subtotal field is manually edited
        bsAccountsPayableSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsAccountsPayableSubtotalInput.addEventListener('change', updateAccountsPayableSubtotal);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsAccountsPayableSubtotalInput.closest('.Balance-Sheet-Accounts-Payable-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsAccountsPayableSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsAccountsPayableSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateAccountsPayableSubtotal.call(input);
                        // Add any other update functions you need here
                    });
                }
            });
        }
    }

    // For bs-accounts-payable-trade
    const bsAccountsPayableTradeInput = container.querySelector(`input[var="bs-accounts-payable-trade"][period="${period}"]`);
    if (bsAccountsPayableTradeInput) {
        bsAccountsPayableTradeInput.addEventListener('change', updateAccountsPayableSubtotal);
    }

    // For bs-accounts-payable-other
    const bsAccountsPayableOtherInput = container.querySelector(`input[var="bs-accounts-payable-other"][period="${period}"]`);
    if (bsAccountsPayableOtherInput) {
        bsAccountsPayableOtherInput.addEventListener('change', updateAccountsPayableSubtotal);
    }

    // For bs-accounts-payable-custom
    container.querySelectorAll(`input[var="bs-accounts-payable-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateAccountsPayableSubtotal);
        });
    
    ///BALANCE SHEET CURRENT PORTION OF LONG-TERM LIABILITIES///
    // For bs-current-portion-of-long-term-liabilities-subtotal
    const bsCurrentPortionOfLongTermLiabilitiesSubtotalInput = container.querySelector(`input[var="bs-current-portion-of-long-term-liabilities-subtotal"][period="${period}"]`);
    if (bsCurrentPortionOfLongTermLiabilitiesSubtotalInput) {
        // When the subtotal field is manually edited
        bsCurrentPortionOfLongTermLiabilitiesSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsCurrentPortionOfLongTermLiabilitiesSubtotalInput.addEventListener('change', updateCurrentPortionOfLongTermLiabilitiesSubtotal);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsCurrentPortionOfLongTermLiabilitiesSubtotalInput.closest('.Balance-Sheet-Current-Portion-Of-Long-Term-Liabilities-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsCurrentPortionOfLongTermLiabilitiesSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsCurrentPortionOfLongTermLiabilitiesSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateCurrentPortionOfLongTermLiabilitiesSubtotal.call(input);
                        updateTotalCurrentLiabilities.call(input);
                        updateTotalLiabilities.call(input);
                    });
                }
            });
        }
    }

    // For bs-current-portion-of-long-term-debt
    const bsCurrentPortionOfLongTermDebtInput = container.querySelector(`input[var="bs-current-portion-of-long-term-debt"][period="${period}"]`);
    if (bsCurrentPortionOfLongTermDebtInput) {
        bsCurrentPortionOfLongTermDebtInput.addEventListener('change', updateCurrentPortionOfLongTermLiabilitiesSubtotal);
        bsCurrentPortionOfLongTermDebtInput.addEventListener('change', updateTotalCurrentLiabilities);
        bsCurrentPortionOfLongTermDebtInput.addEventListener('change', updateTotalLiabilities);
    }

    // For bs-current-portion-of-long-term-capital-leases
    const bsCurrentPortionOfLongTermCapitalLeasesInput = container.querySelector(`input[var="bs-current-portion-of-long-term-capital-leases"][period="${period}"]`);
    if (bsCurrentPortionOfLongTermCapitalLeasesInput) {
        bsCurrentPortionOfLongTermCapitalLeasesInput.addEventListener('change', updateCurrentPortionOfLongTermLiabilitiesSubtotal);
        bsCurrentPortionOfLongTermCapitalLeasesInput.addEventListener('change', updateTotalCurrentLiabilities);
        bsCurrentPortionOfLongTermCapitalLeasesInput.addEventListener('change', updateTotalLiabilities);
    }

    // For bs-current-portion-of-long-term-liabilities-custom
    container.querySelectorAll(`input[var="bs-current-portion-of-long-term-liabilities-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateCurrentPortionOfLongTermLiabilitiesSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
        });

    ///BALANCE SHEET REVOLVING LINES OF CREDIT///
    // For bs-revolving-lines-of-credit-subtotal
    const bsRevolvingLinesOfCreditSubtotalInput = container.querySelector(`input[var="bs-revolving-lines-of-credit-subtotal"][period="${period}"]`);
    if (bsRevolvingLinesOfCreditSubtotalInput) {
        // When the subtotal field is manually edited
        bsRevolvingLinesOfCreditSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsRevolvingLinesOfCreditSubtotalInput.addEventListener('change', updateRevolvingLinesOfCreditSubtotal);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsRevolvingLinesOfCreditSubtotalInput.closest('.Balance-Sheet-Revolving-Lines-Of-Credit-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsRevolvingLinesOfCreditSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsRevolvingLinesOfCreditSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateRevolvingLinesOfCreditSubtotal.call(input);
                        // Add any other update functions you need here
                    });
                }
            });
        }
    }

    // For bs-revolving-lines-of-credit-generic
    const bsRevolvingLinesOfCreditGenericInput = container.querySelector(`input[var="bs-revolving-lines-of-credit-generic"][period="${period}"]`);
    if (bsRevolvingLinesOfCreditGenericInput) {
        bsRevolvingLinesOfCreditGenericInput.addEventListener('change', updateRevolvingLinesOfCreditSubtotal);
    }

    // For bs-promissory-note-lines-of-credit
    const bsPromissoryNoteLinesOfCreditInput = container.querySelector(`input[var="bs-promissory-note-lines-of-credit"][period="${period}"]`);
    if (bsPromissoryNoteLinesOfCreditInput) {
        bsPromissoryNoteLinesOfCreditInput.addEventListener('change', updateRevolvingLinesOfCreditSubtotal);
    }

    // For bs-credit-cards
    const bsCreditCardsInput = container.querySelector(`input[var="bs-credit-cards"][period="${period}"]`);
    if (bsCreditCardsInput) {
        bsCreditCardsInput.addEventListener('change', updateRevolvingLinesOfCreditSubtotal);
    }

    // For bs-revolving-lines-of-credit-custom
    container.querySelectorAll(`input[var="bs-revolving-lines-of-credit-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateRevolvingLinesOfCreditSubtotal);
        });
    
    ///BALANCE SHEET ACCRUAL LIABILITIES///
    // For bs-accrual-liabilities-subtotal
    const bsAccrualLiabilitiesSubtotalInput = container.querySelector(`input[var="bs-accrual-liabilities-subtotal"][period="${period}"]`);
    if (bsAccrualLiabilitiesSubtotalInput) {
        // When the subtotal field is manually edited
        bsAccrualLiabilitiesSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsAccrualLiabilitiesSubtotalInput.addEventListener('change', updateAccrualLiabilitiesSubtotal);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsAccrualLiabilitiesSubtotalInput.closest('.Balance-Sheet-Accrual-Liabilities-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsAccrualLiabilitiesSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsAccrualLiabilitiesSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateAccrualLiabilitiesSubtotal.call(input);
                        // Add any other update functions you need here
                    });
                }
            });
        }
    }

    // For bs-accrual-liabilities-generic
    const bsAccrualLiabilitiesGenericInput = container.querySelector(`input[var="bs-accrual-liabilities-generic"][period="${period}"]`);
    if (bsAccrualLiabilitiesGenericInput) {
        bsAccrualLiabilitiesGenericInput.addEventListener('change', updateAccrualLiabilitiesSubtotal);
    }

    // For bs-accrual-liabilities-customer-advances
    const bsAccrualLiabilitiesCustomerAdvancesInput = container.querySelector(`input[var="bs-accrual-liabilities-customer-advances"][period="${period}"]`);
    if (bsAccrualLiabilitiesCustomerAdvancesInput) {
        bsAccrualLiabilitiesCustomerAdvancesInput.addEventListener('change', updateAccrualLiabilitiesSubtotal);
    }

    // For bs-accrual-liabilities-custom
    container.querySelectorAll(`input[var="bs-accrual-liabilities-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateAccrualLiabilitiesSubtotal);
        });

    ///BALANCE SHEET OTHER CURRENT LIABILITIES///
    // For bs-other-current-liabilities-subtotal
    const bsOtherCurrentLiabilitiesSubtotalInput = container.querySelector(`input[var="bs-other-current-liabilities-subtotal"][period="${period}"]`);
    if (bsOtherCurrentLiabilitiesSubtotalInput) {
        // When the subtotal field is manually edited
        bsOtherCurrentLiabilitiesSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsOtherCurrentLiabilitiesSubtotalInput.addEventListener('change', updateOtherCurrentLiabilitiesSubtotal);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsOtherCurrentLiabilitiesSubtotalInput.closest('.Balance-Sheet-Other-Current-Liabilities-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsOtherCurrentLiabilitiesSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsOtherCurrentLiabilitiesSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateOtherCurrentLiabilitiesSubtotal.call(input);
                        // Add any other update functions you need here
                    });
                }
            });
        }
    }

    // For bs-other-current-liabilities-generic
    const bsOtherCurrentLiabilitiesGenericInput = container.querySelector(`input[var="bs-other-current-liabilities-generic"][period="${period}"]`);
    if (bsOtherCurrentLiabilitiesGenericInput) {
        bsOtherCurrentLiabilitiesGenericInput.addEventListener('change', updateOtherCurrentLiabilitiesSubtotal);
    }

    // For bs-tax-liabilities
    const bsTaxLiabilitiesInput = container.querySelector(`input[var="bs-tax-liabilities"][period="${period}"]`);
    if (bsTaxLiabilitiesInput) {
        bsTaxLiabilitiesInput.addEventListener('change', updateOtherCurrentLiabilitiesSubtotal);
    }

    // For bs-payroll-liabilities
    const bsPayrollLiabilitiesInput = container.querySelector(`input[var="bs-payroll-liabilities"][period="${period}"]`);
    if (bsPayrollLiabilitiesInput) {
        bsPayrollLiabilitiesInput.addEventListener('change', updateOtherCurrentLiabilitiesSubtotal);
    }

    // For bs-other-current-liabilities-custom
    container.querySelectorAll(`input[var="bs-other-current-liabilities-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateOtherCurrentLiabilitiesSubtotal);
        });

    ///BALANCE SHEET LONG-TERM DEBT TO BE REFINANCED///
    // For bs-long-term-debt-to-be-refinanced-subtotal
    const bsLongTermDebtToBeRefinancedSubtotalInput = container.querySelector(`input[var="bs-long-term-debt-to-be-refinanced-subtotal"][period="${period}"]`);
    if (bsLongTermDebtToBeRefinancedSubtotalInput) {
        // When the subtotal field is manually edited
        bsLongTermDebtToBeRefinancedSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsLongTermDebtToBeRefinancedSubtotalInput.addEventListener('change', updateLongTermDebtToBeRefinancedSubtotal);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsLongTermDebtToBeRefinancedSubtotalInput.closest('.Balance-Sheet-Long-Term-Debt-To-Be-Refinanced-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsLongTermDebtToBeRefinancedSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsLongTermDebtToBeRefinancedSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateLongTermDebtToBeRefinancedSubtotal.call(input);
                        updateTotalLongTermLiabilities.call(input);
                        updateTotalLiabilities.call(input);
                    });
                }
            });
        }
    }

    // For bs-long-term-debt-to-be-refinanced-generic
    const bsLongTermDebtToBeRefinancedGenericInput = container.querySelector(`input[var="bs-long-term-debt-to-be-refinanced-generic"][period="${period}"]`);
    if (bsLongTermDebtToBeRefinancedGenericInput) {
        bsLongTermDebtToBeRefinancedGenericInput.addEventListener('change', updateLongTermDebtToBeRefinancedSubtotal);
        bsLongTermDebtToBeRefinancedGenericInput.addEventListener('change', updateTotalLongTermLiabilities);
        bsLongTermDebtToBeRefinancedGenericInput.addEventListener('change', updateTotalLiabilities);
    }

    // For bs-long-term-debt-to-be-refinanced-custom
    container.querySelectorAll(`input[var="bs-long-term-debt-to-be-refinanced-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateLongTermDebtToBeRefinancedSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
        });

    ///BALANCE SHEET OTHER LONG-TERM NOTES PAYABLE///
    // For bs-other-long-term-notes-payable-subtotal
    const bsOtherLongTermNotesPayableSubtotalInput = container.querySelector(`input[var="bs-other-long-term-notes-payable-subtotal"][period="${period}"]`);
    if (bsOtherLongTermNotesPayableSubtotalInput) {
        // When the subtotal field is manually edited
        bsOtherLongTermNotesPayableSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsOtherLongTermNotesPayableSubtotalInput.addEventListener('change', updateOtherLongTermNotesPayableSubtotal);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsOtherLongTermNotesPayableSubtotalInput.closest('.Balance-Sheet-Other-Long-Term-Notes-Payable-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsOtherLongTermNotesPayableSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsOtherLongTermNotesPayableSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateOtherLongTermNotesPayableSubtotal.call(input);
                        updateTotalLongTermLiabilities.call(input);
                        updateTotalLiabilities.call(input);
                    });
                }
            });
        }
    }

    // For bs-other-long-term-notes-payable-subtotal-generic
    const bsOtherLongTermNotesPayableSubtotalGenericInput = container.querySelector(`input[var="bs-other-long-term-notes-payable-subtotal-generic"][period="${period}"]`);
    if (bsOtherLongTermNotesPayableSubtotalGenericInput) {
        bsOtherLongTermNotesPayableSubtotalGenericInput.addEventListener('change', updateOtherLongTermNotesPayableSubtotal);
        bsOtherLongTermNotesPayableSubtotalGenericInput.addEventListener('change', updateTotalLongTermLiabilities);
        bsOtherLongTermNotesPayableSubtotalGenericInput.addEventListener('change', updateTotalLiabilities);
    }

    // For bs-other-long-term-notes-payable-custom
    container.querySelectorAll(`input[var="bs-other-long-term-notes-payable-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateOtherLongTermNotesPayableSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
        });

    ///BALANCE SHEET DUE TO REALTED PARTIES///
    // For bs-due-to-related--parties-subtotal
    const bsDueToRelatedPartiesSubtotalInput = container.querySelector(`input[var="bs-due-to-related--parties-subtotal"][period="${period}"]`);
    if (bsDueToRelatedPartiesSubtotalInput) {
        // When the subtotal field is manually edited
        bsDueToRelatedPartiesSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsDueToRelatedPartiesSubtotalInput.addEventListener('change', updateDueToRelatedPartiesSubtotal);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsDueToRelatedPartiesSubtotalInput.closest('.Balance-Sheet-Due-To-Related-Parties-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsDueToRelatedPartiesSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsDueToRelatedPartiesSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateDueToRelatedPartiesSubtotal.call(input);
                        updateTotalLongTermLiabilities.call(input);
                        updateTotalLiabilities.call(input);
                    });
                }
            });
        }
    }

    // For bs-due-to-related--parties-generic
    const bsDueToRelatedPartiesGenericInput = container.querySelector(`input[var="bs-due-to-related--parties-generic"][period="${period}"]`);
    if (bsDueToRelatedPartiesGenericInput) {
        bsDueToRelatedPartiesGenericInput.addEventListener('change', updateDueToRelatedPartiesSubtotal);
        bsDueToRelatedPartiesGenericInput.addEventListener('change', updateTotalLongTermLiabilities);
        bsDueToRelatedPartiesGenericInput.addEventListener('change', updateTotalLiabilities);
    }

    // For bs-due-to-related-parties-custom
    container.querySelectorAll(`input[var="bs-due-to-related-parties-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateDueToRelatedPartiesSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
        });

    ///BALANCE SHEET DUE TO SHAREHOLDERS///
    // For bs-due-to-shareholders-subtotal
    const bsDueToShareholdersSubtotalInput = container.querySelector(`input[var="bs-due-to-shareholders-subtotal"][period="${period}"]`);
    if (bsDueToShareholdersSubtotalInput) {
        // When the subtotal field is manually edited
        bsDueToShareholdersSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsDueToShareholdersSubtotalInput.addEventListener('change', updateDueToShareholdersSubtotal);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsDueToShareholdersSubtotalInput.closest('.Balance-Sheet-Due-To-Shareholders-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsDueToShareholdersSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsDueToShareholdersSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateDueToShareholdersSubtotal.call(input);
                        updateTotalCurrentLiabilities.call(input);
                        updateTotalLiabilities.call(input);
                    });
                }
            });
        }
    }

    // For bs-due-to-shareholders-generic
    const bsDueToShareholdersGenericInput = container.querySelector(`input[var="bs-due-to-shareholders-generic"][period="${period}"]`);
    if (bsDueToShareholdersGenericInput) {
        bsDueToShareholdersGenericInput.addEventListener('change', updateDueToShareholdersSubtotal);
        bsDueToShareholdersGenericInput.addEventListener('change', updateTotalCurrentLiabilities);
        bsDueToShareholdersGenericInput.addEventListener('change', updateTotalLiabilities);
    }

    // For bs-due-to-shareholders-custom
    container.querySelectorAll(`input[var="bs-due-to-shareholders-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateDueToShareholdersSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
        });

    ///BALANCE SHEET OTHER LONG-TERM LIABILITIES///
    // For bs-other-long-term-liabilities-subtotal
    const bsOtherLongTermLiabilitiesSubtotalInput = container.querySelector(`input[var="bs-other-long-term-liabilities-subtotal"][period="${period}"]`);
    if (bsOtherLongTermLiabilitiesSubtotalInput) {
        // When the subtotal field is manually edited
        bsOtherLongTermLiabilitiesSubtotalInput.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Attaching listeners for automatic calculation
        bsOtherLongTermLiabilitiesSubtotalInput.addEventListener('change', updateOtherLongTermLiabilitiesSubtotal);

        // Resetting 'data-manual-entry' when any child field is modified
        const group = bsOtherLongTermLiabilitiesSubtotalInput.closest('.Balance-Sheet-Other-Long-Term-Liabilities-Input-Group');
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== bsOtherLongTermLiabilitiesSubtotalInput) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        bsOtherLongTermLiabilitiesSubtotalInput.setAttribute('data-manual-entry', 'false');
                        updateOtherLongTermLiabilitiesSubtotal.call(input);
                        updateTotalOtherLongTermLiabilities.call(input);
                        updateTotalLiabilities.call(input);
                    });
                }
            });
        }
    }

    // For bs-other-long-term-liabilities-generic
    const bsOtherLongTermLiabilitiesGenericInput = container.querySelector(`input[var="bs-other-long-term-liabilities-generic"][period="${period}"]`);
    if (bsOtherLongTermLiabilitiesGenericInput) {
        bsOtherLongTermLiabilitiesGenericInput.addEventListener('change', updateOtherLongTermLiabilitiesSubtotal);
        bsOtherLongTermLiabilitiesGenericInput.addEventListener('change', updateTotalLongTermLiabilities);
        bsOtherLongTermLiabilitiesGenericInput.addEventListener('change', updateTotalLiabilities);
    }

    // For bs-other-long-term-liabilities-custom
    container.querySelectorAll(`input[var="bs-other-long-term-liabilities-custom"][period="${period}"]`)
        .forEach(input => {
            input.addEventListener('change', updateOtherLongTermLiabilitiesSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
        });


    // For bs-paid-in-capital-subtotal
    const bsPaidInCapitalSubtotalInput = container.querySelector(`input[var="bs-paid-in-capital-subtotal"][period="${period}"]`);
    if (bsPaidInCapitalSubtotalInput) {
        console.log(`Found bs-paid-in-capital-subtotal input for period ${period}`);
        bsPaidInCapitalSubtotalInput.addEventListener('change', updateTotalEquity);
        bsPaidInCapitalSubtotalInput.addEventListener('change', updateTotalLiabilitiesAndEquity);
        bsPaidInCapitalSubtotalInput.addEventListener('change', updateTotalUnbalancedAmount);
    }

    // For bs-paid-in-capital-generic
    const bsPaidInCapitalGenericInput = container.querySelector(`input[var="bs-paid-in-capital-generic"][period="${period}"]`);
    if (bsPaidInCapitalGenericInput) {
        console.log(`Found bs-paid-in-capital-generic input for period ${period}`);
        bsPaidInCapitalGenericInput.addEventListener('change', updatePaidInCapitalSubtotal);
        bsPaidInCapitalGenericInput.addEventListener('change', updateTotalEquity);
        bsPaidInCapitalGenericInput.addEventListener('change', updateTotalLiabilitiesAndEquity);
        bsPaidInCapitalGenericInput.addEventListener('change', updateTotalUnbalancedAmount);
    }

    // For bs-paid-in-capital-custom
    container.querySelectorAll(`input[var="bs-paid-in-capital-custom"][period="${period}"]`)
        .forEach(input => {
            console.log(`Found bs-paid-in-capital-custom input for period ${period}`);
            input.addEventListener('change', updatePaidInCapitalSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        });

    // For bs-retained-earnings-subtotal
    const bsRetainedEarningsSubtotalInput = container.querySelector(`input[var="bs-retained-earnings-subtotal"][period="${period}"]`);
    if (bsRetainedEarningsSubtotalInput) {
        console.log(`Found bs-retained-earnings-subtotal input for period ${period}`);
        bsRetainedEarningsSubtotalInput.addEventListener('change', updateTotalEquity);
        bsRetainedEarningsSubtotalInput.addEventListener('change', updateTotalLiabilitiesAndEquity);
        bsRetainedEarningsSubtotalInput.addEventListener('change', updateTotalUnbalancedAmount);
    }

    // For bs-prior-year-end-retained-earnings
    const bsPriorYearEndRetainedEarningsInput = container.querySelector(`input[var="bs-prior-year-end-retained-earnings"][period="${period}"]`);
    if (bsPriorYearEndRetainedEarningsInput) {
        console.log(`Found bs-prior-year-end-retained-earnings input for period ${period}`);
        bsPriorYearEndRetainedEarningsInput.addEventListener('change', updateRetainedEarningsSubtotal);
        bsPriorYearEndRetainedEarningsInput.addEventListener('change', updateTotalEquity);
        bsPriorYearEndRetainedEarningsInput.addEventListener('change', updateTotalLiabilitiesAndEquity);
        bsPriorYearEndRetainedEarningsInput.addEventListener('change', updateTotalUnbalancedAmount);
    }

    // For bs-current-period-net-profit-after-taxes
    const bsCurrentPeriodNetProfitInput = container.querySelector(`input[var="bs-current-period-net-profit-after-taxes"][period="${period}"]`);
    if (bsCurrentPeriodNetProfitInput) {
        console.log(`Found bs-current-period-net-profit-after-taxes input for period ${period}`);
        bsCurrentPeriodNetProfitInput.addEventListener('change', updateRetainedEarningsSubtotal);
        bsCurrentPeriodNetProfitInput.addEventListener('change', updateTotalEquity);
        bsCurrentPeriodNetProfitInput.addEventListener('change', updateTotalLiabilitiesAndEquity);
        bsCurrentPeriodNetProfitInput.addEventListener('change', updateTotalUnbalancedAmount);
    }

    // For bs-current-period-distributions
    const bsCurrentPeriodDistributionsInput = container.querySelector(`input[var="bs-current-period-distributions"][period="${period}"]`);
    if (bsCurrentPeriodDistributionsInput) {
        console.log(`Found bs-current-period-distributions input for period ${period}`);
        bsCurrentPeriodDistributionsInput.addEventListener('change', updateRetainedEarningsSubtotal);
        bsCurrentPeriodDistributionsInput.addEventListener('change', updateTotalEquity);
        bsCurrentPeriodDistributionsInput.addEventListener('change', updateTotalLiabilitiesAndEquity);
        bsCurrentPeriodDistributionsInput.addEventListener('change', updateTotalUnbalancedAmount);
    }

    // For bs-current-period-contributions
    const bsCurrentPeriodContributionsInput = container.querySelector(`input[var="bs-current-period-contributions"][period="${period}"]`);
    if (bsCurrentPeriodContributionsInput) {
        console.log(`Found bs-current-period-contributions input for period ${period}`);
        bsCurrentPeriodContributionsInput.addEventListener('change', updateRetainedEarningsSubtotal);
        bsCurrentPeriodContributionsInput.addEventListener('change', updateTotalEquity);
        bsCurrentPeriodContributionsInput.addEventListener('change', updateTotalLiabilitiesAndEquity);
        bsCurrentPeriodContributionsInput.addEventListener('change', updateTotalUnbalancedAmount);
    }

    // For bs-retained-earnings-custom
    container.querySelectorAll(`input[var="bs-retained-earnings-custom"][period="${period}"]`)
        .forEach(input => {
            console.log(`Found bs-retained-earnings-custom input for period ${period}`);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        });

    // For bs-other-adjustments-to-equity-subtotal
    const bsOtherAdjustmentsToEquitySubtotalInput = container.querySelector(`input[var="bs-other-adjustments-to-equity-subtotal"][period="${period}"]`);
    if (bsOtherAdjustmentsToEquitySubtotalInput) {
        console.log(`Found bs-other-adjustments-to-equity-subtotal input for period ${period}`);
        bsOtherAdjustmentsToEquitySubtotalInput.addEventListener('change', updateTotalEquity);
        bsOtherAdjustmentsToEquitySubtotalInput.addEventListener('change', updateTotalLiabilitiesAndEquity);
        bsOtherAdjustmentsToEquitySubtotalInput.addEventListener('change', updateTotalUnbalancedAmount);
    }

    // For bs-other-adjustments-to-equity-generic
    const bsOtherAdjustmentsToEquityGenericInput = container.querySelector(`input[var="bs-other-adjustments-to-equity-generic"][period="${period}"]`);
    if (bsOtherAdjustmentsToEquityGenericInput) {
        console.log(`Found bs-other-adjustments-to-equity-generic input for period ${period}`);
        bsOtherAdjustmentsToEquityGenericInput.addEventListener('change', updateOtherAdjustmentsToEquitySubtotal);
        bsOtherAdjustmentsToEquityGenericInput.addEventListener('change', updateTotalEquity);
        bsOtherAdjustmentsToEquityGenericInput.addEventListener('change', updateTotalLiabilitiesAndEquity);
        bsOtherAdjustmentsToEquityGenericInput.addEventListener('change', updateTotalUnbalancedAmount);
    }

    // For bs-other-adjustments-to-equity-custom
    container.querySelectorAll(`input[var="bs-other-adjustments-to-equity-custom"][period="${period}"]`)
        .forEach(input => {
            console.log(`Found bs-other-adjustments-to-equity-custom input for period ${period}`);
            input.addEventListener('change', updateOtherAdjustmentsToEquitySubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        });

    ///END LINE SEPERATOR FOR BALANCE SHEET///  
}

function attachEventListeners() {
    // Call the function to setup subtotal field listeners
    setupSubtotalFieldListeners();
    
    // Attaching event listeners to 'Add Period' buttons
    document.querySelectorAll('.add-period').forEach(button => {
        button.removeEventListener('click', addPeriodHandler);
        button.addEventListener('click', addPeriodHandler);
    });

    // Attaching event listeners to 'Delete Period' buttons
    document.querySelectorAll('.delete-period').forEach(button => {
        button.removeEventListener('click', deletePeriodHandler);
        button.addEventListener('click', deletePeriodHandler);
    });

    // Attaching event listeners to input fields within each period
    document.querySelectorAll('.container input[input-type="variable"], .container input[input-type="standard"], .container input[input-type="contra"]').forEach(input => {
        input.removeEventListener('focus', inputFocusHandler);
        input.addEventListener('focus', inputFocusHandler);

        input.removeEventListener('blur', inputBlurHandler);
        input.addEventListener('blur', inputBlurHandler);

        // Get the period attribute directly from the input field
        const period = input.getAttribute('period');
        console.log(`Checking for period ${period}`);

        // For cost-of-goods-sold-generic
        if (input.getAttribute('var') === 'cost-of-goods-sold-generic') {
            console.log(`Found cost-of-goods-sold-generic input for period ${period}`);
            input.addEventListener('change', updateGrossProfit);
            input.addEventListener('change', updateCostOfGoodsSoldSubtotal);
            input.addEventListener('change', updateNetOperatingIncome);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For cost-of-goods-sold-depreciation
        if (input.getAttribute('var') === 'cost-of-goods-sold-depreciation') {
            console.log(`Found cost-of-goods-sold-depreciation input for period ${period}`);
            input.addEventListener('change', updateGrossProfit);
            input.addEventListener('change', updateCostOfGoodsSoldSubtotal);
            input.addEventListener('change', updateNetOperatingIncome);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For cost-of-goods-sold-custom
        if (input.getAttribute('var') === 'cost-of-goods-sold-custom') {
            console.log(`Found cost-of-goods-sold-custom input for period ${period}`);
            input.addEventListener('change', updateGrossProfit);
            input.addEventListener('change', updateCostOfGoodsSoldSubtotal);
            input.addEventListener('change', updateNetOperatingIncome);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For gross-revenue-generic
        if (input.getAttribute('var') === 'gross-revenue-generic') {
            console.log(`Found generic input for period ${period}`);
            input.addEventListener('change', updateSubtotal);
            input.addEventListener('change', updateNetRevenue);
            input.addEventListener('change', updateGrossProfit);
            input.addEventListener('change', updateNetOperatingIncome);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For all gross-revenue-custom fields
        if (input.getAttribute('var') === 'gross-revenue-custom') {
            console.log(`Found custom input for period ${period}`);
            input.addEventListener('change', updateSubtotal);
            input.addEventListener('change', updateNetRevenue);
            input.addEventListener('change', updateGrossProfit);
            input.addEventListener('change', updateNetOperatingIncome);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For gross-revenue-subtotal
        if (input.getAttribute('var') === 'gross-revenue-subtotal') {
            console.log(`Found gross-revenue-subtotal input for period ${period}`);
            input.addEventListener('change', updateNetRevenue);
            input.addEventListener('change', updateGrossProfit);
            input.addEventListener('change', updateNetOperatingIncome);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For returns-and-allowances
        if (input.getAttribute('var') === 'returns-and-allowances') {
            console.log(`Found returns-and-allowances input for period ${period}`);
            input.addEventListener('change', updateNetRevenue);
            input.addEventListener('change', updateGrossProfit);
            input.addEventListener('change', updateNetOperatingIncome);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For cost-of-goods-sold-subtotal
        if (input.getAttribute('var') === 'cost-of-goods-sold-subtotal') {
            console.log(`Found cost-of-goods-sold-subtotal input for period ${period}`);
            input.addEventListener('change', updateGrossProfit);
            input.addEventListener('change', updateNetOperatingIncome);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For net-revenue
        if (input.getAttribute('var') === 'net-revenue') {
            console.log(`Found net-revenue input for period ${period}`);
            input.addEventListener('change', updateNetRevenue);
            input.addEventListener('change', updateGrossProfit);
            input.addEventListener('change', updateNetOperatingIncome);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);;
        }

        // For total-operating-expenses
        if (input.getAttribute('var') === 'total-operating-expenses') {
            console.log(`Found total-operating-expenses input for period ${period}`);
            input.addEventListener('change', updateTotalOperatingExpenses);
        }

        // For net-operating-income
        if (input.getAttribute('var') === 'net-operating-income') {
            console.log(`Found net-operating-income input for period ${period}`);
            input.addEventListener('change', updateNetOperatingIncome);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For other-operating-expenses-generic
        if (input.getAttribute('var') === 'other-operating-expenses-generic') {
            console.log(`Found other-operating-expenses-generic input for period ${period}`);
            input.addEventListener('change', updateOtherOperatingExpensesSubtotal);
            input.addEventListener('change', updateTotalOperatingExpenses);
            input.addEventListener('change', updateNetOperatingIncome);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For other-operating-expenses-custom
        if (input.getAttribute('var') === 'other-operating-expenses-custom') {
            console.log(`Found other-operating-expenses-custom input for period ${period}`);
            input.addEventListener('change', updateOtherOperatingExpensesSubtotal);
            input.addEventListener('change', updateTotalOperatingExpenses);
            input.addEventListener('change', updateNetOperatingIncome);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }
        
        // Add event listeners for the various operating expenses
        if ([
            'salaries-wages-and-payroll-taxes',
            'officer-compensation',
            'repairs-and-maintenance',
            'bad-debt',
            'rent',
            'taxes-and-licenses',
            'interest-expense',
            'depreciation-and-depletion',
            'amortization',
            'retirement-plans',
            'employee-benefits',
            'other-operating-expenses-subtotal'
        ].includes(input.getAttribute('var'))) {
            input.addEventListener('change', updateTotalOperatingExpenses);
            input.addEventListener('change', updateNetOperatingIncome);
            input.addEventListener('change', updateTotalOtherIncomeAndExpenses);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }
        
        // For other-income-generic
        if (input.getAttribute('var') === 'other-income-generic') {
            console.log(`Found other-income-generic input for period ${period}`);
            input.addEventListener('change', updateOtherIncomeSubtotal);
            input.addEventListener('change', updateTotalOtherIncomeAndExpenses);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For all other-income-custom fields
        if (input.getAttribute('var') === 'other-income-custom') {
            console.log(`Found other-income-custom input for period ${period}`);
            input.addEventListener('change', updateOtherIncomeSubtotal);
            input.addEventListener('change', updateTotalOtherIncomeAndExpenses);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For other-income-subtotal
        if (input.getAttribute('var') === 'other-income-subtotal') {
            console.log(`Found other-income-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalOtherIncomeAndExpenses);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For other-expense-generic
        if (input.getAttribute('var') === 'other-expenses-generic') {
            console.log(`Found generic input for period ${period}`);
            input.addEventListener('change', updateOtherExpenseSubtotal);
            input.addEventListener('change', updateTotalOtherIncomeAndExpenses);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For all other-expense-custom fields
        if (input.getAttribute('var') === 'other-expenses-custom') {
            console.log(`Found custom input for period ${period}`);
            input.addEventListener('change', updateOtherExpenseSubtotal);
            input.addEventListener('change', updateTotalOtherIncomeAndExpenses);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For other-expense-subtotal
        if (input.getAttribute('var') === 'other-expenses-subtotal') {
            console.log(`Found other-expenses-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalOtherIncomeAndExpenses);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }
		
		// For gain on sale of assets
        if (input.getAttribute('var') === 'loss-on-sale-of-assets') {
            console.log(`Found loss on sale of assets input for period ${period}`);
            input.addEventListener('change', updateTotalOtherIncomeAndExpenses);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }
		
		// For investment income
        if (input.getAttribute('var') === 'gain-on-sale-of-assets') {
            console.log(`Found gain on sale of assets input for period ${period}`);
            input.addEventListener('change', updateTotalOtherIncomeAndExpenses);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }
		
		// For investment income
        if (input.getAttribute('var') === 'investment-income') {
            console.log(`Found investment income input for period ${period}`);
            input.addEventListener('change', updateTotalOtherIncomeAndExpenses);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }
        
        // For corporate taxes
        if (input.getAttribute('var') === 'corporate-taxes') {
            console.log(`Found corporate taxes input for period ${period}`);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }
		
		// For corporate tax refund
        if (input.getAttribute('var') === 'corporate-tax-refund') {
            console.log(`Found corporate tax refund input for period ${period}`);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For net profit
        if (input.getAttribute('var') === 'net-profit') {
            console.log(`Found net profit for period ${period}`);
            input.addEventListener('change', updateNetIncome);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For net profit after taxes
        if (input.getAttribute('var') === 'net-profit-after-taxes') {
            console.log(`Found net profit for period ${period}`);
            input.addEventListener('change', updateNetProfitAfterTaxes);
            input.addEventListener('change', updateNetProfitAfterTaxesWithinBalanceSheetEquitySection);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }
        
        ///LINE SEPERATOR FOR BALANCE SHEET///
        
        // For bs-cash-subtotal
        if (input.getAttribute('var') === 'bs-cash-subtotal') {
            console.log(`Found bs-cash-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-cash-generic
        if (input.getAttribute('var') === 'bs-cash-generic') {
            console.log(`Found bs-cash-generic input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetCashSubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-cash-at-financial-institution
        if (input.getAttribute('var') === 'bs-cash-at-financial-institution') {
            console.log(`Found bs-cash-at-financial-institution input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetCashSubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-cash-custom
        if (input.getAttribute('var') === 'bs-cash-custom') {
            console.log(`Found bs-cash-custom input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetCashSubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-accounts-receivable-subtotal
        if (input.getAttribute('var') === 'bs-accounts-receivable-subtotal') {
            console.log(`Found bs-accounts-receivable-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-accounts-receivable-generic
        if (input.getAttribute('var') === 'bs-accounts-receivable-generic') {
            console.log(`Found bs-accounts-receivable-generic input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetAccountsReceivableSubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-allowance-for-doubtful-accounts
        if (input.getAttribute('var') === 'bs-allowance-for-doubtful-accounts') {
            console.log(`Found bs-allowance-for-doubtful-accounts input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetAccountsReceivableSubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-accounts-receivable-custom
        if (input.getAttribute('var') === 'bs-accounts-receivable-custom') {
            console.log(`Found bs-accounts-receivable-custom input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetAccountsReceivableSubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }
        
        // For bs-inventory-subtotal
        if (input.getAttribute('var') === 'bs-inventory-subtotal') {
            console.log(`Found bs-inventory-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-inventory-generic
        if (input.getAttribute('var') === 'bs-inventory-generic') {
            console.log(`Found bs-inventory-generic input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetInventorySubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-inventory-raw-materials
        if (input.getAttribute('var') === 'bs-inventory-raw-materials') {
            console.log(`Found bs-raw-materials input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetInventorySubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-inventory-work-in-progress
        if (input.getAttribute('var') === 'bs-inventory-work-in-progress') {
            console.log(`Found bs-work-in-progress input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetInventorySubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-inventory-finished-goods
        if (input.getAttribute('var') === 'bs-inventory-finished-goods') {
            console.log(`Found bs-finished-goods input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetInventorySubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-inventory-in-transit
        if (input.getAttribute('var') === 'bs-inventory-in-transit') {
            console.log(`Found bs-in-transit input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetInventorySubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-inventory-custom
        if (input.getAttribute('var') === 'bs-inventory-custom') {
            console.log(`Found bs-inventory-custom input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetInventorySubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-current-assets-subtotal
        if (input.getAttribute('var') === 'bs-other-current-assets-subtotal') {
            console.log(`Found bs-other-current-assets-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-current-assets-generic
        if (input.getAttribute('var') === 'bs-other-current-assets-generic') {
            console.log(`Found bs-other-current-assets-generic input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetOtherCurrentAssetsSubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-current-assets-deposits
        if (input.getAttribute('var') === 'bs-other-current-assets-deposits') {
            console.log(`Found bs-other-current-assets-deposits input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetOtherCurrentAssetsSubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-current-assets-custom
        if (input.getAttribute('var') === 'bs-other-current-assets-custom') {
            console.log(`Found bs-other-current-assets-other input for period ${period}`);
            input.addEventListener('change', updateBalanceSheetOtherCurrentAssetsSubtotal);
            input.addEventListener('change', updateTotalCurrentAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-total-current-assets
        if (input.getAttribute('var') === 'bs-total-current-assets') {
            console.log(`Found bs-total-current-assets input for period ${period}`);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-property-plant-and-equipment-subtotal
        if (input.getAttribute('var') === 'bs-property-plant-and-equipment-subtotal') {
            console.log(`Found bs-property-plant-and-equipment-subtotal input for period ${period}`);
            input.addEventListener('change', updateNetPropertyPlantAndEquipment);
            input.addEventListener('change', updateNetFixedAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-property-plant-and-equipment-generic
        if (input.getAttribute('var') === 'bs-property-plant-and-equipment-generic') {
            console.log(`Found bs-property-plant-and-equipment-generic input for period ${period}`);
            input.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
            input.addEventListener('change', updateNetPropertyPlantAndEquipment);
            input.addEventListener('change', updateNetFixedAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-machinery-and-equipment
        if (input.getAttribute('var') === 'bs-machinery-and-equipment') {
            console.log(`Found bs-machinery-and-equipment input for period ${period}`);
            input.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
            input.addEventListener('change', updateNetPropertyPlantAndEquipment);
            input.addEventListener('change', updateNetFixedAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-titled-vehicles
        if (input.getAttribute('var') === 'bs-titled-vehicles') {
            console.log(`Found bs-titled-vehicles input for period ${period}`);
            input.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
            input.addEventListener('change', updateNetPropertyPlantAndEquipment);
            input.addEventListener('change', updateNetFixedAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-computer-and-office-equipment
        if (input.getAttribute('var') === 'bs-computer-and-office-equipment') {
            console.log(`Found bs-computer-and-office-equipment input for period ${period}`);
            input.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
            input.addEventListener('change', updateNetPropertyPlantAndEquipment);
            input.addEventListener('change', updateNetFixedAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-leasehold-improvements
        if (input.getAttribute('var') === 'bs-leasehold-improvements') {
            console.log(`Found bs-leasehold-improvements input for period ${period}`);
            input.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
            input.addEventListener('change', updateNetPropertyPlantAndEquipment);
            input.addEventListener('change', updateNetFixedAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-buildings
        if (input.getAttribute('var') === 'bs-buildings') {
            console.log(`Found bs-buildings input for period ${period}`);
            input.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
            input.addEventListener('change', updateNetPropertyPlantAndEquipment);
            input.addEventListener('change', updateNetFixedAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-construction-in-progress
        if (input.getAttribute('var') === 'bs-construction-in-progress') {
            console.log(`Found bs-construction-in-progress input for period ${period}`);
            input.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
            input.addEventListener('change', updateNetPropertyPlantAndEquipment);
            input.addEventListener('change', updateNetFixedAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-property-plant-and-equipment-custom
        if (input.getAttribute('var') === 'bs-property-plant-and-equipment-custom') {
            console.log(`Found bs-property-plant-and-equipment-custom input for period ${period}`);
            input.addEventListener('change', updatePropertyPlantEquipmentSubtotal);
            input.addEventListener('change', updateNetPropertyPlantAndEquipment);
            input.addEventListener('change', updateNetFixedAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For accumulated depreciation field to update net pp&e
        if (input.getAttribute('var') === 'bs-accumulated-depreciation') {
            console.log(`Found bs-accumulated-depreciation input for period ${period}`);
            input.addEventListener('change', updateNetPropertyPlantAndEquipment);
            input.addEventListener('change', updateNetFixedAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For land (fixed asset) field to update net fixed assets
        if (input.getAttribute('var') === 'bs-land') {
            console.log(`Found bs-land input for period ${period}`);
            input.addEventListener('change', updateNetFixedAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-intangible-assets-subtotal
        if (input.getAttribute('var') === 'bs-intangible-assets-subtotal') {
            console.log(`Found bs-intangible-assets-subtotal input for period ${period}`);
            input.addEventListener('change', updateNetIntangibleAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-intangible-assets-generic
        if (input.getAttribute('var') === 'bs-intangible-assets-generic') {
            console.log(`Found bs-intangible-assets-generic input for period ${period}`);
            input.addEventListener('change', updateIntangibleAssetsSubtotal);
            input.addEventListener('change', updateNetIntangibleAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-intangible-assets-trademarks-and-licenses
        if (input.getAttribute('var') === 'bs-intangible-assets-trademarks-and-licenses') {
            console.log(`Found bs-intangible-assets-trademarks-and-licenses input for period ${period}`);
            input.addEventListener('change', updateIntangibleAssetsSubtotal);
            input.addEventListener('change', updateNetIntangibleAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-intangible-assets-financing-costs
        if (input.getAttribute('var') === 'bs-intangible-assets-financing-costs') {
            console.log(`Found bs-intangible-assets-financing-costs input for period ${period}`);
            input.addEventListener('change', updateIntangibleAssetsSubtotal);
            input.addEventListener('change', updateNetIntangibleAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-inangible-assets-custom
        if (input.getAttribute('var') === 'bs-inangible-assets-custom') {
            console.log(`Found bs-inangible-assets-custom input for period ${period}`);
            input.addEventListener('change', updateIntangibleAssetsSubtotal);
            input.addEventListener('change', updateNetIntangibleAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For accumulated amortiation field to update Net Inangible Assets
        if (input.getAttribute('var') === 'bs-accumulated-amortization') {
            console.log(`Found bs-accumulated amortization input for period ${period}`);
            input.addEventListener('change', updateNetIntangibleAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-due-from-related-parties-subtotal
        if (input.getAttribute('var') === 'bs-due-from-related-parties-subtotal') {
            console.log(`Found bs-due-from-related-parties-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalOtherLongTermAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-due-from-related-parties-generic
        if (input.getAttribute('var') === 'bs-due-from-related-parties-generic') {
            console.log(`Found bs-due-from-related-parties-generic input for period ${period}`);
            input.addEventListener('change', updateDueFromRelatedPartiesSubtotal);
            input.addEventListener('change', updateTotalOtherLongTermAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-due-from-related-parties-custom
        if (input.getAttribute('var') === 'bs-due-from-related-parties-custom') {
            console.log(`Found bs-due-from-related-parties-custom input for period ${period}`);
            input.addEventListener('change', updateDueFromRelatedPartiesSubtotal);
            input.addEventListener('change', updateTotalOtherLongTermAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-due-from-shareholders-subtotal
        if (input.getAttribute('var') === 'bs-due-from-shareholders-subtotal') {
            console.log(`Found bs-due-from-shareholders-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalOtherLongTermAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-due-from-shareholders-generic
        if (input.getAttribute('var') === 'bs-due-from-shareholders-generic') {
            console.log(`Found bs-due-from-shareholders-generic input for period ${period}`);
            input.addEventListener('change', updateDueFromShareholdersSubtotal);
            input.addEventListener('change', updateTotalOtherLongTermAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-due-from-shareholders-custom
        if (input.getAttribute('var') === 'bs-due-from-shareholders-custom') {
            console.log(`Found bs-due-from-shareholders-custom input for period ${period}`);
            input.addEventListener('change', updateDueFromShareholdersSubtotal);
            input.addEventListener('change', updateTotalOtherLongTermAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }
        
        // For bs-other-long-term-assets-subtotal
        if (input.getAttribute('var') === 'bs-other-long-term-assets-subtotal') {
            console.log(`Found bs-other-long-term-assets-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalOtherLongTermAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-long-term-assets-generic
        if (input.getAttribute('var') === 'bs-other-long-term-assets-generic') {
            console.log(`Found bs-other-long-term-assets-generic input for period ${period}`);
            input.addEventListener('change', updateOtherLongTermAssetsSubtotal);
            input.addEventListener('change', updateTotalOtherLongTermAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-long-term-assets-custom
        if (input.getAttribute('var') === 'bs-other-long-term-assets-custom') {
            console.log(`Found bs-other-long-term-assets-custom input for period ${period}`);
            input.addEventListener('change', updateOtherLongTermAssetsSubtotal);
            input.addEventListener('change', updateTotalOtherLongTermAssets);
            input.addEventListener('change', updateTotalLongTermAssets);
            input.addEventListener('change', updateTotalAssets);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        /// BALANCE SHEET LIABILITIES ///

        // For bs-accounts-payable-subtotal
        if (input.getAttribute('var') === 'bs-accounts-payable-subtotal') {
            console.log(`Found bs-accounts-payable-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }
        
        // For bs-accounts-payable-trade
        if (input.getAttribute('var') === 'bs-accounts-payable-trade') {
            console.log(`Found bs-accounts-payable-trade input for period ${period}`);
            input.addEventListener('change', updateAccountsPayableSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-accounts-payable-other
        if (input.getAttribute('var') === 'bs-accounts-payable-other') {
            console.log(`Found bs-accounts-payable-other input for period ${period}`);
            input.addEventListener('change', updateAccountsPayableSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-accounts-payable-custom
        if (input.getAttribute('var') === 'bs-accounts-payable-custom') {
            console.log(`Found bs-accounts-payable-custom input for period ${period}`);
            input.addEventListener('change', updateAccountsPayableSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-revolving-lines-of-credit-subtotal
        if (input.getAttribute('var') === 'bs-revolving-lines-of-credit-subtotal') {
            console.log(`Found bs-revolving-lines-of-credit-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-revolving-lines-of-credit-generic
        if (input.getAttribute('var') === 'bs-revolving-lines-of-credit-generic') {
            console.log(`Found bs-revolving-lines-of-credit-generic input for period ${period}`);
            input.addEventListener('change', updateRevolvingLinesOfCreditSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-promissory-note-lines-of-credit
        if (input.getAttribute('var') === 'bs-promissory-note-lines-of-credit') {
            console.log(`Found bs-promissory-note-lines-of-credit input for period ${period}`);
            input.addEventListener('change', updateRevolvingLinesOfCreditSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-credit-cards
        if (input.getAttribute('var') === 'bs-credit-cards') {
            console.log(`Found bs-credit-cards input for period ${period}`);
            input.addEventListener('change', updateRevolvingLinesOfCreditSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-revolving-lines-of-credit-custom
        if (input.getAttribute('var') === 'bs-revolving-lines-of-credit-custom') {
            console.log(`Found bs-revolving-lines-of-credit-custom input for period ${period}`);
            input.addEventListener('change', updateRevolvingLinesOfCreditSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-current-portion-of-long-term-liabilities-subtotal
        if (input.getAttribute('var') === 'bs-current-portion-of-long-term-liabilities-subtotal') {
            console.log(`Found bs-current-portion-of-long-term-liabilities-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-current-portion-of-long-term-liabilities-generic
        if (input.getAttribute('var') === 'bs-current-portion-of-long-term-liabilities-generic') {
            console.log(`Found bs-current-portion-of-long-term-liabilities-generic input for period ${period}`);
            input.addEventListener('change', updateCurrentPortionOfLongTermLiabilitiesSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-current-portion-of-long-term-liabilities-custom
        if (input.getAttribute('var') === 'bs-current-portion-of-long-term-liabilities-custom') {
            console.log(`Found bs-current-portion-of-long-term-liabilities-custom input for period ${period}`);
            input.addEventListener('change', updateCurrentPortionOfLongTermLiabilitiesSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-accrual-liabilities-subtotal
        if (input.getAttribute('var') === 'bs-accrual-liabilities-subtotal') {
            console.log(`Found bs-accrual-liabilities-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-accrual-liabilities-generic
        if (input.getAttribute('var') === 'bs-accrual-liabilities-generic') {
            console.log(`Found bs-accrual-liabilities-generic input for period ${period}`);
            input.addEventListener('change', updateAccrualLiabilitiesSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-accrual-liabilities-customer-advances
        if (input.getAttribute('var') === 'bs-accrual-liabilities-customer-advances') {
            console.log(`Found bs-accrual-liabilities-customer-advances input for period ${period}`);
            input.addEventListener('change', updateAccrualLiabilitiesSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-accrual-liabilities-custom
        if (input.getAttribute('var') === 'bs-accrual-liabilities-custom') {
            console.log(`Found bs-accrual-liabilities-custom input for period ${period}`);
            input.addEventListener('change', updateAccrualLiabilitiesSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-current-liabilities-subtotal
        if (input.getAttribute('var') === 'bs-other-current-liabilities-subtotal') {
            console.log(`Found bs-other-current-liabilities-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-current-liabilities-generic
        if (input.getAttribute('var') === 'bs-other-current-liabilities-generic') {
            console.log(`Found bs-other-current-liabilities-generic input for period ${period}`);
            input.addEventListener('change', updateOtherCurrentLiabilitiesSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-tax-liabilities
        if (input.getAttribute('var') === 'bs-tax-liabilities') {
            console.log(`Found bs-tax-liabilities input for period ${period}`);
            input.addEventListener('change', updateOtherCurrentLiabilitiesSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-payroll-liabilities
        if (input.getAttribute('var') === 'bs-payroll-liabilities') {
            console.log(`Found bs-payroll-liabilities input for period ${period}`);
            input.addEventListener('change', updateOtherCurrentLiabilitiesSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-current-liabilities-custom
        if (input.getAttribute('var') === 'bs-other-current-liabilities-custom') {
            console.log(`Found bs-other-current-liabilities-custom input for period ${period}`);
            input.addEventListener('change', updateOtherCurrentLiabilitiesSubtotal);
            input.addEventListener('change', updateTotalCurrentLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-total-current-liabilities
        if (input.getAttribute('var') === 'bs-total-current-liabilities') {
            console.log(`Found bs-total-current-liabilities input for period ${period}`);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-long-term-debt-to-be-refinanced-subtotal
        if (input.getAttribute('var') === 'bs-long-term-debt-to-be-refinanced-subtotal') {
            console.log(`Found bs-long-term-debt-to-be-refinanced-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-long-term-debt-to-be-refinanced-generic
        if (input.getAttribute('var') === 'bs-long-term-debt-to-be-refinanced-generic') {
            console.log(`Found bs-long-term-debt-to-be-refinanced-generic input for period ${period}`);
            input.addEventListener('change', updateLongTermDebtToBeRefinancedSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-long-term-debt-to-be-refinanced-custom
        if (input.getAttribute('var') === 'bs-long-term-debt-to-be-refinanced-custom') {
            console.log(`Found bs-long-term-debt-to-be-refinanced-custom input for period ${period}`);
            input.addEventListener('change', updateLongTermDebtToBeRefinancedSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-long-term-notes-payable-subtotal
        if (input.getAttribute('var') === 'bs-other-long-term-notes-payable-subtotal') {
            console.log(`Found bs-other-long-term-notes-payable-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-long-term-notes-payable-subtotal-generic
        if (input.getAttribute('var') === 'bs-other-long-term-notes-payable-subtotal-generic') {
            console.log(`Found bs-other-long-term-notes-payable-subtotal-generic input for period ${period}`);
            input.addEventListener('change', updateOtherLongTermNotesPayableSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-long-term-notes-payable-custom
        if (input.getAttribute('var') === 'bs-other-long-term-notes-payable-custom') {
            console.log(`Found bs-other-long-term-notes-payable-custom input for period ${period}`);
            input.addEventListener('change', updateOtherLongTermNotesPayableSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-due-to-related-parties-subtotal
        if (input.getAttribute('var') === 'bs-due-to-related-parties-subtotal') {
            console.log(`Found bs-due-to-related-parties-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-due-to-related-parties-generic
        if (input.getAttribute('var') === 'bs-due-to-related-parties-generic') {
            console.log(`Found bs-due-to-related-parties-generic input for period ${period}`);
            input.addEventListener('change', updateDueToRelatedPartiesSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-due-to-related-parties-custom
        if (input.getAttribute('var') === 'bs-due-to-related-parties-custom') {
            console.log(`Found bs-due-to-related-parties-custom input for period ${period}`);
            input.addEventListener('change', updateDueToRelatedPartiesSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-due-to-shareholders-subtotal
        if (input.getAttribute('var') === 'bs-due-to-shareholders-subtotal') {
            console.log(`Found bs-due-to-shareholders-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-due-to-shareholders-generic
        if (input.getAttribute('var') === 'bs-due-to-shareholders-generic') {
            console.log(`Found bs-due-to-shareholders-generic input for period ${period}`);
            input.addEventListener('change', updateDueToShareholdersSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-due-to-shareholders-custom
        if (input.getAttribute('var') === 'bs-due-to-shareholders-custom') {
            console.log(`Found bs-due-to-shareholders-custom input for period ${period}`);
            input.addEventListener('change', updateDueToShareholdersSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-long-term-liabilities-subtotal
        if (input.getAttribute('var') === 'bs-other-long-term-liabilities-subtotal') {
            console.log(`Found bs-other-long-term-liabilities-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-long-term-liabilities-generic
        if (input.getAttribute('var') === 'bs-other-long-term-liabilities-generic') {
            console.log(`Found bs-other-long-term-liabilities-generic input for period ${period}`);
            input.addEventListener('change', updateOtherLongTermLiabilitiesSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-long-term-liabilities-custom
        if (input.getAttribute('var') === 'bs-other-long-term-liabilities-custom') {
            console.log(`Found bs-other-long-term-liabilities-custom input for period ${period}`);
            input.addEventListener('change', updateOtherLongTermLiabilitiesSubtotal);
            input.addEventListener('change', updateTotalLongTermLiabilities);
            input.addEventListener('change', updateTotalLiabilities);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-paid-in-capital-subtotal
        if (input.getAttribute('var') === 'bs-paid-in-capital-subtotal') {
            console.log(`Found bs-paid-in-capital-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-paid-in-capital-generic
        if (input.getAttribute('var') === 'bs-paid-in-capital-generic') {
            console.log(`Found bs-paid-in-capital-generic input for period ${period}`);
            input.addEventListener('change', updatePaidInCapitalSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-paid-in-capital-custom
        if (input.getAttribute('var') === 'bs-paid-in-capital-custom') {
            console.log(`Found bs-paid-in-capital-custom input for period ${period}`);
            input.addEventListener('change', updatePaidInCapitalSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-retained-earnings-subtotal
        if (input.getAttribute('var') === 'bs-retained-earnings-subtotal') {
            console.log(`Found bs-retained-earnings-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-prior-year-end-retained-earnings
        if (input.getAttribute('var') === 'bs-prior-year-end-retained-earnings') {
            console.log(`Found bs-prior-year-end-retained-earnings input for period ${period}`);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-current-period-net-profit-after-taxes
        if (input.getAttribute('var') === 'bs-current-period-net-profit-after-taxes') {
            console.log(`Found bs-current-period-net-profit-after-taxes input for period ${period}`);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-current-period-distributions
        if (input.getAttribute('var') === 'bs-current-period-distributions') {
            console.log(`Found bs-current-period-distributions input for period ${period}`);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-current-period-contributions
        if (input.getAttribute('var') === 'bs-current-period-contributions') {
            console.log(`Found bs-current-period-contributions input for period ${period}`);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity); 
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-retained-earnings-custom
        if (input.getAttribute('var') === 'bs-retained-earnings-custom') {
            console.log(`Found bs-retained-earnings-custom input for period ${period}`);
            input.addEventListener('change', updateRetainedEarningsSubtotal);
            input.addEventListener('change', updateTotalEquity); 
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-adjustments-to-equity-subtotal
        if (input.getAttribute('var') === 'bs-other-adjustments-to-equity-subtotal') {
            console.log(`Found bs-other-adjustments-to-equity-subtotal input for period ${period}`);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-adjustments-to-equity-generic
        if (input.getAttribute('var') === 'bs-other-adjustments-to-equity-generic') {
            console.log(`Found bs-other-adjustments-to-equity-generic input for period ${period}`);
            input.addEventListener('change', updateOtherAdjustmentsToEquitySubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        // For bs-other-adjustments-to-equity-custom
        if (input.getAttribute('var') === 'bs-other-adjustments-to-equity-custom') {
            console.log(`Found bs-other-adjustments-to-equity-custom input for period ${period}`);
            input.addEventListener('change', updateOtherAdjustmentsToEquitySubtotal);
            input.addEventListener('change', updateTotalEquity);
            input.addEventListener('change', updateTotalLiabilitiesAndEquity);
            input.addEventListener('change', updateTotalUnbalancedAmount);
        }

        ///LINE END SEPERATOR///
        
        // Attach hover listeners to dropdown groups
        document.querySelectorAll('.dropdown-group').forEach(group => {
            group.addEventListener('mouseover', function() {
                this.querySelector('.dropdown-options').style.display = 'block';
            });
            group.addEventListener('mouseout', function() {
                this.querySelector('.dropdown-options').style.display = 'none';
            });
        });
        
    });
}

// Add this function to set up event listeners for input fields in a given container
function setupInputFieldEventListeners(container) {
    // Event listeners for input fields
    container.querySelectorAll('input[input-type="variable"], input[input-type="standard"], input[input-type="contra"]').forEach(input => {
        input.addEventListener('focus', inputFocusHandler);
        input.addEventListener('blur', inputBlurHandler);
        input.addEventListener('input', inputInputHandler);
    }); // Corrected: Added missing parenthesis here

    // Attach hover listeners to dropdown groups within the container
    container.querySelectorAll('.dropdown-group').forEach(group => {
        group.addEventListener('mouseover', function() {
            this.querySelector('.dropdown-options').style.display = 'block';
        });
        group.addEventListener('mouseout', function() {
            this.querySelector('.dropdown-options').style.display = 'none';
        });
    });
}

// Sets up event listners witth the period number argument to assign listeners to dynamically created periods.
function setupDateFieldForPeriod(newPeriod) {
    var fieldId = 'Fiscal-Year-End-Date-Input'; // Use the correct ID for each period
    var dateField = document.getElementById(fieldId);

    if (dateField) {
        // Set the placeholder text
        dateField.setAttribute('placeholder', 'mm/dd');

        // Apply the placeholder styling for black color
        var styleSheet = document.createElement('style');
        styleSheet.textContent = `#${fieldId}::placeholder { color: black; }`;
        document.head.appendChild(styleSheet);

        // Adjust the padding of the input field to not overlap with the icon
        dateField.style.paddingRight = '20px';
        dateField.style.textAlign = 'right';

        // Function to set the selection range for highlighting
        function setSelectionRange(input, selectionStart, selectionEnd) {
            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(selectionStart, selectionEnd);
            } else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        }

        // Add event listeners to handle user input
        dateField.addEventListener('input', function(e) {
            var inputVal = this.value.replace(/[^0-9\/]/g, '');
            if (inputVal.length === 2 && inputVal.indexOf('/') !== 2) {
                inputVal += '/'; // Insert slash after MM
            }
            this.value = inputVal; // Update the value with formatted text

            // Determine which part of the placeholder to highlight next
            if (inputVal.length === 0) {
                setSelectionRange(this, 0, 1); // Highlight first 'm'
            } else if (inputVal.length === 1) {
                setSelectionRange(this, 1, 2); // Highlight second 'm'
            } else if (inputVal.length === 3) {
                setSelectionRange(this, 3, 4); // Highlight first 'd'
            } else if (inputVal.length === 4) {
                setSelectionRange(this, 4, 5); // Highlight second 'd'
            }
        });

        // Highlight the first part of the placeholder when the user focuses on the field
        dateField.addEventListener('focus', function(e) {
            if (this.value === '') {
                setSelectionRange(this, 0, 1);
            }
        });

        // Add a calendar icon to the input field
        var container = dateField.parentNode;
        container.style.position = 'relative';

        var imagePath = '/static/assets/img/Icons/CalendarIcon.png';
        var iconSpan = document.createElement('span');
        iconSpan.className = 'calendar-icon';
        iconSpan.style.position = 'absolute';
        iconSpan.style.right = '15px';
        iconSpan.style.top = '37.5%'; // Adjust this value to move the icon higher
        iconSpan.style.transform = 'translateY(-50%)';
        iconSpan.style.height = '21.75px';
        iconSpan.style.width = '21.75px';
        iconSpan.style.backgroundImage = `url('${imagePath}')`;
        iconSpan.style.backgroundSize = 'cover';
        iconSpan.style.pointerEvents = 'none';

        container.appendChild(iconSpan);
    }
}

// Calculations for subtotal fields that sum child fields.
function setupSubtotalFieldListeners() {
    
    //INCOME STATEMENT FIELD SUBTOTAL FIELD LISTENERS//
    // Add setup for Income Statement Cost of Goods Sold Subtotal
    setupSubtotalListenersForGroup('.Cost-of-Goods-Sold-Input-Group', 'cost-of-goods-sold-subtotal', updateCostOfGoodsSoldSubtotal);
    // Add setup for Income Statement Other Expenses Subtotal
    setupSubtotalListenersForGroup('.Other-Expenses-Input-Group', 'other-expenses-subtotal', updateOtherExpenseSubtotal);
    // Add setup for Income Statement Other Operating Expenses Subtotal
    setupSubtotalListenersForGroup('.Other-Operating-Expenses-Input-Group', 'other-operating-expenses-subtotal', updateOtherOperatingExpensesSubtotal);
    // Add setup for Income Statement Other Income Subtotal
    setupSubtotalListenersForGroup('.Other-Income-Input-Group', 'other-income-subtotal', updateOtherIncomeSubtotal);

    //BALANCE SHEET SUBTOTAL FIELD LISTENERS//
    // Add setup for Balance Sheet Cash
    setupSubtotalListenersForGroup('.Balance-Sheet-Cash-Input-Group', 'bs-cash-subtotal', updateBalanceSheetCashSubtotal);
    // Add setup for Balance Sheet Accounts Receivable
    setupSubtotalListenersForGroup('.Balance-Sheet-Accounts-Receivable-Input-Group', 'bs-accounts-receivable-subtotal', updateBalanceSheetAccountsReceivableSubtotal);
    // Add setup for Balance Sheet Inventory
    setupSubtotalListenersForGroup('.Balance-Sheet-Inventory-Input-Group', 'bs-inventory-subtotal', updateBalanceSheetInventorySubtotal);
    // Add setup for Balance Sheet Other Current Assets
    setupSubtotalListenersForGroup('.Balance-Sheet-Other-Current-Assets-Input-Group', 'bs-other-current-assets-subtotal', updateBalanceSheetOtherCurrentAssetsSubtotal);
    // Add setup for Balance Sheet Property, Plant, and Equipment
    setupSubtotalListenersForGroup('.Balance-Sheet-Property-Plant-Equipment-Input-Group', 'bs-property-plant-and-equipment-subtotal', updatePropertyPlantEquipmentSubtotal);
    // Add setup for Balance Sheet Intangible Assets
    setupSubtotalListenersForGroup('.Balance-Sheet-Intangible-Assets-Input-Group', 'bs-intangible-assets-subtotal', updateIntangibleAssetsSubtotal);
    // Add setup for Balance Sheet Due from Related Parties
    setupSubtotalListenersForGroup('.Balance-Sheet-Due-from-Related-Parties-Input-Group', 'bs-due-from-related-parties-subtotal', updateDueFromRelatedPartiesSubtotal);
    // Add setup for Balance Sheet Due from Shareholders
    setupSubtotalListenersForGroup('.Balance-Sheet-Due-from-Shareholders-Input-Group', 'bs-due-from-shareholders-subtotal', updateDueFromShareholdersSubtotal);
    // Add setup for Balance Sheet Other Long-Term Assets
    setupSubtotalListenersForGroup('.Balance-Sheet-Other-Long-Term-Assets-Input-Group', 'bs-other-long-term-assets-subtotal', updateOtherLongTermAssetsSubtotal);
    // Add setup for Balance Sheet Accounts Payable
    setupSubtotalListenersForGroup('.Balance-Sheet-Accounts-Payable-Input-Group', 'bs-accounts-payable-subtotal', updateAccountsPayableSubtotal);
    // Add setup for Balance Sheet Current Portion of Long-Term Liabilities
    setupSubtotalListenersForGroup('.Balance-Sheet-Current-Portion-of-Long-Term-Liabilities-Input-Group', 'bs-current-portion-of-long-term-liabilities', updateCurrentPortionOfLongTermLiabilitiesSubtotal);
    // Add setup for Balance Sheet Revolving Lines of Credit
    setupSubtotalListenersForGroup('.Balance-Sheet-Revolving-Lines-of-Credit-Input-Group', 'bs-revolving-lines-of-credit-subtotal', updateRevolvingLinesOfCreditSubtotal);
    // Add setup for Balance Sheet Accrual Liabilities
    setupSubtotalListenersForGroup('.Balance-Sheet-Accrual-Liabilities-Input-Group', 'bs-accrual-liabilities-subtotal', updateAccrualLiabilitiesSubtotal);
    // Add setup for Balance Sheet Other Current Liabilities
    setupSubtotalListenersForGroup('.Balance-Sheet-Other-Current-Liabilities-Input-Group', 'bs-other-current-liabilities-subtotal', updateOtherCurrentLiabilitiesSubtotal);
    // Add setup for Long-Term Debt to Be Refinanced Subtotal
    setupSubtotalListenersForGroup('.Balance-Sheet-Long-Term-Debt-to-Be-Refinanced-Input-Group', 'bs-long-term-debt-to-be-refinanced-subtotal', updateLongTermDebtToBeRefinancedSubtotal);
    // Add setup for Other Long-Term Notes Payable Subtotal
    setupSubtotalListenersForGroup('.Balance-Sheet-Other-Long-Term-Notes-Payable-Input-Group', 'bs-other-long-term-notes-payable-subtotal', updateOtherLongTermNotesPayableSubtotal);
    // Add setup for Due to Related Parties Subtotal
    setupSubtotalListenersForGroup('.Balance-Sheet-Due-to-Related-Parties-Input-Group', 'bs-due-to-related-parties-subtotal', updateDueToRelatedPartiesSubtotal);
    // Add setup for Due to Shareholders Subtotal
    setupSubtotalListenersForGroup('.Balance-Sheet-Due-to-Shareholders-Input-Group', 'bs-due-to-shareholders-subtotal', updateDueToShareholdersSubtotal);
    // Add setup for Other Long-Term Liabilities Subtotal
    setupSubtotalListenersForGroup('.Balance-Sheet-Other-Long-Term-Liabilities-Input-Group', 'bs-other-long-term-liabilities-subtotal', updateOtherLongTermLiabilitiesSubtotal);
    // Add setup for Paid-in Capital Subtotal
    setupSubtotalListenersForGroup('.Balance-Sheet-Paid-In-Capital-Input-Group', 'bs-paid-in-capital-subtotal', updatePaidInCapitalSubtotal);
    // Add setup for Retained Earnings Subtotal
    setupSubtotalListenersForGroup('.Balance-Sheet-Retained-Earnings-Input-Group', 'bs-retained-earnings-subtotal', updateRetainedEarningsSubtotal);
    // Add setup for Other Adjustments to Equity Subtotal
    setupSubtotalListenersForGroup('.Balance-Sheet-Other-Adjustments-to-Equity-Input-Group', 'bs-other-adjustments-to-equity-subtotal', updateOtherAdjustmentsToEquitySubtotal);
}

function setupSubtotalListenersForGroup(groupClass, subtotalVar, updateFunction) {
    document.querySelectorAll(`${groupClass} input[var="${subtotalVar}"]`).forEach(subtotalField => {
        // When the subtotal field is manually edited
        subtotalField.addEventListener('input', function() {
            this.setAttribute('data-manual-entry', 'true');
        });

        // Getting the parent group to add listeners to child fields
        const group = subtotalField.closest(groupClass);
        if (group) {
            group.querySelectorAll('input').forEach(input => {
                if (input !== subtotalField) { // Exclude the subtotal field itself
                    input.addEventListener('change', function() {
                        subtotalField.setAttribute('data-manual-entry', 'false');
                        updateFunction.call(input);
                    });
                }
            });
        }
    });
}

function inputFocusHandler(event) {
    // Delay the selection to ensure it works with both click and tab navigation
    setTimeout(() => this.select(), 0);
}

function inputBlurHandler(event) {
    let value = this.value;

    if (value === '' || /[\+\-\*\/]$/.test(value)) {
        return;
    }

    value = value.replace(/[^0-9\.\+\-\*\/]/g, '');
    value = parseFloat(value);
    if (isNaN(value)) {
        this.value = '';
        return;
    }

    // Check if the input-type is 'contra', and if so, negate the absolute value
    if (this.getAttribute('input-type') === 'contra') {
        value = -Math.abs(value);
    }

    value = value.toFixed(2);
    value = formatNumberWithCommas(value);
    this.value = value;
}


function formatNumberWithCommas(value) {
    // Split the value into whole and decimal parts
    let parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function inputInputHandler(event) {
    // Allow only numbers, decimal point, and arithmetic operators
    if (!/^[0-9\.\+\-\*\/]*$/.test(this.value)) {
        this.value = this.value.replace(/[^0-9\.\+\-\*\/]/g, '');
    }

    // Allow a minus sign only at the beginning
    if (this.value.indexOf('-') > 0) {
        this.value = this.value.replace('-', '');
    }
}

function addTabKeyListener(fieldsPerRow) {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            event.preventDefault();  // Prevent the default action
            var direction = event.shiftKey ? 'left' : 'right';  // Determine the direction
            navigateToInput(document.activeElement, direction, fieldsPerRow);  // Call your navigation function
        }
    });
}


// Function to find the index of the next field in a given direction
function findNextFieldIndex(fields, currentFieldIndex, direction, fieldsPerRow) {
    let nextIndex;
    switch (direction) {
        case 'left':
            nextIndex = currentFieldIndex - 1;
            break;
        case 'right':
            nextIndex = currentFieldIndex + 1;
            break;
        case 'up':
            nextIndex = currentFieldIndex - fieldsPerRow;
            break;
        case 'down':
            nextIndex = currentFieldIndex + fieldsPerRow;
            break;
        default:
            nextIndex = currentFieldIndex;
            break;
    }
    return nextIndex;
}

// Function to determine if an input field should be skipped
function shouldSkipField(inputField) {
    if (inputField.readOnly || inputField.type === 'hidden') {
        return true;
    }
    var element = inputField;
    do {
        if (window.getComputedStyle(element).display === 'none' || window.getComputedStyle(element).visibility === 'hidden') {
            return true;
        }
        element = element.parentElement;
    } while (element && !element.matches('body'));
    return false;
}

// Function to find the next eligible field index
function findNextEligibleFieldIndex(fields, currentFieldIndex, direction, fieldsPerRow) {
    let nextIndex = currentFieldIndex;
    let increment = direction === 'left' || direction === 'up' ? -1 : 1;
    let rowChange = direction === 'up' || direction === 'down';

    do {
        nextIndex += rowChange ? fieldsPerRow * increment : increment;
    } while (nextIndex >= 0 && nextIndex < fields.length && shouldSkipField(fields[nextIndex]));

    return nextIndex;
}

// Function to navigate to next/previous input
function navigateToInput(currentInput, direction, fieldsPerRow) {
    var inputs = Array.from(document.querySelectorAll('input[input-type="total"], input[input-type="standard"], input[input-type="contra"]'));
    var currentIndex = inputs.indexOf(currentInput);
    var nextIndex = findNextEligibleFieldIndex(inputs, currentIndex, direction, fieldsPerRow);

    if (nextIndex >= 0 && nextIndex < inputs.length) {
        inputs[nextIndex].focus();
    }
}

// Updated query selector to target inputs with the specified input-types
var allInputs = document.querySelectorAll('input[input-type="total"], input[input-type="standard"], input[input-type="contra"]');

allInputs.forEach(function(input) {
    input.addEventListener('input', function() {
        var originalValue = this.value;
        var originalStart = this.selectionStart;
        var originalEnd = this.selectionEnd;
        var valueLengthBeforeFormat = originalValue.length;

        var numericValue = originalValue.replace(/[^0-9+\-*/.]/g, '');

        if (!/[+\-*/]/.test(numericValue)) {
            this.value = formatNumberWithCommas(numericValue);
        } else {
            this.value = numericValue;
        }

        var valueLengthAfterFormat = this.value.length;
        var originalCommas = (originalValue.substring(0, originalStart).match(/,/g) || []).length;
        var formattedCommas = (this.value.substring(0, originalStart).match(/,/g) || []).length;

        var isCharAdded = valueLengthAfterFormat > valueLengthBeforeFormat;
        var isCharRemoved = valueLengthAfterFormat < valueLengthBeforeFormat;
        var commaDifference = formattedCommas - originalCommas;

        var adjustedStart = originalStart + commaDifference;
        var adjustedEnd = originalEnd + commaDifference;

        if (isCharAdded && originalValue[originalStart - 1] === ',') {
            adjustedStart += 1;
            adjustedEnd += 1;
        } else if (isCharRemoved && originalValue[originalStart] === ',') {
            adjustedStart -= 1;
            adjustedEnd -= 1;
        }

        this.setSelectionRange(adjustedStart, adjustedEnd);

        const closestGroup = this.closest('.field-group, .field-group-contra');
        if (closestGroup && !this.closest('.parent-field')) {
            calculateSumForGroup(closestGroup);
        }
    });

    input.addEventListener('focus', function() {
        this.select();
    });

    input.addEventListener('keydown', function(event) {
        if (["+", "-", "*", "/"].includes(event.key) && this.selectionStart === 0 && this.selectionEnd === this.value.length) {
            event.preventDefault();
            this.value += event.key;
            this.setSelectionRange(this.value.length, this.value.length);
        } else {
            let fieldsPerRow = 1; // Adjusted step count for navigation
            switch (event.key) {
                case 'ArrowLeft':
                case 'a':
                    event.preventDefault();
                    navigateToInput(this, 'left', fieldsPerRow);
                    break;
                case 'ArrowRight':
                case 'd':
                    event.preventDefault();
                    navigateToInput(this, 'right', fieldsPerRow);
                    break;
                case 'ArrowUp':
                case 'w':
                    event.preventDefault();
                    navigateToInput(this, 'up', fieldsPerRow);
                    break;
                case 'ArrowDown':
                case 's':
                    event.preventDefault();
                    navigateToInput(this, 'down', fieldsPerRow);
                    break;
            }
        }
    });

    input.addEventListener('blur', function() {
        var value = this.value.replace(/,/g, '');
        if (/[+\-*/]/.test(value)) {
            try {
                var result = eval(value);
                this.value = formatNumberWithCommas(result);
            } catch (e) {
                console.error("Error in calculation:", e);
            }
        }
    });
});

// Function to attach navigation event listeners to a container
function attachNavigationEventListeners(containerSelectors) {
    // Ensure containerSelectors is always an array, even if a single selector is passed
    const containers = Array.isArray(containerSelectors) ? containerSelectors : [containerSelectors];

    containers.forEach(selector => {
        const container = document.querySelector(selector);
        if (container) {
            const inputs = container.querySelectorAll('input[input-type="total"], input[input-type="standard"], input[input-type="contra"]');
            inputs.forEach(input => {
                input.addEventListener('keydown', function (event) {
                    let fieldsPerRow = 1; // Adjusted step count for navigation
                    switch (event.key) {
                        case 'ArrowLeft':
                            event.preventDefault();
                            navigateToInput(this, 'left', fieldsPerRow);
                            break;
                        case 'ArrowRight':
                            event.preventDefault();
                            navigateToInput(this, 'right', fieldsPerRow);
                            break;
                        case 'ArrowUp':
                            event.preventDefault();
                            navigateToInput(this, 'up', fieldsPerRow);
                            break;
                        case 'ArrowDown':
                            event.preventDefault();
                            navigateToInput(this, 'down', fieldsPerRow);
                            break;
                        case 'Tab':
                            event.preventDefault();
                            var direction = event.shiftKey ? 'left' : 'right';
                            navigateToInput(this, direction, fieldsPerRow);
                            break;
                    }
                });
            });
        }
    });
}

function parseCurrencyValue(value) {
    return parseFloat(value.replace(/,/g, '')) || 0;
}

/// Functions to Handle Auto-Calculation of Months in Period for Future Annualized Statement and Projection Usage ///

// setupConditionalEventListeners Function
function setupConditionalEventListeners() {
    document.querySelectorAll('[var="fiscal-year-end-date"], [var="statement-date"]').forEach(input => {
        input.addEventListener('change', function() {
            let period = input.getAttribute('period');
            let fiscalYearEndDateInput = document.querySelector(`[var="fiscal-year-end-date"][period="${period}"]`);
            let statementDateInput = document.querySelector(`[var="statement-date"][period="${period}"]`);

            if (fiscalYearEndDateInput && fiscalYearEndDateInput.value && statementDateInput && statementDateInput.value) {
                calculateAndDisplayMonthDifferenceForPeriod(period);
            }
        });
    });
}

// calculateAndDisplayMonthDifferenceForPeriod Function
function calculateAndDisplayMonthDifferenceForPeriod(period) {
    let fiscalYearEndDateInput = document.querySelector(`[var="fiscal-year-end-date"][period="${period}"]`);
    let statementDateInput = document.querySelector(`[var="statement-date"][period="${period}"]`);

    if (!fiscalYearEndDateInput || !statementDateInput) {
        console.error("One of the input elements is missing for period", period);
        return;
    }

    // Add event listeners for the blur event on both inputs
    fiscalYearEndDateInput.addEventListener('blur', calculateMonths);
    statementDateInput.addEventListener('blur', calculateMonths);

    function calculateMonths() {
        let fiscalYearEndDateStr = fiscalYearEndDateInput.value;
        let statementDateStr = statementDateInput.value;

        if (!fiscalYearEndDateStr || !statementDateStr) {
            console.error("Fiscal year end date or statement date is missing for period", period);
            return;
        }

        let fiscalYearEndDate = new Date(fiscalYearEndDateStr);
        let statementDate = new Date(statementDateStr);

        let currentYear = statementDate.getFullYear();
        let mmdd = fiscalYearEndDateStr.substring(5);
        let periodStartDate = new Date(`${currentYear}-${mmdd}`); // Set periodStartDate to current year

        console.log(`Period Start Date for period ${period}:`, periodStartDate);

        let monthsInPeriod = calculateMonthsDifference(periodStartDate, statementDate);
        let formattedMonths = formatNumberWithCommas(monthsInPeriod.toFixed(2));

        console.log(`Months in Period for period ${period}:`, monthsInPeriod);
        console.log(`Formatted Months for period ${period}:`, formattedMonths);

        let outputElement = document.querySelector(`[var="calculated-months"][period="${period}"]`);
        if (outputElement) {
            outputElement.value = formattedMonths;
        } else {
            console.error("Output element not found for period", period);
        }
    }
}

//  calculateMonthsDifference Function
function calculateMonthsDifference(startDate, endDate) {
    let startYear = startDate.getFullYear();
    let endYear = endDate.getFullYear();
    let startMonth = startDate.getMonth();
    let endMonth = endDate.getMonth();

    let months = (endYear - startYear) * 12 + (endMonth - startMonth);
    console.log(`Initial months calculation: ${months} months (from ${startYear}-${startMonth + 1} to ${endYear}-${endMonth + 1})`);

    let startDay = startDate.getDate();
    let endDay = endDate.getDate();

    console.log(`Start Day: ${startDay}, End Day: ${endDay}`);
    console.log(`Start Date: ${startDate.toDateString()}, End Date: ${endDate.toDateString()}`);

    if (endDay < startDay) {
        months--;
        console.log(`Month decremented as endDay < startDay (${endDay} < ${startDay})`);
        let daysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate();
        console.log(`Days in Start Month (${startYear}-${startMonth + 1}): ${daysInStartMonth}`);
        endDay += daysInStartMonth;
    }

    let daysDifference = endDay - startDay + 2; // Adds value of "2" to include the endDay and startDay within the calculation
    let daysInEndMonth = new Date(endYear, endMonth + 1, 0).getDate();
    console.log(`Days Difference: ${daysDifference} (from ${startYear}-${startMonth + 1}-${startDay} to ${endYear}-${endMonth + 1}-${endDay}), Days in End Month (${endYear}-${endMonth + 1}): ${daysInEndMonth}`);

    let partialMonth = daysDifference / daysInEndMonth;
    console.log(`Partial month calculation: ${partialMonth} months`);

    let totalMonths = months + partialMonth;
    console.log(`Total months difference: ${totalMonths} months`);

    return totalMonths;
}

// enforceMMDDFormat Function
function enforceMMDDFormat(inputElement) {
    console.log('enforceMMDDFormat called'); // Debugging log
    let value = inputElement.value;
    console.log(`Original value: ${value}`); // Log the original value

    // Try to find MM/DD anywhere within the input
    const mmddPattern = /(\d{2}\/\d{2})/;
    const match = mmddPattern.exec(value);

    if (match) {
        inputElement.value = match[1];
        console.log(`Formatted to MM/DD: ${match[1]}`); // Log the formatted value
    } else {
        console.log('The value does not contain MM/DD'); // Log a warning
    }
}

// Calculates Gross Revenue Subtotal
function updateSubtotal() {
    console.log("Updating subtotal...");

    // Get the period attribute from the input field that triggered the change
    const period = this.getAttribute('period');
    console.log("Period: ", period);

    const group = this.closest('.Gross-Revenue-Input-Group');

    const genericInput = group.querySelector(`input[var="gross-revenue-generic"][period="${period}"]`);
    const genericRevenue = genericInput ? parseCurrencyValue(genericInput.value) : 0;
    console.log("Generic Revenue: ", genericRevenue);

    let customRevenueSum = 0;
    group.querySelectorAll(`input[var="gross-revenue-custom"][period="${period}"]`)
        .forEach(input => {
            let value = parseCurrencyValue(input.value);
            console.log("Custom Revenue Value: ", value);
            customRevenueSum += value;
        });
    console.log("Custom Revenue Sum: ", customRevenueSum);

    const subtotal = genericRevenue + customRevenueSum;
    console.log("Calculated Subtotal: ", subtotal);

    // Apply the formatNumberWithCommas function to the subtotal before updating the field
    const formattedSubtotal = formatNumberWithCommas(subtotal.toFixed(2));

    const subtotalField = group.querySelector(`input[var="gross-revenue-subtotal"][period="${period}"]`);
    if (subtotalField) {
        subtotalField.value = formattedSubtotal;
        console.log("Subtotal updated to: ", subtotalField.value);
    } else {
        console.log("Subtotal field not found");
    }
}

function updateCostOfGoodsSoldSubtotal() {
    console.log("Updating Cost of Goods Sold Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    const group = this.closest('.Cost-of-Goods-Sold-Input-Group');
    const costOfGoodsSoldSubtotalField = group.querySelector(`input[var="cost-of-goods-sold-subtotal"][period="${period}"]`);

    // Check if the subtotal has been manually entered
    if (costOfGoodsSoldSubtotalField.getAttribute('data-manual-entry') === 'true') {
        console.log("Manual entry detected, skipping automatic calculation.");
        return; // Exit the function if manual entry is detected
    }

    // Calculate Cost of Goods Sold Subtotal automatically
    const genericInput = group.querySelector(`input[var="cost-of-goods-sold-generic"][period="${period}"]`);
    const genericCostOfGoodsSold = genericInput ? Math.abs(parseCurrencyValue(genericInput.value)) : 0;

    const depreciationInput = group.querySelector(`input[var="cost-of-goods-sold-depreciation"][period="${period}"]`);
    const depreciationCostOfGoodsSold = depreciationInput ? Math.abs(parseCurrencyValue(depreciationInput.value)) : 0;

    let customCostOfGoodsSoldSum = 0;
    group.querySelectorAll(`input[var="cost-of-goods-sold-custom"][period="${period}"]`)
        .forEach(input => {
            customCostOfGoodsSoldSum += Math.abs(parseCurrencyValue(input.value));
        });

    const costOfGoodsSoldSubtotal = -(genericCostOfGoodsSold + depreciationCostOfGoodsSold + customCostOfGoodsSoldSum);
    costOfGoodsSoldSubtotalField.value = formatNumberWithCommas(costOfGoodsSoldSubtotal.toFixed(2));
}

function updateOtherOperatingExpensesSubtotal() {
    console.log("Updating Other Operating Expenses Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    const group = this.closest('.Other-Operating-Expenses-Input-Group');
    const subtotalField = group.querySelector(`input[var="other-operating-expenses-subtotal"][period="${period}"]`);

    if (subtotalField) {
        const genericInput = group.querySelector(`input[var="other-operating-expenses-generic"][period="${period}"]`);
        const genericOtherOperatingExpenses = genericInput ? parseCurrencyValue(genericInput.value) : 0;
        console.log("Generic Other Operating Expenses: ", genericOtherOperatingExpenses);

        let customOtherOperatingExpensesSum = 0;
        group.querySelectorAll(`input[var="other-operating-expenses-custom"][period="${period}"]`)
            .forEach(input => {
                let value = parseCurrencyValue(input.value);
                console.log("Custom Other Operating Expenses Value: ", value);
                customOtherOperatingExpensesSum += value;
            });
        console.log("Custom Other Operating Expenses Sum: ", customOtherOperatingExpensesSum);

        const otherOperatingExpensesSubtotal = genericOtherOperatingExpenses + customOtherOperatingExpensesSum;
        console.log("Calculated Other Operating Expenses Subtotal: ", otherOperatingExpensesSubtotal);

        subtotalField.value = formatNumberWithCommas(otherOperatingExpensesSubtotal.toFixed(2));
        console.log("Other Operating Expenses Subtotal updated to: ", subtotalField.value);

        // Call the updateTotalOperatingExpenses function to recalculate total operating expenses
        // Ensure this function is defined and handles the recalculation as needed
        updateTotalOperatingExpenses();
    } else {
        console.log("Other Operating Expenses Subtotal field not found");
    }
}

function updateOtherIncomeSubtotal() {
    console.log("Updating Other Income Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    const group = this.closest('.Other-Income-Input-Group');
    const subtotalField = group.querySelector(`input[var="other-income-subtotal"][period="${period}"]`);

    if (subtotalField) {
        const genericInput = group.querySelector(`input[var="other-income-generic"][period="${period}"]`);
        const genericOtherIncome = genericInput ? Math.abs(parseCurrencyValue(genericInput.value)) : 0;
        console.log("Generic Other Income: ", genericOtherIncome);

        let customOtherIncomeSum = 0;
        group.querySelectorAll(`input[var="other-income-custom"][period="${period}"]`)
            .forEach(input => {
                let value = Math.abs(parseCurrencyValue(input.value));
                console.log("Custom Other Income Value: ", value);
                customOtherIncomeSum += value;
            });
        console.log("Custom Other Income Sum: ", customOtherIncomeSum);

        const otherIncomeSubtotal = genericOtherIncome + customOtherIncomeSum;
        console.log("Calculated Other Income Subtotal: ", otherIncomeSubtotal);

        subtotalField.value = formatNumberWithCommas(otherIncomeSubtotal.toFixed(2));
        console.log("Other Income Subtotal updated to: ", subtotalField.value);
    } else {
        console.log("Other Income Subtotal field not found");
    }
}

function updateOtherExpenseSubtotal() {
    console.log("Updating Other Expenses Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    const group = this.closest('.Other-Expenses-Input-Group');
    const subtotalField = group.querySelector(`input[var="other-expenses-subtotal"][period="${period}"]`);

    if (subtotalField && subtotalField.getAttribute('data-manual-entry') !== 'true') {
        const genericInput = group.querySelector(`input[var="other-expenses-generic"][period="${period}"]`);
        const genericOtherExpenses = genericInput ? -Math.abs(parseCurrencyValue(genericInput.value)) : 0;

        let customOtherExpensesSum = 0;
        group.querySelectorAll(`input[var="other-expenses-custom"][period="${period}"]`)
            .forEach(input => {
                customOtherExpensesSum -= Math.abs(parseCurrencyValue(input.value));
            });

        const otherExpensesSubtotal = genericOtherExpenses + customOtherExpensesSum;
        subtotalField.value = formatNumberWithCommas(otherExpensesSubtotal.toFixed(2));
    } else {
        console.log("Manual entry detected or Other Expenses Subtotal field not found");
    }
}


function updateNetRevenue() {
    console.log("Updating net revenue...");

    // Get the period attribute from the input field that triggered the change
    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the "net-revenue" input field for the current period
    const netRevenueField = document.querySelector(`input[var="net-revenue"][period="${period}"]`);

    // Check if netRevenueField is not null or undefined
    if (netRevenueField) {
        // Get the gross revenue subtotal for the current period
        const grossRevenueSubtotalField = document.querySelector(`input[var="gross-revenue-subtotal"][period="${period}"]`);
        const grossRevenueSubtotal = grossRevenueSubtotalField ? parseCurrencyValue(grossRevenueSubtotalField.value) : 0;
        console.log("Gross Revenue Subtotal: ", grossRevenueSubtotal);

        // Get the returns and allowances for the current period
        const returnsAndAllowancesInput = document.querySelector(`input[var="returns-and-allowances"][period="${period}"]`);
        const returnsAndAllowances = returnsAndAllowancesInput ? parseCurrencyValue(returnsAndAllowancesInput.value) : 0;
        console.log("Returns and Allowances: ", returnsAndAllowances);

        // Calculate the net revenue
        const netRevenue = grossRevenueSubtotal - returnsAndAllowances;
        console.log("Calculated Net Revenue: ", netRevenue);

        // Apply the formatNumberWithCommas function to the net revenue before updating the field
        const formattedNetRevenue = formatNumberWithCommas(netRevenue.toFixed(2));

        // Update the "net-revenue" input field
        netRevenueField.value = formattedNetRevenue;
        console.log("Net Revenue updated to: ", netRevenueField.value);
    } else {
        console.log("Net Revenue field not found");
    }
}

function updateGrossProfit() {
    console.log("Updating gross profit...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    const grossProfitField = document.querySelector(`input[var="gross-profit"][period="${period}"]`);

    if (grossProfitField) {
        // Get the gross revenue subtotal for the current period
        const grossRevenueSubtotalField = document.querySelector(`input[var="gross-revenue-subtotal"][period="${period}"]`);
        const grossRevenueSubtotal = grossRevenueSubtotalField ? parseCurrencyValue(grossRevenueSubtotalField.value) : 0;

        // Get the returns and allowances for the current period
        const returnsAndAllowancesField = document.querySelector(`input[var="returns-and-allowances"][period="${period}"]`);
        const returnsAndAllowances = returnsAndAllowancesField ? -Math.abs(parseCurrencyValue(returnsAndAllowancesField.value)) : 0;

        // Get the cost of goods sold subtotal for the current period
        const costOfGoodsSoldSubtotalField = document.querySelector(`input[var="cost-of-goods-sold-subtotal"][period="${period}"]`);
        const costOfGoodsSoldSubtotal = costOfGoodsSoldSubtotalField ? -Math.abs(parseCurrencyValue(costOfGoodsSoldSubtotalField.value)) : 0;

        // Calculate the gross profit
        const grossProfit = grossRevenueSubtotal + returnsAndAllowances + costOfGoodsSoldSubtotal;
        console.log("Calculated Gross Profit: ", grossProfit);

        const formattedGrossProfit = formatNumberWithCommas(grossProfit.toFixed(2));
        grossProfitField.value = formattedGrossProfit;
        console.log("Gross Profit updated to: ", grossProfitField.value);
    } else {
        console.log("Gross Profit field not found");
    }
}

function updateTotalOperatingExpenses() {
    console.log("Updating Total Operating Expenses...");

    // Get the period attribute from the input field that triggered the change
    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Define an array of the input fields that contribute to total operating expenses
    const expenseFields = [
        'salaries-wages-and-payroll-taxes',
        'officer-compensation',
        'repairs-and-maintenance',
        'bad-debt',
        'rent',
        'taxes-and-licenses',
        'interest-expense',
        'depreciation-and-depletion',
        'amortization',
        'retirement-plans',
        'employee-benefits',
        'other-operating-expenses-subtotal'
    ];

    // Initialize the total operating expenses
    let totalOperatingExpenses = 0;

    // Calculate the total operating expenses by summing the values of contributing fields
    expenseFields.forEach(fieldName => {
        const inputField = document.querySelector(`input[var="${fieldName}"][period="${period}"]`);
        if (inputField) {
            const fieldValue = parseCurrencyValue(inputField.value) || 0;
            console.log(`${fieldName}: `, fieldValue);
            totalOperatingExpenses += fieldValue;
        }
    });

    // Update the "total-operating-expenses" input field
    const totalOperatingExpensesField = document.querySelector(`input[var="total-operating-expenses"][period="${period}"]`);
    if (totalOperatingExpensesField) {
        totalOperatingExpensesField.value = formatNumberWithCommas(totalOperatingExpenses.toFixed(2));
        console.log("Total Operating Expenses updated to: ", totalOperatingExpensesField.value);
    } else {
        console.log("Total Operating Expenses field not found");
    }
}

function updateNetOperatingIncome() {
    console.log("Updating Net Operating Income...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    const grossProfitField = document.querySelector(`input[var="gross-profit"][period="${period}"]`);
    const totalOperatingExpensesField = document.querySelector(`input[var="total-operating-expenses"][period="${period}"]`);
    const netOperatingIncomeField = document.querySelector(`input[var="net-operating-income"][period="${period}"]`);

    if (grossProfitField && totalOperatingExpensesField && netOperatingIncomeField) {
        // Get the gross profit for the current period
        const grossProfit = parseCurrencyValue(grossProfitField.value) || 0;
        console.log("Gross Profit: ", grossProfit);

        // Get the total operating expenses for the current period
        const totalOperatingExpenses = parseCurrencyValue(totalOperatingExpensesField.value) || 0;
        console.log("Total Operating Expenses: ", totalOperatingExpenses);

        // Calculate the net operating income
        const netOperatingIncome = grossProfit - totalOperatingExpenses;
        console.log("Calculated Net Operating Income: ", netOperatingIncome);

        // Update the "net-operating-income" input field
        netOperatingIncomeField.value = formatNumberWithCommas(netOperatingIncome.toFixed(2));
        console.log("Net Operating Income updated to: ", netOperatingIncomeField.value);
    } else {
        console.log("Required field(s) not found");
    }
}

function updateTotalOtherIncomeAndExpenses() {
    console.log("Updating Total Other Income and Expenses...");

    // Get the period attribute from the input field that triggered the change
    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the values of the relevant input fields
    const investmentIncomeField = document.querySelector(`input[var="investment-income"][period="${period}"]`);
    const gainOnSaleOfAssetsField = document.querySelector(`input[var="gain-on-sale-of-assets"][period="${period}"]`);
    const otherIncomeSubtotalField = document.querySelector(`input[var="other-income-subtotal"][period="${period}"]`);
    const lossOnSaleOfAssetsField = document.querySelector(`input[var="loss-on-sale-of-assets"][period="${period}"]`);
    const otherExpenseSubtotalField = document.querySelector(`input[var="other-expenses-subtotal"][period="${period}"]`);

    // Parse the values or set them to 0 if not found
    const investmentIncome = investmentIncomeField ? parseCurrencyValue(investmentIncomeField.value) || 0 : 0;
    const gainOnSaleOfAssets = gainOnSaleOfAssetsField ? parseCurrencyValue(gainOnSaleOfAssetsField.value) || 0 : 0;
    const otherIncomeSubtotal = otherIncomeSubtotalField ? parseCurrencyValue(otherIncomeSubtotalField.value) || 0 : 0;
    const lossOnSaleOfAssets = lossOnSaleOfAssetsField ? -Math.abs(parseCurrencyValue(lossOnSaleOfAssetsField.value)) || 0 : 0;
    const otherExpenseSubtotal = otherExpenseSubtotalField ? -Math.abs(parseCurrencyValue(otherExpenseSubtotalField.value)) || 0 : 0;

    console.log("Investment Income: ", investmentIncome);
    console.log("Gain on Sale of Assets: ", gainOnSaleOfAssets);
    console.log("Other Income Subtotal: ", otherIncomeSubtotal);
    console.log("Loss on Sale of Assets: ", lossOnSaleOfAssets);
    console.log("Other Expense Subtotal: ", otherExpenseSubtotal);

    // Calculate Total Other Income and Expenses
    const totalOtherIncomeAndExpenses = investmentIncome + gainOnSaleOfAssets + otherIncomeSubtotal + lossOnSaleOfAssets + otherExpenseSubtotal;
    console.log("Calculated Total Other Income and Expenses: ", totalOtherIncomeAndExpenses);

    // Update the "total-other-income-and-expenses" input field
    const totalOtherIncomeAndExpensesField = document.querySelector(`input[var="total-other-income-and-expenses"][period="${period}"]`);
    if (totalOtherIncomeAndExpensesField) {
        totalOtherIncomeAndExpensesField.value = formatNumberWithCommas(totalOtherIncomeAndExpenses.toFixed(2));
        console.log("Total Other Income and Expenses updated to: ", totalOtherIncomeAndExpensesField.value);
    } else {
        console.log("Total Other Income and Expenses field not found");
    }
}

function updateNetIncome() {
    console.log("Updating Net Income...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the net operating income for the current period
    const netOperatingIncomeField = document.querySelector(`input[var="net-operating-income"][period="${period}"]`);
    const netOperatingIncome = netOperatingIncomeField ? parseCurrencyValue(netOperatingIncomeField.value) || 0 : 0;
    console.log("Net Operating Income: ", netOperatingIncome);

    // Get the total other income and expenses for the current period
    const totalOtherIncomeAndExpensesField = document.querySelector(`input[var="total-other-income-and-expenses"][period="${period}"]`);
    const totalOtherIncomeAndExpenses = totalOtherIncomeAndExpensesField ? parseCurrencyValue(totalOtherIncomeAndExpensesField.value) || 0 : 0;
    console.log("Total Other Income and Expenses: ", totalOtherIncomeAndExpenses);

    // Calculate the net income
    const netIncome = netOperatingIncome + totalOtherIncomeAndExpenses;
    console.log("Calculated Net Income: ", netIncome);

    // Update the "net-profit" input field
    const netProfitField = document.querySelector(`input[var="net-profit"][period="${period}"]`);
    if (netProfitField) {
        netProfitField.value = formatNumberWithCommas(netIncome.toFixed(2));
        console.log("Net Income updated to: ", netProfitField.value);
    } else {
        console.log("Net Profit field not found");
    }
}

function updateNetProfitAfterTaxes() {
    console.log("Updating Net Profit After Taxes...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the net profit for the current period
    const netProfitField = document.querySelector(`input[var="net-profit"][period="${period}"]`);
    const netProfit = netProfitField ? parseCurrencyValue(netProfitField.value) || 0 : 0;
    console.log("Net Profit: ", netProfit);

    // Get the corporate taxes for the current period and negate the absolute value
    const corporateTaxesField = document.querySelector(`input[var="corporate-taxes"][period="${period}"]`);
    const corporateTaxes = corporateTaxesField ? -Math.abs(parseCurrencyValue(corporateTaxesField.value)) : 0;
    console.log("Corporate Taxes: ", corporateTaxes);

    // Get the corporate tax refund for the current period as an absolute value
    const corporateTaxRefundField = document.querySelector(`input[var="corporate-tax-refund"][period="${period}"]`);
    const corporateTaxRefund = corporateTaxRefundField ? Math.abs(parseCurrencyValue(corporateTaxRefundField.value)) : 0;
    console.log("Corporate Tax Refund: ", corporateTaxRefund);

    // Calculate the net profit after taxes
    const netProfitAfterTaxes = netProfit + corporateTaxes + corporateTaxRefund;
    console.log("Calculated Net Profit After Taxes: ", netProfitAfterTaxes);

    // Update the "net-profit-after-taxes" input field
    const netProfitAfterTaxesField = document.querySelector(`input[var="net-profit-after-taxes"][period="${period}"]`);
    if (netProfitAfterTaxesField) {
        netProfitAfterTaxesField.value = formatNumberWithCommas(netProfitAfterTaxes.toFixed(2));
        console.log("Net Profit After Taxes updated to: ", netProfitAfterTaxesField.value);
    } else {
        console.log("Net Profit After Taxes field not found");
    }
}



///LINE BREAK FOR BALANCE SHEET///

///BALANCE SHEET SUBTOTAL FIELDS///
// Cash Subtotal calculation
function updateBalanceSheetCashSubtotal() {
    console.log("Updating Balance Sheet Cash Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic cash for the current period
    const genericCashField = document.querySelector(`input[var="bs-cash-generic"][period="${period}"]`);
    const genericCash = genericCashField ? parseCurrencyValue(genericCashField.value) || 0 : 0;
    console.log("Generic Cash: ", genericCash);

    // Get the additional cash at financial institution for the current period
    const additionalCashField = document.querySelector(`input[var="bs-cash-at-financial-institution"][period="${period}"]`);
    const additionalCash = additionalCashField ? parseCurrencyValue(additionalCashField.value) || 0 : 0;
    console.log("Additional Cash at Financial Institution: ", additionalCash);

    // Get the custom cash for the current period
    const customCashFields = document.querySelectorAll(`input[var="bs-cash-custom"][period="${period}"]`);
    let customCash = 0;
    customCashFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customCash += value;
        }
    });
    console.log("Custom Cash: ", customCash);

    // Calculate the balance sheet cash subtotal
    const cashSubtotal = genericCash + additionalCash + customCash;
    console.log("Calculated Balance Sheet Cash Subtotal: ", cashSubtotal);

    // Update the "bs-cash-subtotal" input field
    const cashSubtotalField = document.querySelector(`input[var="bs-cash-subtotal"][period="${period}"]`);
    if (cashSubtotalField) {
        cashSubtotalField.value = formatNumberWithCommas(cashSubtotal.toFixed(2));
        console.log("Balance Sheet Cash Subtotal updated to: ", cashSubtotalField.value);
    } else {
        console.log("Balance Sheet Cash Subtotal field not found");
    }
}

// Accounts Receivable Subtotal Calculation
function updateBalanceSheetAccountsReceivableSubtotal() {
    console.log("Updating Balance Sheet Accounts Receivable Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic accounts receivable for the current period
    const genericAccountsReceivableField = document.querySelector(`input[var="bs-accounts-receivable-generic"][period="${period}"]`);
    const genericAccountsReceivable = genericAccountsReceivableField ? parseCurrencyValue(genericAccountsReceivableField.value) || 0 : 0;
    console.log("Generic Accounts Receivable: ", genericAccountsReceivable);

    // Get the allowance for doubtful accounts for the current period as an absolute value
    const doubtfulAccountsField = document.querySelector(`input[var="bs-allowance-for-doubtful-accounts"][period="${period}"]`);
    const doubtfulAccounts = doubtfulAccountsField ? Math.abs(parseCurrencyValue(doubtfulAccountsField.value)) || 0 : 0;
    console.log("Allowance for Doubtful Accounts: ", doubtfulAccounts);

    // Get the custom accounts receivable for the current period
    const customAccountsReceivableFields = document.querySelectorAll(`input[var="bs-accounts-receivable-custom"][period="${period}"]`);
    let customAccountsReceivable = 0;
    customAccountsReceivableFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customAccountsReceivable += value;
        }
    });
    console.log("Custom Accounts Receivable: ", customAccountsReceivable);

    // Calculate the balance sheet accounts receivable subtotal
    const accountsReceivableSubtotal = genericAccountsReceivable - doubtfulAccounts + customAccountsReceivable;
    console.log("Calculated Balance Sheet Accounts Receivable Subtotal: ", accountsReceivableSubtotal);

    // Update the "bs-accounts-receivable-subtotal" input field
    const accountsReceivableSubtotalField = document.querySelector(`input[var="bs-accounts-receivable-subtotal"][period="${period}"]`);
    if (accountsReceivableSubtotalField) {
        accountsReceivableSubtotalField.value = formatNumberWithCommas(accountsReceivableSubtotal.toFixed(2));
        console.log("Balance Sheet Accounts Receivable Subtotal updated to: ", accountsReceivableSubtotalField.value);
    } else {
        console.log("Balance Sheet Accounts Receivable Subtotal field not found");
    }
}


//Inventory Subtotal Calculation
function updateBalanceSheetInventorySubtotal() {
    console.log("Updating Balance Sheet Inventory Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic inventory for the current period
    const genericInventoryField = document.querySelector(`input[var="bs-inventory-generic"][period="${period}"]`);
    const genericInventory = genericInventoryField ? parseCurrencyValue(genericInventoryField.value) || 0 : 0;
    console.log("Generic Inventory: ", genericInventory);

    // Get the raw materials inventory for the current period
    const rawMaterialsInventoryField = document.querySelector(`input[var="bs-inventory-raw-materials"][period="${period}"]`);
    const rawMaterialsInventory = rawMaterialsInventoryField ? parseCurrencyValue(rawMaterialsInventoryField.value) || 0 : 0;
    console.log("Raw Materials Inventory: ", rawMaterialsInventory);

    // Get the work in progress inventory for the current period
    const workInProgressInventoryField = document.querySelector(`input[var="bs-inventory-work-in-progress"][period="${period}"]`);
    const workInProgressInventory = workInProgressInventoryField ? parseCurrencyValue(workInProgressInventoryField.value) || 0 : 0;
    console.log("Work In Progress Inventory: ", workInProgressInventory);

    // Get the finished goods inventory for the current period
    const finishedGoodsInventoryField = document.querySelector(`input[var="bs-inventory-finished-goods"][period="${period}"]`);
    const finishedGoodsInventory = finishedGoodsInventoryField ? parseCurrencyValue(finishedGoodsInventoryField.value) || 0 : 0;
    console.log("Finished Goods Inventory: ", finishedGoodsInventory);

    // Get the in transit inventory for the current period
    const inTransitInventoryField = document.querySelector(`input[var="bs-inventory-in-transit"][period="${period}"]`);
    const inTransitInventory = inTransitInventoryField ? parseCurrencyValue(inTransitInventoryField.value) || 0 : 0;
    console.log("In Transit Inventory: ", inTransitInventory);

    // Get the custom inventory for the current period
    const customInventoryFields = document.querySelectorAll(`input[var="bs-inventory-custom"][period="${period}"]`);
    let customInventory = 0;
    customInventoryFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customInventory += value;
        }
    });
    console.log("Custom Inventory: ", customInventory);

    // Calculate the balance sheet inventory subtotal
    const inventorySubtotal = genericInventory + rawMaterialsInventory + workInProgressInventory + finishedGoodsInventory + inTransitInventory + customInventory;
    console.log("Calculated Balance Sheet Inventory Subtotal: ", inventorySubtotal);

    // Update the "bs-inventory-subtotal" input field
    const inventorySubtotalField = document.querySelector(`input[var="bs-inventory-subtotal"][period="${period}"]`);
    if (inventorySubtotalField) {
        inventorySubtotalField.value = formatNumberWithCommas(inventorySubtotal.toFixed(2));
        console.log("Balance Sheet Inventory Subtotal updated to: ", inventorySubtotalField.value);
    } else {
        console.log("Balance Sheet Inventory Subtotal field not found");
    }
}

// Other Current Assets Subtotal Calculation
function updateBalanceSheetOtherCurrentAssetsSubtotal() {
    console.log("Updating Balance Sheet Other Current Assets Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic other current assets for the current period
    const genericOtherCurrentAssetsField = document.querySelector(`input[var="bs-other-current-assets-generic"][period="${period}"]`);
    const genericOtherCurrentAssets = genericOtherCurrentAssetsField ? parseCurrencyValue(genericOtherCurrentAssetsField.value) || 0 : 0;
    console.log("Generic Other Current Assets: ", genericOtherCurrentAssets);

    // Get the deposits for the current period
    const depositsField = document.querySelector(`input[var="bs-other-current-assets-deposits"][period="${period}"]`);
    const deposits = depositsField ? parseCurrencyValue(depositsField.value) || 0 : 0;
    console.log("Deposits: ", deposits);

    // Get the other current assets for the current period
    const otherCurrentAssetsFields = document.querySelectorAll(`input[var="bs-other-current-assets-custom"][period="${period}"]`);
    let otherCurrentAssets = 0;
    otherCurrentAssetsFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            otherCurrentAssets += value;
        }
    });
    console.log("Other Current Assets: ", otherCurrentAssets);

    // Calculate the balance sheet other current assets subtotal
    const otherCurrentAssetsSubtotal = genericOtherCurrentAssets + deposits + otherCurrentAssets;
    console.log("Calculated Balance Sheet Other Current Assets Subtotal: ", otherCurrentAssetsSubtotal);

    // Update the "bs-other-current-assets-subtotal" input field
    const otherCurrentAssetsSubtotalField = document.querySelector(`input[var="bs-other-current-assets-subtotal"][period="${period}"]`);
    if (otherCurrentAssetsSubtotalField) {
        otherCurrentAssetsSubtotalField.value = formatNumberWithCommas(otherCurrentAssetsSubtotal.toFixed(2));
        console.log("Balance Sheet Other Current Assets Subtotal updated to: ", otherCurrentAssetsSubtotalField.value);
    } else {
        console.log("Balance Sheet Other Current Assets Subtotal field not found");
    }
}

// Property, Plant, and Equipment Subtotal Calculation
function updatePropertyPlantEquipmentSubtotal() {
    console.log("Updating Property, Plant, and Equipment Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic property, plant, and equipment for the current period
    const genericPPEField = document.querySelector(`input[var="bs-property-plant-and-equipment-generic"][period="${period}"]`);
    const genericPPE = genericPPEField ? parseCurrencyValue(genericPPEField.value) || 0 : 0;
    console.log("Generic Property, Plant, and Equipment: ", genericPPE);

    // Get the machinery and equipment for the current period
    const machineryEquipmentField = document.querySelector(`input[var="bs-machinery-and-equipment"][period="${period}"]`);
    const machineryEquipment = machineryEquipmentField ? parseCurrencyValue(machineryEquipmentField.value) || 0 : 0;
    console.log("Machinery and Equipment: ", machineryEquipment);

    // Get the titled vehicles for the current period
    const titledVehiclesField = document.querySelector(`input[var="bs-titled-vehicles"][period="${period}"]`);
    const titledVehicles = titledVehiclesField ? parseCurrencyValue(titledVehiclesField.value) || 0 : 0;
    console.log("Titled Vehicles: ", titledVehicles);

    // Get the computer and office equipment for the current period
    const computerOfficeEquipmentField = document.querySelector(`input[var="bs-computer-and-office-equipment"][period="${period}"]`);
    const computerOfficeEquipment = computerOfficeEquipmentField ? parseCurrencyValue(computerOfficeEquipmentField.value) || 0 : 0;
    console.log("Computer and Office Equipment: ", computerOfficeEquipment);

    // Get the leasehold improvements for the current period
    const leaseholdImprovementsField = document.querySelector(`input[var="bs-leasehold-improvements"][period="${period}"]`);
    const leaseholdImprovements = leaseholdImprovementsField ? parseCurrencyValue(leaseholdImprovementsField.value) || 0 : 0;
    console.log("Leasehold Improvements: ", leaseholdImprovements);

    // Get the buildings for the current period
    const buildingsField = document.querySelector(`input[var="bs-buildings"][period="${period}"]`);
    const buildings = buildingsField ? parseCurrencyValue(buildingsField.value) || 0 : 0;
    console.log("Buildings: ", buildings);

    // Get the construction in progress for the current period
    const constructionInProgressField = document.querySelector(`input[var="bs-construction-in-progress"][period="${period}"]`);
    const constructionInProgress = constructionInProgressField ? parseCurrencyValue(constructionInProgressField.value) || 0 : 0;
    console.log("Construction In Progress: ", constructionInProgress);

    // Get the custom property, plant, and equipment for the current period
    const customPPEFields = document.querySelectorAll(`input[var="bs-property-plant-and-equipment-custom"][period="${period}"]`);
    let customPPE = 0;
    customPPEFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customPPE += value;
        }
    });

    // Calculate the property, plant, and equipment subtotal
    const PPEsubtotal = genericPPE + machineryEquipment + titledVehicles + computerOfficeEquipment + leaseholdImprovements + buildings + constructionInProgress + customPPE;
    console.log("Calculated Property, Plant, and Equipment Subtotal: ", PPEsubtotal);

    // Update the "bs-property-plant-and-equipment-subtotal" input field
    const PPEsubtotalField = document.querySelector(`input[var="bs-property-plant-and-equipment-subtotal"][period="${period}"]`);
    if (PPEsubtotalField) {
        PPEsubtotalField.value = formatNumberWithCommas(PPEsubtotal.toFixed(2));
        console.log("Property, Plant, and Equipment Subtotal updated to: ", PPEsubtotalField.value);
    } else {
        console.log("Property, Plant, and Equipment Subtotal field not found");
    }
}

// Intangible Assets Subtotal Calculation
function updateIntangibleAssetsSubtotal() {
    console.log("Updating Intangible Assets Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic intangible assets for the current period
    const genericIntangibleAssetsField = document.querySelector(`input[var="bs-intangible-assets-generic"][period="${period}"]`);
    const genericIntangibleAssets = genericIntangibleAssetsField ? parseCurrencyValue(genericIntangibleAssetsField.value) || 0 : 0;
    console.log("Generic Intangible Assets: ", genericIntangibleAssets);

    // Get the trademarks and licenses for the current period
    const trademarksAndLicensesField = document.querySelector(`input[var="bs-intangible-assets-trademarks-and-licenses"][period="${period}"]`);
    const trademarksAndLicenses = trademarksAndLicensesField ? parseCurrencyValue(trademarksAndLicensesField.value) || 0 : 0;
    console.log("Trademarks and Licenses: ", trademarksAndLicenses);

    // Get the financing costs for the current period
    const financingCostsField = document.querySelector(`input[var="bs-intangible-assets-financing-costs"][period="${period}"]`);
    const financingCosts = financingCostsField ? parseCurrencyValue(financingCostsField.value) || 0 : 0;
    console.log("Financing Costs: ", financingCosts);

    // Get the custom intangible assets for the current period
    const customIntangibleAssetsFields = document.querySelectorAll(`input[var="bs-inangible-assets-custom"][period="${period}"]`);
    let customIntangibleAssets = 0;
    customIntangibleAssetsFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customIntangibleAssets += value;
        }
    });
    console.log("Custom Intangible Assets: ", customIntangibleAssets);

    // Calculate the intangible assets subtotal
    const intangibleAssetsSubtotal = genericIntangibleAssets + trademarksAndLicenses + financingCosts + customIntangibleAssets;
    console.log("Calculated Intangible Assets Subtotal: ", intangibleAssetsSubtotal);

    // Update the "bs-intangible-assets-subtotal" input field
    const intangibleAssetsSubtotalField = document.querySelector(`input[var="bs-intangible-assets-subtotal"][period="${period}"]`);
    if (intangibleAssetsSubtotalField) {
        intangibleAssetsSubtotalField.value = formatNumberWithCommas(intangibleAssetsSubtotal.toFixed(2));
        console.log("Intangible Assets Subtotal updated to: ", intangibleAssetsSubtotalField.value);
    } else {
        console.log("Intangible Assets Subtotal field not found");
    }
}

// Due from Related Parties Calculation
function updateDueFromRelatedPartiesSubtotal() {
    console.log("Updating Due From Related Parties Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic due from related parties for the current period
    const genericDueFromRelatedPartiesField = document.querySelector(`input[var="bs-due-from-related-parties-generic"][period="${period}"]`);
    const genericDueFromRelatedParties = genericDueFromRelatedPartiesField ? parseCurrencyValue(genericDueFromRelatedPartiesField.value) || 0 : 0;
    console.log("Generic Due From Related Parties: ", genericDueFromRelatedParties);

    // Get the custom due from related parties for the current period
    const customDueFromRelatedPartiesFields = document.querySelectorAll(`input[var="bs-due-from-related-parties-custom"][period="${period}"]`);
    let customDueFromRelatedParties = 0;
    customDueFromRelatedPartiesFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customDueFromRelatedParties += value;
        }
    });
    console.log("Custom Due From Related Parties: ", customDueFromRelatedParties);

    // Calculate the due from related parties subtotal
    const dueFromRelatedPartiesSubtotal = genericDueFromRelatedParties + customDueFromRelatedParties;
    console.log("Calculated Due From Related Parties Subtotal: ", dueFromRelatedPartiesSubtotal);

    // Update the "bs-due-from-related-parties-subtotal" input field
    const dueFromRelatedPartiesSubtotalField = document.querySelector(`input[var="bs-due-from-related-parties-subtotal"][period="${period}"]`);
    if (dueFromRelatedPartiesSubtotalField) {
        dueFromRelatedPartiesSubtotalField.value = formatNumberWithCommas(dueFromRelatedPartiesSubtotal.toFixed(2));
        console.log("Due From Related Parties Subtotal updated to: ", dueFromRelatedPartiesSubtotalField.value);
    } else {
        console.log("Due From Related Parties Subtotal field not found");
    }
}

// Due from Shareholders Subtotal
function updateDueFromShareholdersSubtotal() {
    console.log("Updating Due From Related Parties Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic due from shareholders for the current period
    const genericDueFromShareholdersField = document.querySelector(`input[var="bs-due-from-shareholders-generic"][period="${period}"]`);
    const genericDueFromShareholders = genericDueFromShareholdersField ? parseCurrencyValue(genericDueFromShareholdersField.value) || 0 : 0;
    console.log("Generic Due From Shareholders: ", genericDueFromShareholders);

    // Get the custom due from shareholders for the current period
    const customDueFromShareholdersFields = document.querySelectorAll(`input[var="bs-due-from-shareholders-custom"][period="${period}"]`);
    let customDueFromShareholders = 0;
    customDueFromShareholdersFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customDueFromShareholders += value;
        }
    });
    console.log("Custom Due From Shareholders: ", customDueFromShareholders);

    // Calculate the due from related parties subtotal
    const dueFromShareholdersSubtotal = genericDueFromShareholders + customDueFromShareholders;
    console.log("Calculated Due From Related Parties Subtotal: ", dueFromShareholdersSubtotal);

    // Update the "bs-due-from-shareholders-subtotal" input field
    const dueFromShareholdersSubtotalField = document.querySelector(`input[var="bs-due-from-shareholders-subtotal"][period="${period}"]`);
    if (dueFromShareholdersSubtotalField) {
        dueFromShareholdersSubtotalField.value = formatNumberWithCommas(dueFromShareholdersSubtotal.toFixed(2));
        console.log("Due From Related Parties Subtotal updated to: ", dueFromShareholdersSubtotalField.value);
    } else {
        console.log("Due From Related Parties Subtotal field not found");
    }
}

// Other Long Term Assets Subtotal
function updateOtherLongTermAssetsSubtotal() {
    console.log("Updating Other Long Term Assets Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic other long-term assets for the current period
    const genericOtherLongTermAssetsField = document.querySelector(`input[var="bs-other-long-term-assets-generic"][period="${period}"]`);
    const genericOtherlongTermAssets = genericOtherLongTermAssetsField ? parseCurrencyValue(genericOtherLongTermAssetsField.value) || 0 : 0;
    console.log("Generic Other Current Assets: ", genericOtherlongTermAssets);

    // Get the custom other long-term for the current period
    const customOtherLongTermAssetsFields = document.querySelectorAll(`input[var="bs-other-long-term-assets-custom"][period="${period}"]`);
    let customOtherLongTermAssets = 0;
    customOtherLongTermAssetsFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customOtherLongTermAssets += value;
        }
    });
    console.log("Custom Other Current Assets: ", customOtherLongTermAssets);

    // Calculate the other long term assets subtotal
    const otherLongTermAssetsSubtotal = genericOtherlongTermAssets + customOtherLongTermAssets;
    console.log("Calculated Other Long Term Assets Subtotal: ", otherLongTermAssetsSubtotal);

    // Update the "bs-other-long-term-assets-subtotal" input field
    const otherLongTermAssetsSubtotalField = document.querySelector(`input[var="bs-other-long-term-assets-subtotal"][period="${period}"]`);
    if (otherLongTermAssetsSubtotalField) {
        otherLongTermAssetsSubtotalField.value = formatNumberWithCommas(otherLongTermAssetsSubtotal.toFixed(2));
        console.log("Other Long Term Assets Subtotal updated to: ", otherLongTermAssetsSubtotalField.value);
    } else {
        console.log("Other Long Term Assets Subtotal field not found");
    }
}

// Accounts Payable Subtotal
function updateAccountsPayableSubtotal() {
    console.log("Updating Accounts Payable Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the accounts payable trade for the current period
    const accountsPayableTradeField = document.querySelector(`input[var="bs-accounts-payable-trade"][period="${period}"]`);
    const accountsPayableTrade = accountsPayableTradeField ? parseCurrencyValue(accountsPayableTradeField.value) || 0 : 0;
    console.log("Accounts Payable Trade: ", accountsPayableTrade);

    // Get the accounts payable other for the current period
    const accountsPayableOtherField = document.querySelector(`input[var="bs-accounts-payable-other"][period="${period}"]`);
    const accountsPayableOther = accountsPayableOtherField ? parseCurrencyValue(accountsPayableOtherField.value) || 0 : 0;
    console.log("Accounts Payable Other: ", accountsPayableOther);

    // Get the custom accounts payable for the current period
    const accountsPayableCustomFields = document.querySelectorAll(`input[var="bs-accounts-payable-custom"][period="${period}"]`);
    let accountsPayableCustom = 0;
    accountsPayableCustomFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            accountsPayableCustom += value;
        }
    });
    console.log("Custom Accounts Payable: ", accountsPayableCustom);

    // Calculate the accounts payable subtotal
    const accountsPayableSubtotal = accountsPayableTrade + accountsPayableOther + accountsPayableCustom;
    console.log("Calculated Accounts Payable Subtotal: ", accountsPayableSubtotal);

    // Update the "bs-accounts-payable-subtotal" input field
    const accountsPayableSubtotalField = document.querySelector(`input[var="bs-accounts-payable-subtotal"][period="${period}"]`);
    if (accountsPayableSubtotalField) {
        accountsPayableSubtotalField.value = formatNumberWithCommas(accountsPayableSubtotal.toFixed(2));
        console.log("Accounts Payable Subtotal updated to: ", accountsPayableSubtotalField.value);
    } else {
        console.log("Accounts Payable Subtotal field not found");
    }
}

// Current Portion of Long-Term Liabilities Subtotal
function updateCurrentPortionOfLongTermLiabilitiesSubtotal() {
    console.log("Updating Current Portion of Long-Term Liabilities Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the current portion of long-term debt for the current period
    const currentPortionOfLongTermDebtField = document.querySelector(`input[var="bs-current-portion-of-long-term-debt"][period="${period}"]`);
    const currentPortionOfLongTermDebt = currentPortionOfLongTermDebtField ? parseCurrencyValue(currentPortionOfLongTermDebtField.value) || 0 : 0;
    console.log("Current Portion of Long-Term Debt: ", currentPortionOfLongTermDebt);

    // Get the current portion of long-term capital leases for the current period
    const currentPortionOfLongTermCapitalLeasesField = document.querySelector(`input[var="bs-current-portion-of-long-term-capital-leases"][period="${period}"]`);
    const currentPortionOfLongTermCapitalLeases = currentPortionOfLongTermCapitalLeasesField ? parseCurrencyValue(currentPortionOfLongTermCapitalLeasesField.value) || 0 : 0;
    console.log("Current Portion of Long-Term Capital Leases: ", currentPortionOfLongTermCapitalLeases);

    // Get the custom current portion of long-term liabilities for the current period
    const customCurrentPortionOfLongTermLiabilitiesFields = document.querySelectorAll(`input[var$="bs-current-portion-of-long-term-liabilities-custom"][period="${period}"]`);
    let customCurrentPortionOfLongTermLiabilities = 0;
    customCurrentPortionOfLongTermLiabilitiesFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customCurrentPortionOfLongTermLiabilities += value;
        }
    });
    console.log("Custom Current Portion of Long-Term Liabilities: ", customCurrentPortionOfLongTermLiabilities);

    // Calculate the current portion of long-term liabilities subtotal
    const currentPortionOfLongTermLiabilitiesSubtotal = currentPortionOfLongTermDebt + currentPortionOfLongTermCapitalLeases + customCurrentPortionOfLongTermLiabilities;
    console.log("Calculated Current Portion of Long-Term Liabilities Subtotal: ", currentPortionOfLongTermLiabilitiesSubtotal);

    // Update the "bs-current-portion-of-long-term-liabilities-subtotal" input field
    const currentPortionOfLongTermLiabilitiesSubtotalField = document.querySelector(`input[var="bs-current-portion-of-long-term-liabilities-subtotal"][period="${period}"]`);
    if (currentPortionOfLongTermLiabilitiesSubtotalField) {
        currentPortionOfLongTermLiabilitiesSubtotalField.value = formatNumberWithCommas(currentPortionOfLongTermLiabilitiesSubtotal.toFixed(2));
        console.log("Current Portion of Long-Term Liabilities Subtotal updated to: ", currentPortionOfLongTermLiabilitiesSubtotalField.value);
    } else {
        console.log("Current Portion of Long-Term Liabilities Subtotal field not found");
    }
}

// Revolving Lines of Credit Subtotal
function updateRevolvingLinesOfCreditSubtotal() {
    console.log("Updating Revolving Lines of Credit Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic revolving lines of credit for the current period
    const genericRevolvingLinesOfCreditField = document.querySelector(`input[var="bs-revolving-lines-of-credit-generic"][period="${period}"]`);
    const genericRevolvingLinesOfCredit = genericRevolvingLinesOfCreditField ? parseCurrencyValue(genericRevolvingLinesOfCreditField.value) || 0 : 0;
    console.log("Generic Revolving Lines of Credit: ", genericRevolvingLinesOfCredit);

    // Get the promissory note lines of credit for the current period
    const promissoryNoteLinesOfCreditField = document.querySelector(`input[var="bs-promissory-note-lines-of-credit"][period="${period}"]`);
    const promissoryNoteLinesOfCredit = promissoryNoteLinesOfCreditField ? parseCurrencyValue(promissoryNoteLinesOfCreditField.value) || 0 : 0;
    console.log("Promissory Note Lines of Credit: ", promissoryNoteLinesOfCredit);

    // Get the credit cards for the current period
    const creditCardsField = document.querySelector(`input[var="bs-credit-cards"][period="${period}"]`);
    const creditCards = creditCardsField ? parseCurrencyValue(creditCardsField.value) || 0 : 0;
    console.log("Credit Cards: ", creditCards);

    // Get the custom revolving lines of credit for the current period
    const customRevolvingLinesOfCreditFields = document.querySelectorAll(`input[var="bs-revolving-lines-of-credit-custom"][period="${period}"]`);
    let customRevolvingLinesOfCredit = 0;
    customRevolvingLinesOfCreditFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customRevolvingLinesOfCredit += value;
        }
    });
    console.log("Custom Revolving Lines of Credit: ", customRevolvingLinesOfCredit);

    // Calculate the revolving lines of credit subtotal
    const revolvingLinesOfCreditSubtotal = genericRevolvingLinesOfCredit + promissoryNoteLinesOfCredit + creditCards + customRevolvingLinesOfCredit;
    console.log("Calculated Revolving Lines of Credit Subtotal: ", revolvingLinesOfCreditSubtotal);

    // Update the "bs-revolving-lines-of-credit-subtotal" input field
    const revolvingLinesOfCreditSubtotalField = document.querySelector(`input[var="bs-revolving-lines-of-credit-subtotal"][period="${period}"]`);
    if (revolvingLinesOfCreditSubtotalField) {
        revolvingLinesOfCreditSubtotalField.value = formatNumberWithCommas(revolvingLinesOfCreditSubtotal.toFixed(2));
        console.log("Revolving Lines of Credit Subtotal updated to: ", revolvingLinesOfCreditSubtotalField.value);
    } else {
        console.log("Revolving Lines of Credit Subtotal field not found");
    }
}

// Accrual Liabilities Subtotal
function updateAccrualLiabilitiesSubtotal() {
    console.log("Updating Accrual Liabilities Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic accrual liabilities for the current period
    const genericAccrualLiabilitiesField = document.querySelector(`input[var="bs-accrual-liabilities-generic"][period="${period}"]`);
    const genericAccrualLiabilities = genericAccrualLiabilitiesField ? parseCurrencyValue(genericAccrualLiabilitiesField.value) || 0 : 0;
    console.log("Generic Accrual Liabilities: ", genericAccrualLiabilities);

    // Get the customer advances for accrual liabilities for the current period
    const customerAdvancesField = document.querySelector(`input[var="bs-accrual-liabilities-customer-advances"][period="${period}"]`);
    const customerAdvances = customerAdvancesField ? parseCurrencyValue(customerAdvancesField.value) || 0 : 0;
    console.log("Customer Advances for Accrual Liabilities: ", customerAdvances);

    // Get the custom accrual liabilities for the current period
    const customAccrualLiabilitiesFields = document.querySelectorAll(`input[var="bs-accrual-liabilities-custom"][period="${period}"]`);
    let customAccrualLiabilities = 0;
    customAccrualLiabilitiesFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customAccrualLiabilities += value;
        }
    });
    console.log("Custom Accrual Liabilities: ", customAccrualLiabilities);

    // Calculate the accrual liabilities subtotal
    const accrualLiabilitiesSubtotal = genericAccrualLiabilities + customerAdvances + customAccrualLiabilities;
    console.log("Calculated Accrual Liabilities Subtotal: ", accrualLiabilitiesSubtotal);

    // Update the "bs-accrual-liabilities-subtotal" input field
    const accrualLiabilitiesSubtotalField = document.querySelector(`input[var="bs-accrual-liabilities-subtotal"][period="${period}"]`);
    if (accrualLiabilitiesSubtotalField) {
        accrualLiabilitiesSubtotalField.value = formatNumberWithCommas(accrualLiabilitiesSubtotal.toFixed(2));
        console.log("Accrual Liabilities Subtotal updated to: ", accrualLiabilitiesSubtotalField.value);
    } else {
        console.log("Accrual Liabilities Subtotal field not found");
    }
}

// Other Current Liabilities Subtotal
function updateOtherCurrentLiabilitiesSubtotal() {
    console.log("Updating Other Current Liabilities Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic other current liabilities for the current period
    const genericOtherCurrentLiabilitiesField = document.querySelector(`input[var="bs-other-current-liabilities-generic"][period="${period}"]`);
    const genericOtherCurrentLiabilities = genericOtherCurrentLiabilitiesField ? parseCurrencyValue(genericOtherCurrentLiabilitiesField.value) || 0 : 0;
    console.log("Generic Other Current Liabilities: ", genericOtherCurrentLiabilities);

    // Get the tax liabilities for the current period
    const taxLiabilitiesField = document.querySelector(`input[var="bs-tax-liabilities"][period="${period}"]`);
    const taxLiabilities = taxLiabilitiesField ? parseCurrencyValue(taxLiabilitiesField.value) || 0 : 0;
    console.log("Tax Liabilities: ", taxLiabilities);

    // Get the payroll liabilities for the current period
    const payrollLiabilitiesField = document.querySelector(`input[var="bs-payroll-liabilities"][period="${period}"]`);
    const payrollLiabilities = payrollLiabilitiesField ? parseCurrencyValue(payrollLiabilitiesField.value) || 0 : 0;
    console.log("Payroll Liabilities: ", payrollLiabilities);

    // Get the custom other current liabilities for the current period
    const customOtherCurrentLiabilitiesFields = document.querySelectorAll(`input[var="bs-other-current-liabilities-custom"][period="${period}"]`);
    let customOtherCurrentLiabilities = 0;
    customOtherCurrentLiabilitiesFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customOtherCurrentLiabilities += value;
        }
    });
    console.log("Custom Other Current Liabilities: ", customOtherCurrentLiabilities);

    // Calculate the other current liabilities subtotal
    const otherCurrentLiabilitiesSubtotal = genericOtherCurrentLiabilities + taxLiabilities + payrollLiabilities + customOtherCurrentLiabilities;
    console.log("Calculated Other Current Liabilities Subtotal: ", otherCurrentLiabilitiesSubtotal);

    // Update the "bs-other-current-liabilities-subtotal" input field
    const otherCurrentLiabilitiesSubtotalField = document.querySelector(`input[var="bs-other-current-liabilities-subtotal"][period="${period}"]`);
    if (otherCurrentLiabilitiesSubtotalField) {
        otherCurrentLiabilitiesSubtotalField.value = formatNumberWithCommas(otherCurrentLiabilitiesSubtotal.toFixed(2));
        console.log("Other Current Liabilities Subtotal updated to: ", otherCurrentLiabilitiesSubtotalField.value);
    } else {
        console.log("Other Current Liabilities Subtotal field not found");
    }
}

// Long-Term Debt to be Refinanced Subtotal Calculation
function updateLongTermDebtToBeRefinancedSubtotal() {
    console.log("Updating Long-Term Debt to Be Refinanced Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic long-term debt to be refinanced for the current period
    const genericLongTermDebtToBeRefinancedField = document.querySelector(`input[var="bs-long-term-debt-to-be-refinanced-generic"][period="${period}"]`);
    const genericLongTermDebtToBeRefinanced = genericLongTermDebtToBeRefinancedField ? parseCurrencyValue(genericLongTermDebtToBeRefinancedField.value) || 0 : 0;
    console.log("Generic Long-Term Debt to Be Refinanced: ", genericLongTermDebtToBeRefinanced);

    // Get the custom long-term debt to be refinanced for the current period
    const customLongTermDebtToBeRefinancedFields = document.querySelectorAll(`input[var="bs-long-term-debt-to-be-refinanced-custom"][period="${period}"]`);
    let customLongTermDebtToBeRefinanced = 0;
    customLongTermDebtToBeRefinancedFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customLongTermDebtToBeRefinanced += value;
        }
    });
    console.log("Custom Long-Term Debt to Be Refinanced: ", customLongTermDebtToBeRefinanced);

    // Calculate the long-term debt to be refinanced subtotal
    const longTermDebtToBeRefinancedSubtotal = genericLongTermDebtToBeRefinanced + customLongTermDebtToBeRefinanced;
    console.log("Calculated Long-Term Debt to Be Refinanced Subtotal: ", longTermDebtToBeRefinancedSubtotal);

    // Update the "bs-long-term-debt-to-be-refinanced-subtotal" input field
    const longTermDebtToBeRefinancedSubtotalField = document.querySelector(`input[var="bs-long-term-debt-to-be-refinanced-subtotal"][period="${period}"]`);
    if (longTermDebtToBeRefinancedSubtotalField) {
        longTermDebtToBeRefinancedSubtotalField.value = formatNumberWithCommas(longTermDebtToBeRefinancedSubtotal.toFixed(2));
        console.log("Long-Term Debt to Be Refinanced Subtotal updated to: ", longTermDebtToBeRefinancedSubtotalField.value);
    } else {
        console.log("Long-Term Debt to Be Refinanced Subtotal field not found");
    }
}

// Other Long-Term Notes Payable Subtotal Calculation
function updateOtherLongTermNotesPayableSubtotal() {
    console.log("Updating Other Long-Term Notes Payable Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic other long-term notes payable for the current period
    const genericOtherLongTermNotesPayableField = document.querySelector(`input[var="bs-other-long-term-notes-payable-generic"][period="${period}"]`);
    const genericOtherLongTermNotesPayable = genericOtherLongTermNotesPayableField ? parseCurrencyValue(genericOtherLongTermNotesPayableField.value) || 0 : 0;
    console.log("Generic Other Long-Term Notes Payable: ", genericOtherLongTermNotesPayable);

    // Get the custom other long-term notes payable for the current period
    const customOtherLongTermNotesPayableFields = document.querySelectorAll(`input[var="bs-other-long-term-notes-payable-custom"][period="${period}"]`);
    let customOtherLongTermNotesPayable = 0;
    customOtherLongTermNotesPayableFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customOtherLongTermNotesPayable += value;
        }
    });
    console.log("Custom Other Long-Term Notes Payable: ", customOtherLongTermNotesPayable);

    // Calculate the other long-term notes payable subtotal
    const otherLongTermNotesPayableSubtotal = genericOtherLongTermNotesPayable + customOtherLongTermNotesPayable;
    console.log("Calculated Other Long-Term Notes Payable Subtotal: ", otherLongTermNotesPayableSubtotal);

    // Update the "bs-other-long-term-notes-payable-subtotal" input field
    const otherLongTermNotesPayableSubtotalField = document.querySelector(`input[var="bs-other-long-term-notes-payable-subtotal"][period="${period}"]`);
    if (otherLongTermNotesPayableSubtotalField) {
        otherLongTermNotesPayableSubtotalField.value = formatNumberWithCommas(otherLongTermNotesPayableSubtotal.toFixed(2));
        console.log("Other Long-Term Notes Payable Subtotal updated to: ", otherLongTermNotesPayableSubtotalField.value);
    } else {
        console.log("Other Long-Term Notes Payable Subtotal field not found");
    }
}

// Due to Related Parties Subtotal Calculation
function updateDueToRelatedPartiesSubtotal() {
    console.log("Updating Due to Related Parties Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic due to related parties for the current period
    const genericDueToRelatedPartiesField = document.querySelector(`input[var="bs-due-to-related-parties-generic"][period="${period}"]`);
    const genericDueToRelatedParties = genericDueToRelatedPartiesField ? parseCurrencyValue(genericDueToRelatedPartiesField.value) || 0 : 0;
    console.log("Generic Due to Related Parties: ", genericDueToRelatedParties);

    // Get the custom due to related parties for the current period
    const customDueToRelatedPartiesFields = document.querySelectorAll(`input[var="bs-due-to-related-parties-custom"][period="${period}"]`);
    let customDueToRelatedParties = 0;
    customDueToRelatedPartiesFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customDueToRelatedParties += value;
        }
    });
    console.log("Custom Due to Related Parties: ", customDueToRelatedParties);

    // Calculate the due to related parties subtotal
    const dueToRelatedPartiesSubtotal = genericDueToRelatedParties + customDueToRelatedParties;
    console.log("Calculated Due to Related Parties Subtotal: ", dueToRelatedPartiesSubtotal);

    // Update the "bs-due-to-related-parties-subtotal" input field
    const dueToRelatedPartiesSubtotalField = document.querySelector(`input[var="bs-due-to-related-parties-subtotal"][period="${period}"]`);
    if (dueToRelatedPartiesSubtotalField) {
        dueToRelatedPartiesSubtotalField.value = formatNumberWithCommas(dueToRelatedPartiesSubtotal.toFixed(2));
        console.log("Due to Related Parties Subtotal updated to: ", dueToRelatedPartiesSubtotalField.value);
    } else {
        console.log("Due to Related Parties Subtotal field not found");
    }
}

// Due to Shareholders Subtotal Calculation
function updateDueToShareholdersSubtotal() {
    console.log("Updating Due to Shareholders Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic due to shareholders for the current period
    const genericDueToShareholdersField = document.querySelector(`input[var="bs-due-to-shareholders-generic"][period="${period}"]`);
    const genericDueToShareholders = genericDueToShareholdersField ? parseCurrencyValue(genericDueToShareholdersField.value) || 0 : 0;
    console.log("Generic Due to Shareholders: ", genericDueToShareholders);

    // Get the custom due to shareholders for the current period
    const customDueToShareholdersFields = document.querySelectorAll(`input[var="bs-due-to-shareholders-custom"][period="${period}"]`);
    let customDueToShareholders = 0;
    customDueToShareholdersFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customDueToShareholders += value;
        }
    });
    console.log("Custom Due to Shareholders: ", customDueToShareholders);

    // Calculate the due to shareholders subtotal
    const dueToShareholdersSubtotal = genericDueToShareholders + customDueToShareholders;
    console.log("Calculated Due to Shareholders Subtotal: ", dueToShareholdersSubtotal);

    // Update the "bs-due-to-shareholders-subtotal" input field
    const dueToShareholdersSubtotalField = document.querySelector(`input[var="bs-due-to-shareholders-subtotal"][period="${period}"]`);
    if (dueToShareholdersSubtotalField) {
        dueToShareholdersSubtotalField.value = formatNumberWithCommas(dueToShareholdersSubtotal.toFixed(2));
        console.log("Due to Shareholders Subtotal updated to: ", dueToShareholdersSubtotalField.value);
    } else {
        console.log("Due to Shareholders Subtotal field not found");
    }
}

// Other Long-Term Debt Subtotal Calculation
function updateOtherLongTermLiabilitiesSubtotal() {
    console.log("Updating Other Long-Term Liabilities Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic other long-term liabilities for the current period
    const genericOtherLongTermLiabilitiesField = document.querySelector(`input[var="bs-other-long-term-liabilities-generic"][period="${period}"]`);
    const genericOtherLongTermLiabilities = genericOtherLongTermLiabilitiesField ? parseCurrencyValue(genericOtherLongTermLiabilitiesField.value) || 0 : 0;
    console.log("Generic Other Long-Term Liabilities: ", genericOtherLongTermLiabilities);

    // Get the custom other long-term liabilities for the current period
    const customOtherLongTermLiabilitiesFields = document.querySelectorAll(`input[var="bs-other-long-term-liabilities-custom"][period="${period}"]`);
    let customOtherLongTermLiabilities = 0;
    customOtherLongTermLiabilitiesFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customOtherLongTermLiabilities += value;
        }
    });
    console.log("Custom Other Long-Term Liabilities: ", customOtherLongTermLiabilities);

    // Calculate the other long-term liabilities subtotal
    const otherLongTermLiabilitiesSubtotal = genericOtherLongTermLiabilities + customOtherLongTermLiabilities;
    console.log("Calculated Other Long-Term Liabilities Subtotal: ", otherLongTermLiabilitiesSubtotal);

    // Update the "bs-other-long-term-liabilities-subtotal" input field
    const otherLongTermLiabilitiesSubtotalField = document.querySelector(`input[var="bs-other-long-term-liabilities-subtotal"][period="${period}"]`);
    if (otherLongTermLiabilitiesSubtotalField) {
        otherLongTermLiabilitiesSubtotalField.value = formatNumberWithCommas(otherLongTermLiabilitiesSubtotal.toFixed(2));
        console.log("Other Long-Term Liabilities Subtotal updated to: ", otherLongTermLiabilitiesSubtotalField.value);
    } else {
        console.log("Other Long-Term Liabilities Subtotal field not found");
    }
}

/// Paid in Capital Subtotal Calculation ///
function updatePaidInCapitalSubtotal() {
    console.log("Updating Paid-in Capital Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic paid-in capital for the current period
    const genericPaidInCapitalField = document.querySelector(`input[var="bs-paid-in-capital-generic"][period="${period}"]`);
    const genericPaidInCapital = genericPaidInCapitalField ? parseCurrencyValue(genericPaidInCapitalField.value) || 0 : 0;
    console.log("Generic Paid-in Capital: ", genericPaidInCapital);

    // Get the custom paid-in capital for the current period
    const customPaidInCapitalFields = document.querySelectorAll(`input[var="bs-paid-in-capital-custom"][period="${period}"]`);
    let customPaidInCapital = 0;
    customPaidInCapitalFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customPaidInCapital += value;
        }
    });
    console.log("Custom Paid-in Capital: ", customPaidInCapital);

    // Calculate the paid-in capital subtotal
    const paidInCapitalSubtotal = genericPaidInCapital + customPaidInCapital;
    console.log("Calculated Paid-in Capital Subtotal: ", paidInCapitalSubtotal);

    // Update the "bs-paid-in-capital-subtotal" input field
    const paidInCapitalSubtotalField = document.querySelector(`input[var="bs-paid-in-capital-subtotal"][period="${period}"]`);
    if (paidInCapitalSubtotalField) {
        paidInCapitalSubtotalField.value = formatNumberWithCommas(paidInCapitalSubtotal.toFixed(2));
        console.log("Paid-in Capital Subtotal updated to: ", paidInCapitalSubtotalField.value);
    } else {
        console.log("Paid-in Capital Subtotal field not found");
    }
}


// Retained Earnings Subtotal Calculation ///
function updateRetainedEarningsSubtotal() {
    console.log("Updating Retained Earnings Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the prior year-end retained earnings for the current period
    const priorYearEndRetainedEarningsField = document.querySelector(`input[var="bs-prior-year-end-retained-earnings"][period="${period}"]`);
    const priorYearEndRetainedEarnings = priorYearEndRetainedEarningsField ? parseCurrencyValue(priorYearEndRetainedEarningsField.value) || 0 : 0;
    console.log("Prior Year-End Retained Earnings: ", priorYearEndRetainedEarnings);

    // Get the current period net profit after taxes for the current period
    const currentPeriodNetProfitAfterTaxesField = document.querySelector(`input[var="bs-current-period-net-profit-after-taxes"][period="${period}"]`);
    const currentPeriodNetProfitAfterTaxes = currentPeriodNetProfitAfterTaxesField ? parseCurrencyValue(currentPeriodNetProfitAfterTaxesField.value) || 0 : 0;
    console.log("Current Period Net Profit After Taxes: ", currentPeriodNetProfitAfterTaxes);

    // Get the current period distributions for the current period
    const currentPeriodDistributionsField = document.querySelector(`input[var="bs-current-period-distributions"][period="${period}"]`);
    const currentPeriodDistributions = currentPeriodDistributionsField ? -Math.abs(parseCurrencyValue(currentPeriodDistributionsField.value) || 0) : 0;
    console.log("Current Period Distributions (Absolute Value): ", currentPeriodDistributions);

    // Get the current period contributions for the current period
    const currentPeriodContributionsField = document.querySelector(`input[var="bs-current-period-contributions"][period="${period}"]`);
    const currentPeriodContributions = currentPeriodContributionsField ? Math.abs(parseCurrencyValue(currentPeriodContributionsField.value) || 0) : 0;
    console.log("Current Period Contributions (Absolute Value): ", currentPeriodContributions);

    // Get the custom paid-in capital for the current period
    const customRetainedEarningsFields = document.querySelectorAll(`input[var="bs-retained-earnings-custom"][period="${period}"]`);
    let customRetainedEarnings = 0;
    customRetainedEarningsFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customRetainedEarnings += value;
        }
    });
    console.log("Custom Retained Earnings: ", customRetainedEarnings);


    // Calculate the retained earnings subtotal
    const retainedEarningsSubtotal = priorYearEndRetainedEarnings + currentPeriodNetProfitAfterTaxes - currentPeriodDistributions - currentPeriodContributions + customRetainedEarnings;
    console.log("Calculated Retained Earnings Subtotal: ", retainedEarningsSubtotal);

    // Update the "bs-retained-earnings-subtotal" input field
    const retainedEarningsSubtotalField = document.querySelector(`input[var="bs-retained-earnings-subtotal"][period="${period}"]`);
    if (retainedEarningsSubtotalField) {
        retainedEarningsSubtotalField.value = formatNumberWithCommas(retainedEarningsSubtotal.toFixed(2));
        console.log("Retained Earnings Subtotal updated to: ", retainedEarningsSubtotalField.value);
    } else {
        console.log("Retained Earnings Subtotal field not found");
    }
}

/// Other Adjustments to Equity Subtotal Calculation ///
function updateOtherAdjustmentsToEquitySubtotal() {
    console.log("Updating Other Adjustments to Equity Subtotal...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the generic other adjustments to equity for the current period
    const genericOtherAdjustmentsToEquityField = document.querySelector(`input[var="bs-other-adjustments-to-equity-generic"][period="${period}"]`);
    const genericOtherAdjustmentsToEquity = genericOtherAdjustmentsToEquityField ? parseCurrencyValue(genericOtherAdjustmentsToEquityField.value) || 0 : 0;
    console.log("Generic Other Adjustments to Equity: ", genericOtherAdjustmentsToEquity);

    // Get the custom other adjustments to equity for the current period
    const customOtherAdjustmentsToEquityFields = document.querySelectorAll(`input[var="bs-other-adjustments-to-equity-custom"][period="${period}"]`);
    let customOtherAdjustmentsToEquity = 0;
    customOtherAdjustmentsToEquityFields.forEach(field => {
        const value = parseCurrencyValue(field.value);
        if (value) {
            customOtherAdjustmentsToEquity += value;
        }
    });
    console.log("Custom Other Adjustments to Equity: ", customOtherAdjustmentsToEquity);

    // Calculate the other adjustments to equity subtotal
    const otherAdjustmentsToEquitySubtotal = genericOtherAdjustmentsToEquity + customOtherAdjustmentsToEquity;
    console.log("Calculated Other Adjustments to Equity Subtotal: ", otherAdjustmentsToEquitySubtotal);

    // Update the "bs-other-adjustments-to-equity-subtotal" input field
    const otherAdjustmentsToEquitySubtotalField = document.querySelector(`input[var="bs-other-adjustments-to-equity-subtotal"][period="${period}"]`);
    if (otherAdjustmentsToEquitySubtotalField) {
        otherAdjustmentsToEquitySubtotalField.value = formatNumberWithCommas(otherAdjustmentsToEquitySubtotal.toFixed(2));
        console.log("Other Adjustments to Equity Subtotal updated to: ", otherAdjustmentsToEquitySubtotalField.value);
    } else {
        console.log("Other Adjustments to Equity Subtotal field not found");
    }
}

///TOTAL FIELDS///
// Total Current Assets Calculation
function updateTotalCurrentAssets() {
    console.log("Updating Balance Sheet Totals...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the subtotal of cash
    const cashSubtotalField = document.querySelector(`input[var="bs-cash-subtotal"][period="${period}"]`);
    const cashSubtotal = cashSubtotalField ? parseCurrencyValue(cashSubtotalField.value) || 0 : 0;
    console.log("Cash Subtotal: ", cashSubtotal);

    // Get the subtotal of accounts receivable
    const accountsReceivableSubtotalField = document.querySelector(`input[var="bs-accounts-receivable-subtotal"][period="${period}"]`);
    const accountsReceivableSubtotal = accountsReceivableSubtotalField ? parseCurrencyValue(accountsReceivableSubtotalField.value) || 0 : 0;
    console.log("Accounts Receivable Subtotal: ", accountsReceivableSubtotal);

    // Get the subtotal of inventory
    const inventorySubtotalField = document.querySelector(`input[var="bs-inventory-subtotal"][period="${period}"]`);
    const inventorySubtotal = inventorySubtotalField ? parseCurrencyValue(inventorySubtotalField.value) || 0 : 0;
    console.log("Inventory Subtotal: ", inventorySubtotal);

    // Get the subtotal of other current assets
    const otherCurrentAssetsSubtotalField = document.querySelector(`input[var="bs-other-current-assets-subtotal"][period="${period}"]`);
    const otherCurrentAssetsSubtotal = otherCurrentAssetsSubtotalField ? parseCurrencyValue(otherCurrentAssetsSubtotalField.value) || 0 : 0;
    console.log("Other Current Assets Subtotal: ", otherCurrentAssetsSubtotal);

    // Calculate the total current assets
    const totalCurrentAssets = cashSubtotal + accountsReceivableSubtotal + inventorySubtotal + otherCurrentAssetsSubtotal;
    console.log("Calculated Total Current Assets: ", totalCurrentAssets);

    // Update the "bs-total-current-assets" input field
    const totalCurrentAssetsField = document.querySelector(`input[var="bs-total-current-assets"][period="${period}"]`);
    if (totalCurrentAssetsField) {
        totalCurrentAssetsField.value = formatNumberWithCommas(totalCurrentAssets.toFixed(2));
        console.log("Total Current Assets updated to: ", totalCurrentAssetsField.value);
    } else {
        console.log("Total Current Assets field not found");
    }
}

// Net Property, Plant, and Equipment Calculation
function updateNetPropertyPlantAndEquipment() {
    console.log("Updating Net Property, Plant, and Equipment...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the subtotal of property, plant, and equipment
    const propertyPlantEquipmentSubtotalField = document.querySelector(`input[var="bs-property-plant-and-equipment-subtotal"][period="${period}"]`);
    const propertyPlantEquipmentSubtotal = propertyPlantEquipmentSubtotalField ? parseCurrencyValue(propertyPlantEquipmentSubtotalField.value) || 0 : 0;
    console.log("Property, Plant, and Equipment Subtotal: ", propertyPlantEquipmentSubtotal);

    // Get the accumulated depreciation
    const accumulatedDepreciationField = document.querySelector(`input[var="bs-accumulated-depreciation"][period="${period}"]`);
    const accumulatedDepreciation = accumulatedDepreciationField ? -Math.abs(parseCurrencyValue(accumulatedDepreciationField.value)) || 0 : 0;
    console.log("Accumulated Depreciation: ", accumulatedDepreciation);

    // Calculate the net property, plant, and equipment
    const netPropertyPlantEquipment = propertyPlantEquipmentSubtotal + accumulatedDepreciation;
    console.log("Calculated Net Property, Plant, and Equipment: ", netPropertyPlantEquipment);

    // Update the "net-property-plant-and-equipment" input field
    const netPropertyPlantEquipmentField = document.querySelector(`input[var="net-property-plant-and-equipment"][period="${period}"]`);
    if (netPropertyPlantEquipmentField) {
        netPropertyPlantEquipmentField.value = formatNumberWithCommas(netPropertyPlantEquipment.toFixed(2));
        console.log("Net Property, Plant, and Equipment updated to: ", netPropertyPlantEquipmentField.value);
    } else {
        console.log("Net Property, Plant, and Equipment field not found");
    }
}

// Net Fixed Assets Calculation
function updateNetFixedAssets() {
    console.log("Updating Net Fixed Assets...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the subtotal of property, plant, and equipment
    const propertyPlantEquipmentSubtotalField = document.querySelector(`input[var="bs-property-plant-and-equipment-subtotal"][period="${period}"]`);
    const propertyPlantEquipmentSubtotal = propertyPlantEquipmentSubtotalField ? parseCurrencyValue(propertyPlantEquipmentSubtotalField.value) || 0 : 0;
    console.log("Property, Plant, and Equipment Subtotal: ", propertyPlantEquipmentSubtotal);

    // Get the accumulated depreciation
    const accumulatedDepreciationField = document.querySelector(`input[var="bs-accumulated-depreciation"][period="${period}"]`);
    const accumulatedDepreciation = accumulatedDepreciationField ? -Math.abs(parseCurrencyValue(accumulatedDepreciationField.value)) || 0 : 0;
    console.log("Accumulated Depreciation: ", accumulatedDepreciation);

    // Get the land value
    const landField = document.querySelector(`input[var="bs-land"][period="${period}"]`);
    const land = landField ? parseCurrencyValue(landField.value) || 0 : 0;
    console.log("Land: ", land);

    // Calculate the net fixed assets
    const netFixedAssets = propertyPlantEquipmentSubtotal + accumulatedDepreciation + land;
    console.log("Calculated Net Fixed Assets: ", netFixedAssets);

    // Update the "bs-net-fixed-assets" input field
    const netFixedAssetsField = document.querySelector(`input[var="bs-net-fixed-assets"][period="${period}"]`);
    if (netFixedAssetsField) {
        netFixedAssetsField.value = formatNumberWithCommas(netFixedAssets.toFixed(2));
        console.log("Net Fixed Assets updated to: ", netFixedAssetsField.value);
    } else {
        console.log("Net Fixed Assets field not found");
    }
}

// Net Intangible Assets Calculation
function updateNetIntangibleAssets() {
    console.log("Updating Net Intangible Assets...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the subtotal of intangible assets
    const intangibleAssetsSubtotalField = document.querySelector(`input[var="bs-intangible-assets-subtotal"][period="${period}"]`);
    const intangibleAssetsSubtotal = intangibleAssetsSubtotalField ? parseCurrencyValue(intangibleAssetsSubtotalField.value) || 0 : 0;
    console.log("Intangible Assets Subtotal: ", intangibleAssetsSubtotal);

    // Get the accumulated amortization's absolute value and negate it; forcing a negative value witihn the net intangible assets calculation
    const accumulatedAmortizationField = document.querySelector(`input[var="bs-accumulated-amortization"][period="${period}"]`);
    const accumulatedAmortization = accumulatedAmortizationField ? -Math.abs(parseCurrencyValue(accumulatedAmortizationField.value)) || 0 : 0;
    console.log("Accumulated Amortization: ", accumulatedAmortization);

    // Calculate the net intangible assets
    const netIntangibleAssets = intangibleAssetsSubtotal + accumulatedAmortization;
    console.log("Calculated Net Intangible Assets: ", netIntangibleAssets);

    // Update the "bs-net-intangible-assets" input field
    const netIntangibleAssetsField = document.querySelector(`input[var="bs-net-intangible-assets"][period="${period}"]`);
    if (netIntangibleAssetsField) {
        netIntangibleAssetsField.value = formatNumberWithCommas(netIntangibleAssets.toFixed(2));
        console.log("Net Intangible Assets updated to: ", netIntangibleAssetsField.value);
    } else {
        console.log("Net Intangible Assets field not found");
    }
}

// Total Other Long-Term Assets Calculation
function updateTotalOtherLongTermAssets() {
    console.log("Updating Total Other Long Term Assets...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the subtotals of the respective fields
    const dueFromRelatedPartiesField = document.querySelector(`input[var="bs-due-from-related-parties-subtotal"][period="${period}"]`);
    const dueFromRelatedParties = dueFromRelatedPartiesField ? parseCurrencyValue(dueFromRelatedPartiesField.value) || 0 : 0;
    console.log("Due From Related Parties Subtotal: ", dueFromRelatedParties);

    const dueFromShareholdersSubtotalField = document.querySelector(`input[var="bs-due-from-shareholders-subtotal"][period="${period}"]`);
    const dueFromShareholdersSubtotal = dueFromShareholdersSubtotalField ? parseCurrencyValue(dueFromShareholdersSubtotalField.value) || 0 : 0;
    console.log("Due From Shareholders Subtotal: ", dueFromShareholdersSubtotal);

    const otherLongTermAssetsSubtotalField = document.querySelector(`input[var="bs-other-long-term-assets-subtotal"][period="${period}"]`);
    const otherLongTermAssetsSubtotal = otherLongTermAssetsSubtotalField ? parseCurrencyValue(otherLongTermAssetsSubtotalField.value) || 0 : 0;
    console.log("Other Long Term Assets Subtotal: ", otherLongTermAssetsSubtotal);

    // Calculate the total other long term assets
    const totalOtherLongTermAssets = dueFromRelatedParties+ dueFromShareholdersSubtotal + otherLongTermAssetsSubtotal;
    console.log("Calculated Total Other Long Term Assets: ", totalOtherLongTermAssets);

    // Update the "bs-total-other-long-term-assets" input field
    const totalOtherLongTermAssetsField = document.querySelector(`input[var="bs-total-other-long-term-assets"][period="${period}"]`);
    if (totalOtherLongTermAssetsField) {
        totalOtherLongTermAssetsField.value = formatNumberWithCommas(totalOtherLongTermAssets.toFixed(2));
        console.log("Total Other Long Term Assets updated to: ", totalOtherLongTermAssetsField.value);
    } else {
        console.log("Total Other Long Term Assets field not found");
    }
}

// Total Long-Term Assets Calculation
function updateTotalLongTermAssets() {
    console.log("Updating Total Long Term Assets...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the values of the respective fields
    const totalOtherLongTermAssetsField = document.querySelector(`input[var="bs-total-other-long-term-assets"][period="${period}"]`);
    const totalOtherLongTermAssets = totalOtherLongTermAssetsField ? parseCurrencyValue(totalOtherLongTermAssetsField.value) || 0 : 0;
    console.log("Total Other Long Term Assets: ", totalOtherLongTermAssets);

    const netIntangibleAssetsField = document.querySelector(`input[var="bs-net-intangible-assets"][period="${period}"]`);
    const netIntangibleAssets = netIntangibleAssetsField ? parseCurrencyValue(netIntangibleAssetsField.value) || 0 : 0;
    console.log("Net Intangible Assets: ", netIntangibleAssets);

    const netFixedAssetsField = document.querySelector(`input[var="bs-net-fixed-assets"][period="${period}"]`);
    const netFixedAssets = netFixedAssetsField ? parseCurrencyValue(netFixedAssetsField.value) || 0 : 0;
    console.log("Net Fixed Assets: ", netFixedAssets);

    // Calculate the total long term assets
    const totalLongTermAssets = totalOtherLongTermAssets + netIntangibleAssets + netFixedAssets;
    console.log("Calculated Total Long Term Assets: ", totalLongTermAssets);

    // Update the "bs-total-long-term-assets" input field
    const totalLongTermAssetsField = document.querySelector(`input[var="bs-total-long-term-assets"][period="${period}"]`);
    if (totalLongTermAssetsField) {
        totalLongTermAssetsField.value = formatNumberWithCommas(totalLongTermAssets.toFixed(2));
        console.log("Total Long Term Assets updated to: ", totalLongTermAssetsField.value);
    } else {
        console.log("Total Long Term Assets field not found");
    }
}

// Total Assets Calculation
function updateTotalAssets() {
    console.log("Updating Total Assets...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the values of the respective fields
    const totalLongTermAssetsField = document.querySelector(`input[var="bs-total-long-term-assets"][period="${period}"]`);
    const totalLongTermAssets = totalLongTermAssetsField ? parseCurrencyValue(totalLongTermAssetsField.value) || 0 : 0;
    console.log("Total Long Term Assets: ", totalLongTermAssets);

    const totalCurrentAssetsField = document.querySelector(`input[var="bs-total-current-assets"][period="${period}"]`);
    const totalCurrentAssets = totalCurrentAssetsField ? parseCurrencyValue(totalCurrentAssetsField.value) || 0 : 0;
    console.log("Total Current Assets: ", totalCurrentAssets);

    // Calculate the total assets
    const totalAssets = totalLongTermAssets + totalCurrentAssets;
    console.log("Calculated Total Assets: ", totalAssets);

    // Update the "bs-total-assets" input field
    const totalAssetsField = document.querySelector(`input[var="bs-total-assets"][period="${period}"]`);
    if (totalAssetsField) {
        totalAssetsField.value = formatNumberWithCommas(totalAssets.toFixed(2));
        console.log("Total Assets updated to: ", totalAssetsField.value);
    } else {
        console.log("Total Assets field not found");
    }
}

// Total Current Liabilities Calculation
function updateTotalCurrentLiabilities() {
    console.log("Updating Total Current Liabilities...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the values of subtotal fields comprising of current liabilities
    const accountsPayableSubtotalField = document.querySelector(`input[var="bs-accounts-payable-subtotal"][period="${period}"]`);
    const accountsPayableSubtotal = accountsPayableSubtotalField ? parseCurrencyValue(accountsPayableSubtotalField.value) || 0 : 0;
    console.log("Accounts Payable Subtotal: ", accountsPayableSubtotal);

    const revolvingLinesOfCreditSubtotalField = document.querySelector(`input[var="bs-revolving-lines-of-credit-subtotal"][period="${period}"]`);
    const revolvingLinesOfCreditSubtotal = revolvingLinesOfCreditSubtotalField ? parseCurrencyValue(revolvingLinesOfCreditSubtotalField.value) || 0 : 0;
    console.log("Revolving Lines of Credit Subtotal: ", revolvingLinesOfCreditSubtotal);

    const accrualLiabilitiesSubtotalField = document.querySelector(`input[var="bs-accrual-liabilities-subtotal"][period="${period}"]`);
    const accrualLiabilitiesSubtotal = accrualLiabilitiesSubtotalField ? parseCurrencyValue(accrualLiabilitiesSubtotalField.value) || 0 : 0;
    console.log("Accrual Liabilities Subtotal: ", accrualLiabilitiesSubtotal);

    const otherCurrentLiabilitiesSubtotalField = document.querySelector(`input[var="bs-other-current-liabilities-subtotal"][period="${period}"]`);
    const otherCurrentLiabilitiesSubtotal = otherCurrentLiabilitiesSubtotalField ? parseCurrencyValue(otherCurrentLiabilitiesSubtotalField.value) || 0 : 0;
    console.log("Other Current Liabilities Subtotal: ", otherCurrentLiabilitiesSubtotal);

    // Get the current portion of long-term liabilities subtotal
    const currentPortionOfLongTermLiabilitiesSubtotalField = document.querySelector(`input[var="bs-current-portion-of-long-term-liabilities-subtotal"][period="${period}"]`);
    const currentPortionOfLongTermLiabilitiesSubtotal = currentPortionOfLongTermLiabilitiesSubtotalField ? parseCurrencyValue(currentPortionOfLongTermLiabilitiesSubtotalField.value) || 0 : 0;
    console.log("Current Portion of Long-Term Liabilities Subtotal: ", currentPortionOfLongTermLiabilitiesSubtotal);

    // Calculate the total current liabilities
    const totalCurrentLiabilities = accountsPayableSubtotal + revolvingLinesOfCreditSubtotal + accrualLiabilitiesSubtotal + otherCurrentLiabilitiesSubtotal + currentPortionOfLongTermLiabilitiesSubtotal;
    console.log("Calculated Total Current Liabilities: ", totalCurrentLiabilities);

    // Update the "bs-total-current-liabilities" input field
    const totalCurrentLiabilitiesField = document.querySelector(`input[var="bs-total-current-liabilities"][period="${period}"]`);
    if (totalCurrentLiabilitiesField) {
        totalCurrentLiabilitiesField.value = formatNumberWithCommas(totalCurrentLiabilities.toFixed(2));
        console.log("Total Current Liabilities updated to: ", totalCurrentLiabilitiesField.value);
    } else {
        console.log("Total Current Liabilities field not found");
    }
}

// Total Long-Term Liabilities Calculation
function updateTotalLongTermLiabilities() {
    console.log("Updating Total Long-Term Liabilities...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the values of the respective fields
    const longTermDebtRefinancedSubtotalField = document.querySelector(`input[var="bs-long-term-debt-to-be-refinanced-subtotal"][period="${period}"]`);
    const longTermDebtRefinancedSubtotal = longTermDebtRefinancedSubtotalField ? parseCurrencyValue(longTermDebtRefinancedSubtotalField.value) || 0 : 0;
    console.log("Long-Term Debt to Be Refinanced Subtotal: ", longTermDebtRefinancedSubtotal);

    const otherLongTermNotesPayableSubtotalField = document.querySelector(`input[var="bs-other-long-term-notes-payable-subtotal"][period="${period}"]`);
    const otherLongTermNotesPayableSubtotal = otherLongTermNotesPayableSubtotalField ? parseCurrencyValue(otherLongTermNotesPayableSubtotalField.value) || 0 : 0;
    console.log("Other Long-Term Notes Payable Subtotal: ", otherLongTermNotesPayableSubtotal);

    const dueToRelatedPartiesSubtotalField = document.querySelector(`input[var="bs-due-to-related-parties-subtotal"][period="${period}"]`);
    const dueToRelatedPartiesSubtotal = dueToRelatedPartiesSubtotalField ? parseCurrencyValue(dueToRelatedPartiesSubtotalField.value) || 0 : 0;
    console.log("Due to Related Parties Subtotal: ", dueToRelatedPartiesSubtotal);

    const dueToShareholdersSubtotalField = document.querySelector(`input[var="bs-due-to-shareholders-subtotal"][period="${period}"]`);
    const dueToShareholdersSubtotal = dueToShareholdersSubtotalField ? parseCurrencyValue(dueToShareholdersSubtotalField.value) || 0 : 0;
    console.log("Due to Shareholders Subtotal: ", dueToShareholdersSubtotal);

    const otherLongTermLiabilitiesSubtotalField = document.querySelector(`input[var="bs-other-long-term-liabilities-subtotal"][period="${period}"]`);
    const otherLongTermLiabilitiesSubtotal = otherLongTermLiabilitiesSubtotalField ? parseCurrencyValue(otherLongTermLiabilitiesSubtotalField.value) || 0 : 0;
    console.log("Other Long-Term Liabilities Subtotal: ", otherLongTermLiabilitiesSubtotal);

    // Calculate the total long-term liabilities
    const totalLongTermLiabilities =
        longTermDebtRefinancedSubtotal +
        otherLongTermNotesPayableSubtotal +
        dueToRelatedPartiesSubtotal +
        dueToShareholdersSubtotal +
        otherLongTermLiabilitiesSubtotal;

    console.log("Calculated Total Long-Term Liabilities: ", totalLongTermLiabilities);

    // Update the "bs-total-long-term-liabilities" input field
    const totalLongTermLiabilitiesField = document.querySelector(`input[var="bs-total-long-term-liabilities"][period="${period}"]`);
    if (totalLongTermLiabilitiesField) {
        totalLongTermLiabilitiesField.value = formatNumberWithCommas(totalLongTermLiabilities.toFixed(2));
        console.log("Total Long-Term Liabilities updated to: ", totalLongTermLiabilitiesField.value);
    } else {
        console.log("Total Long-Term Liabilities field not found");
    }
}

// Total Liabilities Calculation
function updateTotalLiabilities() {
    console.log("Updating Total Liabilities...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the values of the respective fields
    const totalLongTermLiabilitiesField = document.querySelector(`input[var="bs-total-long-term-liabilities"][period="${period}"]`);
    const totalLongTermLiabilities = totalLongTermLiabilitiesField ? parseCurrencyValue(totalLongTermLiabilitiesField.value) || 0 : 0;
    console.log("Total Long-Term Liabilities: ", totalLongTermLiabilities);

    const totalCurrentLiabilitiesField = document.querySelector(`input[var="bs-total-current-liabilities"][period="${period}"]`);
    const totalCurrentLiabilities = totalCurrentLiabilitiesField ? parseCurrencyValue(totalCurrentLiabilitiesField.value) || 0 : 0;
    console.log("Total Current Liabilities: ", totalCurrentLiabilities);

    // Calculate the total liabilities
    const totalLiabilities = totalLongTermLiabilities + totalCurrentLiabilities;

    console.log("Calculated Total Liabilities: ", totalLiabilities);

    // Update the "bs-total-liabilities" input field
    const totalLiabilitiesField = document.querySelector(`input[var="bs-total-liabilities"][period="${period}"]`);
    if (totalLiabilitiesField) {
        totalLiabilitiesField.value = formatNumberWithCommas(totalLiabilities.toFixed(2));
        console.log("Total Liabilities updated to: ", totalLiabilitiesField.value);
    } else {
        console.log("Total Liabilities field not found");
    }
}

// Update Total Equity
function updateTotalEquity() {
    console.log("Updating Total Equity...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the values of the respective fields
    const paidInCapitalSubtotalField = document.querySelector(`input[var="bs-paid-in-capital-subtotal"][period="${period}"]`);
    const paidInCapitalSubtotal = paidInCapitalSubtotalField ? parseCurrencyValue(paidInCapitalSubtotalField.value) || 0 : 0;
    console.log("Paid-in Capital Subtotal: ", paidInCapitalSubtotal);

    const retainedEarningsSubtotalField = document.querySelector(`input[var="bs-retained-earnings-subtotal"][period="${period}"]`);
    const retainedEarningsSubtotal = retainedEarningsSubtotalField ? parseCurrencyValue(retainedEarningsSubtotalField.value) || 0 : 0;
    console.log("Retained Earnings Subtotal: ", retainedEarningsSubtotal);

    const otherAdjustmentsToEquitySubtotalField = document.querySelector(`input[var="bs-other-adjustments-to-equity-subtotal"][period="${period}"]`);
    const otherAdjustmentsToEquitySubtotal = otherAdjustmentsToEquitySubtotalField ? parseCurrencyValue(otherAdjustmentsToEquitySubtotalField.value) || 0 : 0;
    console.log("Other Adjustments to Equity Subtotal: ", otherAdjustmentsToEquitySubtotal);

    // Calculate Total Equity
    const totalEquity = paidInCapitalSubtotal + retainedEarningsSubtotal + otherAdjustmentsToEquitySubtotal;

    console.log("Calculated Total Equity: ", totalEquity);

    // Update the "bs-total-equity" input field
    const totalEquityField = document.querySelector(`input[var="bs-total-equity"][period="${period}"]`);
    if (totalEquityField) {
        totalEquityField.value = formatNumberWithCommas(totalEquity.toFixed(2));
        console.log("Total Equity updated to: ", totalEquityField.value);
    } else {
        console.log("Total Equity field not found");
    }
}

// Update Total Liabilities and Equity
function updateTotalLiabilitiesAndEquity() {
    console.log("Updating Total Liabilities and Equity...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the values of the respective fields
    const totalLiabilitiesField = document.querySelector(`input[var="bs-total-liabilities"][period="${period}"]`);
    const totalLiabilities = totalLiabilitiesField ? parseCurrencyValue(totalLiabilitiesField.value) || 0 : 0;
    console.log("Total Liabilities: ", totalLiabilities);

    const totalEquityField = document.querySelector(`input[var="bs-total-equity"][period="${period}"]`);
    const totalEquity = totalEquityField ? parseCurrencyValue(totalEquityField.value) || 0 : 0;
    console.log("Total Equity: ", totalEquity);

    // Calculate Total Liabilities and Equity
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    console.log("Calculated Total Liabilities and Equity: ", totalLiabilitiesAndEquity);

    // Update the "bs-total-liabilities-and-equity" input field
    const totalLiabilitiesAndEquityField = document.querySelector(`input[var="bs-total-liabilities-and-equity"][period="${period}"]`);
    if (totalLiabilitiesAndEquityField) {
        totalLiabilitiesAndEquityField.value = formatNumberWithCommas(totalLiabilitiesAndEquity.toFixed(2));
        console.log("Total Liabilities and Equity updated to: ", totalLiabilitiesAndEquityField.value);
    } else {
        console.log("Total Liabilities and Equity field not found");
    }
}

// Update Total Unbalanced Amount
function updateTotalUnbalancedAmount() {
    console.log("Updating Total Unbalanced Amount...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the values of the respective fields
    const totalAssetsField = document.querySelector(`input[var="bs-total-assets"][period="${period}"]`);
    const totalAssets = totalAssetsField ? parseCurrencyValue(totalAssetsField.value) || 0 : 0;
    console.log("Total Assets: ", totalAssets);

    const totalLiabilitiesField = document.querySelector(`input[var="bs-total-liabilities"][period="${period}"]`);
    const totalLiabilities = totalLiabilitiesField ? parseCurrencyValue(totalLiabilitiesField.value) || 0 : 0;
    console.log("Total Liabilities: ", totalLiabilities);

    const totalEquityField = document.querySelector(`input[var="bs-total-equity"][period="${period}"]`);
    const totalEquity = totalEquityField ? parseCurrencyValue(totalEquityField.value) || 0 : 0;
    console.log("Total Equity: ", totalEquity);

    // Calculate Total Unbalanced Amount
    const totalUnbalancedAmount = totalAssets - totalLiabilities - totalEquity;

    console.log("Calculated Total Unbalanced Amount: ", totalUnbalancedAmount);

    // Update the "bs-total-unbalanced-amount" input field
    const totalUnbalancedAmountField = document.querySelector(`input[var="bs-total-unbalanced-amount"][period="${period}"]`);
    if (totalUnbalancedAmountField) {
        totalUnbalancedAmountField.value = formatNumberWithCommas(totalUnbalancedAmount.toFixed(2));
        console.log("Total Unbalanced Amount updated to: ", totalUnbalancedAmountField.value);
    } else {
        console.log("Total Unbalanced Amount field not found");
    }
}

// Sets the Equity section's "Current Period Net Profit After Taxes" equal to the amount found withthin the respective Income Statement field
function updateNetProfitAfterTaxesWithinBalanceSheetEquitySection() {
    console.log("Updating Net Profit After Taxes...");

    const period = this.getAttribute('period');
    console.log("Period: ", period);

    // Get the value of the net-profit-after-taxes field for the current period
    const netProfitAfterTaxesField = document.querySelector(`input[var="net-profit-after-taxes"][period="${period}"]`);
    const netProfitAfterTaxes = netProfitAfterTaxesField ? parseCurrencyValue(netProfitAfterTaxesField.value) || 0 : 0;
    console.log("Net Profit After Taxes: ", netProfitAfterTaxes);

    // Update the "bs-current-period-net-profit-after-taxes" input field
    const currentPeriodNetProfitAfterTaxesField = document.querySelector(`input[var="bs-current-period-net-profit-after-taxes"][period="${period}"]`);
    if (currentPeriodNetProfitAfterTaxesField) {
        currentPeriodNetProfitAfterTaxesField.value = formatNumberWithCommas(netProfitAfterTaxes.toFixed(2));
        console.log("Current Period Net Profit After Taxes updated to: ", currentPeriodNetProfitAfterTaxesField.value);
    } else {
        console.log("Current Period Net Profit After Taxes field not found");
    }
}

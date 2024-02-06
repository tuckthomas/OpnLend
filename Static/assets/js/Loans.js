// Sources and Uses Table
function setupSourcesAndUsesTable() {
    if (window.jQuery) {
        // Function to update totals
        function updateTotals() {
            var totalSourceAmount = 0;
            var totalUseAmount = 0;

            // Calculate sum for Source Amounts
            $('.source-amount input').each(function() {
                var value = parseFloat($(this).val());
                if (!isNaN(value)) {
                    totalSourceAmount += value;
                }
            });

            // Calculate sum for Use Amounts
            $('.use-amount input').each(function() {
                var value = parseFloat($(this).val());
                if (!isNaN(value)) {
                    totalUseAmount += value;
                }
            });

            // Update totals in the footer
            $('td[field-name="Source_Amount_Total"]').text(totalSourceAmount.toFixed(2));
            $('td[field-name="Use_Amount_Total"]').text(totalUseAmount.toFixed(2));
        }

        // Delete Row Functionality
        $('#myTable tbody').on('click', '.del-row', function() {
            $(this).closest('tr').remove();
            updateTotals(); // Update totals after row removal
        });

        // Add Row Functionality
        $(".Sources-and-Uses-Add-Row-Button").click(function() {
            var newRow = '<tr class="sources-and-uses-row">' +
                         '<td class="source-description"><input class="form-control Text-Input" type="text" /></td>' +
                         '<td class="source-amount"><input class="form-control Text-Input" type="text" /></td>' +
                         '<td class="use-description"><input class="form-control Text-Input" type="text" /></td>' +
                         '<td class="use-amount"><input class="form-control Text-Input" type="text" /></td>' +
                         '<td class="text-center delete-icon-column"><a class="del-row" href="javascript:void(0);">' +
                         '<svg class="bi bi-trash-fill trash-delete-icon" xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="currentColor" viewBox="0 0 16 16" style="font-size: 20px;color: var(--bs-danger-text-emphasis);">' +
                         '<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0">' +
                         '</path></svg></a></td>' +
                         '</tr>';
            $('#myTable tbody').append(newRow);
        });

        // Event listener for changes in Source and Use Amounts
        $('#myTable').on('input', '.source-amount input, .use-amount input', function() {
            updateTotals();
        });
    } else {
        console.error("jQuery is not loaded");
    }
}

// Sets up the drop-down menu
function setupDropdownMenu() {
    console.log("Initializing dropdown menu setup.");

    // Main dropdown button interactions
    document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.addEventListener('click', function(event) {
            console.log("Dropdown button clicked.");
            event.preventDefault(); // Prevents the default action of the button
            toggleDropdownContent.call(this); // Calls the function to handle dropdown content visibility
        });
    });

    // Ensuring submenu link interactions don't cause a page refresh or unintended behavior
    document.querySelectorAll('.submenu-link').forEach(link => {
        link.addEventListener('click', function(event) {
            console.log("Submenu link clicked.");
            event.preventDefault(); // Prevents navigating to "#"
            event.stopPropagation(); // Stops the event from bubbling up the DOM
        });
    });

    // Handling final level menu item interactions
    document.querySelectorAll('.dropdown-content .submenu a').forEach(item => {
        item.addEventListener('click', function(event) {
            console.log("Final level menu item clicked.");
            event.preventDefault(); // This will prevent the default action of the anchor tag
            event.stopPropagation(); // Prevents the click event from propagating to parent elements

            // Update the button text and 'name' attribute
            let dropbtn = this.closest('.dropdown').querySelector('.dropbtn');
            if (dropbtn) {
                dropbtn.textContent = this.textContent;
                dropbtn.setAttribute('name', 'Loan_Product');

                // Logic for setting attributes based on the content
                if (this.textContent.includes('Revolving') && !this.textContent.includes('Non-Revolving')) {
                    dropbtn.setAttribute('Is_Revolving', 'True');
                } else {
                    dropbtn.setAttribute('Is_Revolving', 'False');
                }
            }

            // Close the dropdown menu after selection
            this.closest('.dropdown-content').style.display = 'none';
        });
    });

    function toggleDropdownContent() {
        let dropdownContent = this.nextElementSibling;
        const isVisible = dropdownContent.style.display === 'block';
        closeAllDropdowns();
        dropdownContent.style.display = isVisible ? 'none' : 'block';
    }

    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown-content').forEach(content => {
            content.style.display = 'none';
        });
    }

    // Close dropdowns when clicking outside of them
    document.addEventListener('click', function(event) {
        if (!event.target.matches('.dropbtn')) {
            closeAllDropdowns();
        }
    });
}


// Function to handle the addition of a pricing period
function addPricingPeriod() {
    const wrapper = document.querySelector('.Pricing-Period-Group-Button-Wrapper');
    const periods = wrapper.querySelectorAll('.Pricing-Period-Group');
    const lastPeriod = periods[periods.length - 1];
    const newPeriod = lastPeriod.cloneNode(true);
    
    const currentPeriodCount = parseInt(lastPeriod.getAttribute('pricing-period'));
    const newPeriodCount = currentPeriodCount + 1;
    
    newPeriod.setAttribute('pricing-period', newPeriodCount.toString());
    // Update period-count attribute for all relevant children
    newPeriod.querySelectorAll('[pricing-period]').forEach(function(element) {
        element.setAttribute('pricing-period', newPeriodCount.toString());
    });
    
    // Apply margin to create a gap between periods
    newPeriod.style.marginTop = '25px';
    
    wrapper.insertBefore(newPeriod, lastPeriod.nextSibling);
}


// Function to handle the deletion of a pricing period
function deletePricingPeriod() {
    const wrapper = document.querySelector('.Pricing-Period-Group-Button-Wrapper');
    const periods = wrapper.querySelectorAll('.Pricing-Period-Group');
    
    if (periods.length > 1) { // Ensure there's more than one pricing period before removing
        const lastPeriod = periods[periods.length - 1];
        wrapper.removeChild(lastPeriod);
    } else {
        alert('You must have at least one pricing period.');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    // Function to initialize the display property of elements
    function initializeDisplayProperty() {
        // Selectors for specific forms to hide
        const formsToHide = [
            '.Tabular-Form[data-form-id="New-Loan-Requests-Management-Form"]',
            '.Tabular-Form[data-form-id="Existing-Loan-Requests-Management-Form"]'
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
            }
        });
    }

    initializeDisplayProperty()

    // Function to toggle the visibility of an element (form or table)
    function toggleVisibility(element) {
        console.log("Toggling visibility for element:", element);
        // Check if the element is currently visible
        if (element.style.display === "none") {
            element.style.display = "block";
            // Set opacity to '1' after a very short delay to ensure display change is rendered
            setTimeout(() => {
                element.style.opacity = '1'; // Smooth transition for showing

                // Check if the target form is a descendant of the element
                const targetForm = element.querySelector('.New-Loan-Requests-Management-Form');
                if (targetForm) {
                    console.log("Target form (with class New-Loan-Requests-Management-Form) is now visible, attaching event handler.");
                    attachFormSubmitHandler(targetForm); // Attach handler to the specific form
                } else {
                    console.log("Target form with class New-Loan-Requests-Management-Form not found within the element.");
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
            }
        });
    });
    
    // Event listeners for the add and delete buttons
    document.getElementById('add-pricing-period').addEventListener('click', addPricingPeriod);
    document.getElementById('delete-pricing-period').addEventListener('click', deletePricingPeriod);
    
    // Calls additional functoin to load in the DOM
    setupDropdownMenu();
    setupSourcesAndUsesTable();

});

document.addEventListener('DOMContentLoaded', () => {
    fetchFilteredData();

    // Create and show the custom pop-up
    createAndShowPopup();
});

window.onerror = function(message, source, lineno, colno, error) {
    const errorMsg = {
        message: message,
        source: source,
        lineno: lineno,
        colno: colno,
        stack: error ? error.stack : ''
    };

    // Send error message to the server
    fetch('/log-js-error/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(errorMsg)
    });

    // Return false to allow default error handling
    return false;
};

console.log('JavaScript file loaded');

// Pop-up message option
function createAndShowPopup() {
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
    modalText.textContent = "Greetings. This page is a temporary replacement for the Home/Dashboard page. The data populating the table is obtained via the SBA's API for SBA 7a and 504 loans between 2010 - Current. Utilizing Python, the loan data files are combined into a singular database table. Prior to posting to the table, various data cleaning methods are applied in an attempt to clean up the Lender data. However, due to the SBA's missing data fields for some historical data, I am left with either choosing to make assumptions about Lender names or allow what appears to be duplicate cases of the same Lender name. Out of an abundance of caution and desire not to assume, I have elected to proceed with the latter of the two options.";
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

// Utility functions
function formatCurrency(value) {
    return "$" + parseInt(value).toLocaleString();
}

function formatNumberWithCommas(value) {
    return parseInt(value).toLocaleString();
}

// Function to fetch filtered data
function fetchFilteredData() {
    var institutionName = document.getElementById('institution-search').value;
    var projectState = document.getElementById('state-search').value;
    var projectCounty = document.getElementById('county-search').value;

    // Check if the values are blank and set them to "All" if needed
    if (institutionName === '') {
        institutionName = 'All';
    }
    if (projectState === '') {
        projectState = 'All';
    }
    if (projectCounty === '') {
        projectCounty = 'All';
    } else {
        // Extract county name by removing the state abbreviation in parentheses and trimming
        projectCounty = projectCounty.replace(/\s*\([^)]*\)\s*/, '').trim();

        // Check if the state abbreviation is already present in the projectState value
        var stateAbbreviation = projectCounty.match(/\(([^)]+)\)/);
        if (stateAbbreviation) {
            stateAbbreviation = stateAbbreviation[1]; // Extract the state abbreviation
            if (!projectState.includes(stateAbbreviation)) {
                // Add the state abbreviation to the projectState value
                projectState = `${projectState}, ${stateAbbreviation}`;
            }
        }
    }

    // Log the selected values for debugging
    console.log('Selected Institution:', institutionName);
    console.log('Selected Project State:', projectState);
    console.log('Selected Project County:', projectCounty);

    // Construct the URL with the selected filter options
    var url = `/data-table/?institutionname=${institutionName}&projectstate=${projectState}&projectcounty=${projectCounty}`;

    return fetch(url, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        return data; // Return the data
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle the error here without returning a rejected promise
        throw error; // Re-throw the error to propagate it
    });
}

// Define tableBody globally
var tableBody = document.getElementById('data-table-body');

// Function to update the data table and calculate max values
function updateTable(data) {
    // Clear existing rows
    tableBody.innerHTML = '';

    let maxGrossApproval = -Infinity; // Initialize with a small value
    let maxAverageGrossApproval = -Infinity; // Initialize with a small value

    data.forEach(item => {
        var row = document.createElement('tr');

        var institutionnameCell = document.createElement('td');
        institutionnameCell.textContent = item.institutionname;
        row.appendChild(institutionnameCell);

        var projectStateCell = document.createElement('td');
        projectStateCell.textContent = item.projectstate_or_count;
        row.appendChild(projectStateCell);

        var projectCountyCell = document.createElement('td');
        projectCountyCell.textContent = item.projectcounty_or_count;
        row.appendChild(projectCountyCell);

        var grossApprovalCell = document.createElement('td');
        grossApprovalCell.textContent = formatCurrency(item.total_gross_approval);
        row.appendChild(grossApprovalCell);

        var approvalCountCell = document.createElement('td');
        approvalCountCell.textContent = formatNumberWithCommas(item.loan_count);
        row.appendChild(approvalCountCell);

        var avgGrossApprovalCell = document.createElement('td');
        avgGrossApprovalCell.textContent = formatCurrency(item.average_gross_approval);
        row.appendChild(avgGrossApprovalCell);

        tableBody.appendChild(row);

        // Update max values
        maxGrossApproval = Math.max(maxGrossApproval, item.total_gross_approval);
        maxAverageGrossApproval = Math.max(maxAverageGrossApproval, item.average_gross_approval);
    });

    // Now you have the maxGrossApproval and maxAverageGrossApproval values
    console.log('Max Gross Approval:', maxGrossApproval);
    console.log('Max Average Gross Approval:', maxAverageGrossApproval);
    
}

// Event listener for the "Apply Filter" button
document.getElementById('apply-filters-btn').addEventListener('click', () => {
    console.log('Apply Filters button clicked');

    // Call fetchFilteredData and handle the returned promise
    fetchFilteredData()
        .then(data => {
            console.log('Data received:', data);
            if (data !== null) {
                updateTable(data); // Pass the data to updateTable
            } else {
                console.error('No data received.');
                // Handle the "no data" case here, e.g., show an error message
            }
        })
        .catch(error => {
            console.error('There was a problem processing the data:', error);
        });
});

let sortOrder = 1;  // 1 for ascending, -1 for descending
let currentColumn = null;

function sortTable(columnIndex, columnName) {
    const tableBody = document.getElementById('data-table-body');
    let rows = Array.from(tableBody.getElementsByTagName('tr'));

    // Sorting logic
    rows.sort((rowA, rowB) => {
        let cellA = rowA.getElementsByTagName('td')[columnIndex].textContent;
        let cellB = rowB.getElementsByTagName('td')[columnIndex].textContent;

        // Handle numeric and "N/A" values separately
        if (columnName === 'institutionname' || columnName === 'projectstate' || columnName === 'projectcounty') {
            // Use localeCompare for text-based columns
            return sortOrder * cellA.localeCompare(cellB, undefined, {numeric: true});
        } else {
            // Convert "N/A" to a value that sorts appropriately
            cellA = cellA === "N/A" ? -1 : parseInt(cellA.replace(/[\$,]/g, ''));
            cellB = cellB === "N/A" ? -1 : parseInt(cellB.replace(/[\$,]/g, ''));
            return sortOrder * (cellA - cellB);
        }
    });

    // Toggle sort order if clicking on a different column
    if (columnName !== currentColumn) {
        sortOrder = 1;
        currentColumn = columnName;
    } else {
        sortOrder *= -1;
    }

    // Re-append rows to the table body in sorted order
    rows.forEach(row => tableBody.appendChild(row));
}

// Function to initialize the sliders
$(document).ready(function () {
    // Default values for maxGrossApproval and maxAverageGrossApproval
    let maxGrossApproval = 5000000;
    let maxAverageGrossApproval = 5000000;
    // Function to initialize the sliders
    function initializeSliders(maxGrossApproval, maxAverageGrossApproval) {
        // Initialize the Gross Approval Range slider
        $("#gross-approval-range-slider").slider({
            range: true,
            min: 0,
            max: $("#gross-approval-range-slider").data("max-value"), // Get max value from data attribute
            values: [0, $("#gross-approval-range-slider").data("max-value")], // Set initial values
            slide: function (event, ui) {
                $("#gross-approval-min").val(formatCurrency(ui.values[0]));
                $("#gross-approval-max").val(formatCurrency(ui.values[1]));
            }
        });
        $("#gross-approval-min").val(formatCurrency($("#gross-approval-range-slider").slider("values", 0)));
        $("#gross-approval-max").val(formatCurrency($("#gross-approval-range-slider").slider("values", 1)));

        // Initialize the Average Gross Approval Range slider
        $("#average-gross-approval-range-slider").slider({
            range: true,
            min: 0,
            max: $("#average-gross-approval-range-slider").data("max-value"), // Get max value from data attribute
            values: [0, $("#average-gross-approval-range-slider").data("max-value")], // Set initial values
            slide: function (event, ui) {
                $("#average-gross-approval-min").val(formatCurrency(ui.values[0]));
                $("#average-gross-approval-max").val(formatCurrency(ui.values[1]));
            }
        });
        $("#average-gross-approval-min").val(formatCurrency($("#average-gross-approval-range-slider").slider("values", 0)));
        $("#average-gross-approval-max").val(formatCurrency($("#average-gross-approval-range-slider").slider("values", 1)));
    }

    // Assuming you have obtained maxGrossApproval and maxAverageGrossApproval from somewhere
    // Call the function to initialize the sliders with these values
    initializeSliders(maxGrossApproval, maxAverageGrossApproval);

    // Function to check if the second row of the data table is empty
    function isSecondRowEmpty() {
        const secondRowCells = $("#data-table-body tr:eq(1) td");
        let isEmpty = true;

        secondRowCells.each(function () {
            if ($(this).text().trim() !== "") {
                isEmpty = false;
                return false; // Exit the loop if any cell is not empty
            }
        });

        return isEmpty;
    }

    // Function to expand or collapse the container based on the second row of the data table
    function toggleContainerBasedOnRow() {
        if (isSecondRowEmpty()) {
            // If the second row is empty, collapse the container
            $("#filter-container").collapse("show");
            $("#filter-toggle").css("transform", "rotate(0deg)");
        } else {
            // If the second row has content, expand the container
            $("#filter-container").collapse("show");
            $("#filter-toggle").css("transform", "rotate(180deg)");
        }
    }

    // Call toggleContainerBasedOnRow initially
    toggleContainerBasedOnRow();

    // Toggle the filter container when the arrow is clicked
    $("#filter-toggle").on("click", function () {
        $("#filter-container").collapse("toggle");
        toggleContainerBasedOnRow(); // Toggle based on the current state after clicking
    });

    // Optional: Update the arrow icon when the container is shown/hidden
    $("#filter-container").on("shown.bs.collapse", function () {
        $("#filter-toggle").css("transform", "rotate(180deg)");
    });

    $("#filter-container").on("hidden.bs.collapse", function () {
        $("#filter-toggle").css("transform", "rotate(0deg)");
    });

    // Optional: Update the container state when the "Apply Filters" button is clicked
    $("#apply-filters-btn").on("click", function () {
        toggleContainerBasedOnRow();
    });

    // Event listener for the "Download Filtered Data" button
    $("#download-filtered-data-btn").on("click", function () {
        // You can add your download logic here
    });

    // Event listener for the "Sort" buttons
    $("th button").on("click", function () {
        const columnIndex = $(this).closest("th").index();
        const columnName = $(this).closest("th").data("column-name");
        sortTable(columnIndex, columnName);
    });

    // Call populateMultiSelect and fetchFilterChoices here
    fetchFilterChoices();
});

// Function to fetch filter choices and populate multi-select menus
function fetchFilterChoices() {
    fetch('/filter-choices/', {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Received data:', data); // Debugging: Log the received data

        // Ensure that the data structure matches the expected format
        if (Array.isArray(data.institution_names) && Array.isArray(data.project_states) && Array.isArray(data.county_state_values)) {
            // Populate the multi-select menus with filter choices
            populateMultiSelect('institution-search', data.institution_names, 'institutionname');
            populateMultiSelect('state-search', data.project_states, 'projectstate');
            populateMultiSelect('county-search', data.county_state_values, 'county_state');
        } else {
            console.error('Data format is not as expected.'); // Debugging: Log an error message
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle the error here
    });
}

// Function to populate multi-select with options
function populateMultiSelect(selectId, options, propertyName) {
    const selectElement = $(`#${selectId}`);

    // Extract the specified property values from the list of objects
    const propertyValues = options.map(option => option[propertyName]);

    selectElement.select2({
        data: propertyValues.map(value => ({ id: value, text: value })),
        width: '100%',
        placeholder: 'Select options',
        allowClear: true,
    });
}

document.getElementById('download-filtered-data-btn').addEventListener('click', function (event) {
    event.preventDefault();

    // Create a hidden anchor element
    const downloadLink = document.createElement('a');
    downloadLink.href = '/download_filtered_data/'; // Update with your download URL
    downloadLink.download = 'CustomSBALoanData.csv';
    document.body.appendChild(downloadLink);

    // Trigger the click event on the anchor element to start the download
    downloadLink.click();

    // Remove the anchor element from the DOM
    document.body.removeChild(downloadLink);

    // After initiating the download, send a request to the server to delete the file
    fetch('/delete-filtered-data/', {
        method: 'POST', // You can also use GET if you prefer
    }).then(function (response) {
        // Handle the server response, if needed
        console.log('File deletion response:', response);
    }).catch(function (error) {
        // Handle errors, if any
        console.error('Error deleting file:', error);
    });
});

// Obtain the CSRF token from the cookie
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Check if the cookie name matches the expected format (e.g., 'csrftoken=...')
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Include the CSRF token in the headers of your DELETE request
const csrftoken = getCookie('csrftoken');
fetch('/delete-filtered-data/', {
    method: 'DELETE',
    headers: {
        'X-CSRFToken': csrftoken,
    },
})
.then(function (response) {
    // Handle the server response
})
.catch(function (error) {
    // Handle errors
});

function createAndShowPopup() {
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
    modalText.textContent = "Greetings. This page is a temporary replacement for the Home/Dashboard page. The data populating the table is obtained via the SBA's API for SBA 7a and 504 loans between 2010 - Current. Utilizing Python, the loan data files are combined into a singular database table. Prior to posting to the table, various data cleaning methods are applied in an attempt to clean up the Lender data. However, due to the SBA's missing data fields for some historical data, I am left with either choosing to make assumptions about Lender names or allow what appears to be duplicate cases of the same Lender name. Out of an abundance of caution and desire not to assume, I have elected to proceed with the latter of the two options.";
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
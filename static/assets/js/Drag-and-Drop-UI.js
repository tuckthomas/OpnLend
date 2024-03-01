function setupQuickActionButtonPopup() {
    // Attach event listener to all buttons with the class 'quick-action-button'
    document.querySelectorAll('.quick-action-button').forEach(button => {
        button.addEventListener('click', function() {
            displayQuickActionPopup();
        });
    });
}

function displayQuickActionPopup() {
    const popupContainer = document.createElement('div');
    popupContainer.style.position = 'fixed';
    popupContainer.style.minWidth = '50%';
    popupContainer.style.top = '50%';
    popupContainer.style.left = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.display = 'flex';
    popupContainer.style.flexDirection = 'column';
    popupContainer.style.alignItems = 'center';
    popupContainer.style.backgroundColor = 'white';
    popupContainer.style.padding = '20px';
    popupContainer.style.border = '2px solid black';
    popupContainer.style.borderRadius = '10px';
    popupContainer.style.zIndex = '1000';
    popupContainer.style.boxSizing = 'border-box';

    const textWrapper = document.createElement('div');
    textWrapper.style.flexGrow = '1';
    textWrapper.innerText = 'Quick-Action Buttons are currently for demonstration purposes only and have not yet been configured. Please check back at a later date to test its functionality.';

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '0';
    closeButton.style.right = '0';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.color = 'black';
    closeButton.style.fontSize = '35px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.padding = '1px';
    closeButton.style.paddingRight = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
        document.body.removeChild(popupContainer);
    };

    popupContainer.appendChild(textWrapper);
    popupContainer.appendChild(closeButton);
    document.body.appendChild(popupContainer);
}

function adjustFontSize() {
  const draggableItems = document.querySelectorAll('.draggable-item');

  draggableItems.forEach(item => {
    const textLength = item.innerText.length;

    if (textLength > 100) {
      item.style.fontSize = '1em'; // Smaller font size for long text
    } else {
      item.style.fontSize = '1.5em'; // Default font size
    }
  });
}

function displayPopupMessage() {
    const popupContainer = document.createElement('div');
    popupContainer.style.position = 'fixed';
    popupContainer.style.minWidth = '50%'; // Corrected property name
    popupContainer.style.top = '50%';
    popupContainer.style.left = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.display = 'flex'; // Use 'flex' for better control of child elements
    popupContainer.style.flexDirection = 'column'; // Stack children vertically
    popupContainer.style.alignItems = 'center'; // Center-align children
    popupContainer.style.backgroundColor = 'white';
    popupContainer.style.padding = '20px';
    popupContainer.style.border = '2px solid black';
    popupContainer.style.borderRadius = '10px';
    popupContainer.style.zIndex = '1000';
    popupContainer.style.boxSizing = 'border-box'; // Ensure padding is included in width/height calculations
    // Create a wrapper for text to control its layout separately from the button
    const textWrapper = document.createElement('div');
    textWrapper.style.flexGrow = '1';
    textWrapper.innerText = 'A loan may only have a single Primary Borrower. If you\'d like to change the primary borrower, please remove the existing assigned Primary Borrower before reattempting to assign a new Primary Borrower. Alternatively, if you\'d like to add an additional Borrower to the loan, you may assign the account as a Co-Borrower.';

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;'; // Use HTML entity for 'X'
    closeButton.style.position = 'absolute';
    closeButton.style.top = '0';
    closeButton.style.right = '0';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.color = 'black';
    closeButton.style.fontSize = '35px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.padding = '1px';
    closeButton.style.paddingRight = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function () {
        document.body.removeChild(popupContainer);
    };

    // Append the text wrapper and close button to the popup container
    popupContainer.appendChild(textWrapper);
    popupContainer.appendChild(closeButton);
    document.body.appendChild(popupContainer);
}

function updateDeleteButton(item, columnId) {
    console.log(`updateDeleteButton called for item: ${item.id}, columnId: ${columnId}`);

    const existingButton = item.querySelector('.delete-assigned-account-role-button');
    
    // Check if the item is being moved back to the "Available-Accounts" column
    const isReturningToAvailableAccounts = columnId === 'Available-Accounts';
    
    if (existingButton) {
        // If the item is being moved back to Available-Accounts, remove the button
        if (isReturningToAvailableAccounts) {
            console.log(`Removing 'X' button for item: ${item.id}`);
            existingButton.remove();
        }
    } else {
        // Add the 'X' button when moving to a specific borrower column
        if (['Primary-Borrower', 'Co-Borrower', 'Guarantor'].includes(columnId)) {
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'X';
            deleteButton.classList.add('delete-assigned-account-role-button');
            item.appendChild(deleteButton);

            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const availableAccountsColumn = document.querySelector('.Draggable-Items[column-id="Available-Accounts"]');
                if (availableAccountsColumn) {
                    availableAccountsColumn.appendChild(item);
                    // Remove the 'X' button when item is returned to Available-Accounts
                    deleteButton.remove();
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', (event) => {

    setupQuickActionButtonPopup();
    adjustFontSize();
    
    let lastDroppedItem = null; // Keep track of the last dropped item
    let lastDropTime = 0; // Keep track of the last drop time

    const draggableItems = document.querySelectorAll('.draggable-item');
    const outerColumns = document.querySelectorAll('.column');
    const horizontalSections = document.querySelectorAll('.horizontal-section');

    draggableItems.forEach(draggable => {
        draggable.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', draggable.id);
        });
    });

    [...outerColumns, ...horizontalSections].forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
        });

        column.addEventListener('drop', e => {
            e.preventDefault();
            const now = Date.now();
            const itemId = e.dataTransfer.getData('text/plain');

            if (itemId === lastDroppedItem && (now - lastDropTime) < 100) {
                console.log(`Duplicate drop detected for ${itemId}, ignoring.`);
                return;
            }

            lastDroppedItem = itemId;
            lastDropTime = now;

            const item = document.getElementById(itemId);
            const targetColumn = e.target.closest('.horizontal-section, .column');
            const columnId = targetColumn.getAttribute('column-id');
            const existingItems = targetColumn.querySelectorAll('.draggable-item').length;

            if (columnId === 'Primary-Borrower' && existingItems >= 1) {
                displayPopupMessage();
            } else {document.addEventListener('DOMContentLoaded', (event) => {
    function displayPopupMessage() {
        const popupContainer = document.createElement('div');
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.backgroundColor = 'white';
        popupContainer.style.padding = '20px';
        popupContainer.style.border = '2px solid black';
        popupContainer.style.zIndex = '1000';
        popupContainer.innerText = 'A loan may only have a single Primary Borrower. If you\'d like to change the primary borrower, please remove the existing assigned Primary Borrower before reattempting to assign a new Primary Borrower. Alternatively, if you\'d like to add an additional Borrower to the loan, you may assign the account as a Co-Borrower.';

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.marginTop = '20px';
        closeButton.onclick = function () {
            document.body.removeChild(popupContainer);
        };

        popupContainer.appendChild(closeButton);
        document.body.appendChild(popupContainer);
    }

    function updateDeleteButton(item, columnId) {
        const existingButton = item.querySelector('.delete-assigned-account-role-button');
        
        if (columnId === 'Available-Accounts' && existingButton) {
            existingButton.remove();
        } else if (!existingButton && ['Primary-Borrower', 'Co-Borrower', 'Guarantor'].includes(columnId)) {
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'X';
            deleteButton.classList.add('delete-assigned-account-role-button');
            deleteButton.addEventListener('click', () => {
                item.remove(); // Optionally move item back to 'Available-Accounts' or simply remove the item
                // Implement logic to append the item back to 'Available-Accounts' if needed
            });
            item.appendChild(deleteButton);
        }
    }

    const draggableItems = document.querySelectorAll('.draggable-item');
    const dropZones = document.querySelectorAll('.column');

    draggableItems.forEach(item => {
        item.setAttribute('draggable', true);
        item.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text', item.id);
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
        });

        zone.addEventListener('drop', e => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text');
            const item = document.getElementById(id);
            const columnId = zone.getAttribute('column-id');
            const existingItems = zone.querySelectorAll('.draggable-item').length;

            if (columnId === 'Primary-Borrower' && existingItems >= 1) {
                displayPopupMessage();
                return;
            }

            zone.appendChild(item);
            updateDeleteButton(item, columnId);
        });
    });
});

                targetColumn.appendChild(item);
                updateDeleteButton(item, columnId);
                console.log(`Item: ${itemId} added to column: ${columnId}.`);
            }
        });
    });
});

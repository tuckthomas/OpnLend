var navbarContainer = document.getElementById('navbar-container');
var navbarToggler = document.getElementById('navbar-toggler');

// Add CSS for rounded corners
navbarContainer.style.borderRadius = '10px'; // You can adjust the value to your preference

navbarContainer.addEventListener('shown.bs.collapse', function () {
    console.log('Navbar shown');
    navbarToggler.style.justifyContent = 'flex-end';
});

navbarContainer.addEventListener('hidden.bs.collapse', function () {
    console.log('Navbar hidden');
    navbarToggler.style.justifyContent = 'flex-start';
});

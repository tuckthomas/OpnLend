fetch('/api/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
})
.then(response => {
  if (response.status === 200) {
    // User logged in successfully
  } else {
    // Handle  error
  }
});

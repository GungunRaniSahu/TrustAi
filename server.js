const app = require('./app'); // Import your app.js

const PORT = process.env.PORT || 8000; // Set the port for the server

// Start the server and log a message when it is up and running
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

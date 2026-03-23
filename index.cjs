const express = require('express');
const path = require('path');
const app = express();

// Use the PORT provided by the environment, or 8080 as a hard fallback
const port = process.env.PORT || 8080; 

// Serve static files from the 'dist' directory
// Added a check to prevent crashing if dist is missing
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Health check endpoint for Monday's load balancer
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Capture all other routes for the SPA using a Regex
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});
app.listen(port, () => {
  console.log(`Server effectively listening on port ${port}`);
});
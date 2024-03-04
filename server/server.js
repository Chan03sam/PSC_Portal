// Example server code (Node.js with Express)

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// In-memory storage for simplicity. In a real app, use a database.
const userTokens = {};

app.use(bodyParser.json());

// Endpoint to associate a user with a device token
app.post('/associate-token', (req, res) => {
  const { userId, token } = req.body;

  if (userId && token) {
    userTokens[userId] = token;
    res.status(200).json({ message: 'Token associated successfully' });
  } else {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Endpoint to send a notification to a user
app.post('/send-notification', (req, res) => {
  const { userId, message } = req.body;

  if (userId && userTokens[userId] && message) {
    // In a real-world scenario, you would use a library like 'firebase-admin' to send notifications.
    // This is a simplified example using console.log.
    console.log(`Sending notification to user ${userId}: ${message}`);
    
    res.status(200).json({ message: 'Notification sent successfully' });
  } else {
    res.status(400).json({ error: 'Invalid request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

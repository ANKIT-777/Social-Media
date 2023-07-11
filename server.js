// server.js

const express = require('express');
const app = express();
const db = require('./database/db');
const userRoutes = require('./routes/route');

app.use(express.json());

app.use('/users', userRoutes);
// server.js

require('dotenv').config();


// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
const port = 3030;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

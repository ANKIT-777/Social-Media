// server.js

const express = require('express');
const app = express();
const db = require('./database/db');
const userRoutes = require('./routes/route');

app.use(express.json());

app.use('/users', userRoutes);


require('dotenv').config();


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const port = 3030;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

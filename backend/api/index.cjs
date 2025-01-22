const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { albums } = require('../handlers/albums');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.get('/api/albums',  albums);

app.listen(5000, () => console.log('Server is running on http://localhost:5000'));

module.exports = app;
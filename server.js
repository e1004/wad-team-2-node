const express = require('express');
const pool = require('./database');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});

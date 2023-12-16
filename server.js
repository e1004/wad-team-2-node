const express = require('express');
const pool = require('./database');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});

app.post('/posts', async (req, res) => {
  try {
    const { authorName, authorEmail, text } = req.body;
    const newPost = await pool.query(
      `INSERT INTO post(
        author_name,
        author_email,
        text) VALUES ($1, $2, $3)
        RETURNING *`,
      [authorName, authorEmail, text],
    );
    res
      .status(201)
      .json({ key: newPost.rows[0] });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

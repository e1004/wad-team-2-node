const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const express = require('express');
const pool = require('./database');

const port = process.env.PORT || 3000;
const secret = 'suvaline';
const maxAge = 60 * 60; // milliseconds

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());
app.use(morgan('tiny'));

app.listen(port, () => {});

app.post('/posts', async (req, res) => {
  try {
    const { userId, text } = req.body;
    const newPost = await pool.query(
      `INSERT INTO post(
        user_id,
        text) VALUES ($1, $2)
        RETURNING *`,
      [userId, text],
    );
    res
      .status(201)
      .json({ data: newPost.rows[0] });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.get('/posts', async (req, res) => {
  const posts = await pool.query(
    'SELECT * FROM post',
    [],
  );
  res.status(200).json({ data: posts.rows });
});

app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await pool.query(
    'SELECT * FROM post WHERE id=$1',
    [postId],
  );
  if (post.rows.length === 0) {
    res.status(404).json({ error: 'Post not found' });
  } else {
    res.status(200).json({ data: post.rows[0] });
  }
});

app.delete('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  await pool.query(
    'DELETE FROM post WHERE id=$1',
    [postId],
  );
  res.status(204).send();
});

app.delete('/posts', async (req, res) => {
  await pool.query(
    'DELETE FROM post',
    [],
  );
  res.status(204).send();
});

app.patch('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const { text } = req.body;
  const updatedPost = await pool.query(
    'UPDATE post SET text=$1 WHERE id=$2 RETURNING *',
    [text, postId],
  );
  if (updatedPost.rows.length === 0) {
    res.status(404).json({ error: 'Post not found' });
  } else {
    res.status(200).json({ data: updatedPost.rows[0] });
  }
});

const generateJWT = (id) => jwt.sign({ id }, secret, { expiresIn: maxAge });

app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const bcryptPassword = await bcrypt.hash(password, salt);
    const authUser = await pool.query(
      `INSERT INTO app_user(email,password)
        VALUES ($1, $2)
        RETURNING *`,
      [email, bcryptPassword],
    );
    const token = await generateJWT(authUser.rows[0].id);
    res
      .status(201)
      .cookie('jwt', token, { maxAge, httpOnly: true })
      .json({ user_id: authUser.rows[0].id, user_email: authUser.rows[0].email });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

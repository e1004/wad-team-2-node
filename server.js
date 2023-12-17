const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const express = require('express');
const pool = require('./database');

const port = process.env.PORT || 3000;
const secret = 'suvaline';
const maxAge = 6000000; // milliseconds

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());
app.use(cookieParser());
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
    res.status(201).json({ data: newPost.rows[0] });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.get('/posts', async (req, res) => {
  const posts = await pool.query('SELECT * FROM post', []);
  res.status(200).json({ data: posts.rows });
});

app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await pool.query('SELECT * FROM post WHERE id=$1', [postId]);
  if (post.rows.length === 0) {
    res.status(404).json({ error: 'Post not found' });
  } else {
    res.status(200).json({ data: post.rows[0] });
  }
});

app.delete('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  await pool.query('DELETE FROM post WHERE id=$1', [postId]);
  res.status(204).send();
});

app.delete('/posts', async (req, res) => {
  await pool.query('DELETE FROM post', []);
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
    if (email.length === 0 || password.length === 0) {
      return res.status(400).json({ error: 'Email or pwd is missing' });
    }
    const salt = await bcrypt.genSalt();
    const bcryptPassword = await bcrypt.hash(password, salt);
    const authUser = await pool.query(
      `INSERT INTO app_user(email,password)
        VALUES ($1, $2)
        RETURNING *`,
      [email, bcryptPassword],
    );
    const token = await generateJWT(authUser.rows[0].id);
    return res.status(201).cookie('jwt', token, { maxAge, httpOnly: true }).json({
      user_id: authUser.rows[0].id,
      user_email: authUser.rows[0].email,
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM app_user WHERE email = $1', [
      email,
    ]);
    if (email.length === 0 || password.length === 0) {
      return res.status(400).json({ error: 'Email or pwd is missing' });
    }
    if (user.rows.length === 0) return res.status(401).json({ error: 'User is not registered' });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(401).json({ error: 'Incorrect password' });

    const token = await generateJWT(user.rows[0].id);
    return res
      .status(201)
      .cookie('jwt', token, { maxAge, httpOnly: true })
      .json({ user_id: user.rows[0].id });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

app.get('/auth/logout', (req, res) => {
  res.status(204).clearCookie('jwt').json();
});

app.get('/auth/authenticate', async (req, res) => {
  const token = req.cookies.jwt;
  let authenticated = false;
  try {
    if (token) {
      await jwt.verify(token, secret, (err) => {
        if (err) {
          res.send({ authenticated });
        } else {
          authenticated = true;
          res.send({ authenticated });
        }
      });
    } else {
      res.send({ authenticated });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, Request } = require('./models');
const cors=require("cors");

const app = express();
app.use(cors());
const port = 3000;
const secretKey = 'your_secret_key';

app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
  const { name, email, password, type } = req.body;
  try {
    const user = await User.create({ name, email, password, type });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, type: user.type }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

app.get('/dashboard', authenticate, async (req, res) => {
  try {
    if (req.user.type === 'creator') {
      const businesses = await User.findAll({ where: { type: 'business' }, attributes: ['id', 'name', 'email'] });
      res.json(businesses);
    } else if (req.user.type === 'business') {
      const creators = await User.findAll({ where: { type: 'creator' }, attributes: ['id', 'name', 'email'] });
      res.json(creators);
    } else {
      res.status(400).json({ error: 'Invalid user type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/request', authenticate, async (req, res) => {
  const { toUserId, message } = req.body;
  try {
    const request = await Request.create({ fromUserId: req.user.id, toUserId, message });
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/requests', authenticate, async (req, res) => {
  try {
    if (req.user.type === 'creator') {
      const requests = await Request.findAll({ where: { fromUserId: req.user.id }, include: [{ model: User, as: 'toUser', attributes: ['id', 'name', 'email'] }] });
      res.json(requests);
    } else if (req.user.type === 'business') {
      const requests = await Request.findAll({ where: { toUserId: req.user.id }, include: [{ model: User, as: 'fromUser', attributes: ['id', 'name', 'email'] }] });
      res.json(requests);
    } else {
      res.status(400).json({ error: 'Invalid user type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  sequelize.sync();
});

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const { sequelize, Operation } = require('./db');

const app = express();


const users = [
  { id: 1, username: 'test', password: 'test' }
];


passport.use(new LocalStrategy((username, password, done) => {
  const user = users.find(u => u.username === username);
  if (!user) {
    return done(null, false, { message: 'Incorrect username.' });
  }
  if (user.password !== password) {
    return done(null, false, { message: 'Incorrect password.' });
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                     failureRedirect: '/login' }));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


app.post('/save-operation', async (req, res) => {
  const { expression, result } = req.body;
  try {
    const operation = await Operation.create({ expression, result });
    res.status(201).json(operation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save operation' });
  }
});


app.get('/operations', async (req, res) => {
    try {
      const operations = await Operation.findAll();
      res.status(200).json(operations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve operations' });
    }
  });
  app.delete('/delete-operation/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const operation = await Operation.findByPk(id);
      if (!operation) {
        return res.status(404).json({ error: 'Operation not found' });
      }
      await operation.destroy();
      res.status(200).json({ message: 'Operation deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete operation' });
    }
  });

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});


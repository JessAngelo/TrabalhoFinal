const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === '123456') {
    req.session.username = username;
    res.cookie('lastAccess', new Date().toLocaleString());
    res.redirect('/menu');
  } else {
    res.render('login', { error: 'Usuário ou senha inválidos' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;

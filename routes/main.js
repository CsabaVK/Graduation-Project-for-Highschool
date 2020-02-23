/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
  // res.sendFile(path.join(__dirname + '/views/index.html'));
  // res.send('Hello World!');
});

router.get('/profile', (req, res) => {
  res.render('profile');
});


module.exports = router;

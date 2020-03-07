/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const marketAds = require('../market.example.json');
  // res.json(marketAds);
  res.render('index', {
    marketAds: marketAds,
  });
  // res.sendFile(path.join(__dirname + '/views/index.html'));
  // res.send('Hello World!');
});

router.get('/profile', (req, res) => {
  res.render('profile');
});

router.get('/hirdetes', (req, res) => {
  res.render('hirdetesMegtekint');
});


module.exports = router;

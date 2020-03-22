/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // res.json(marketAds);
  // res.sendFile(path.join(__dirname + '/views/index.html'));
  // res.send('Hello World!');
  // res.json(req.session);

  const marketAds = require('../market.example.json');
  // req.session.user = 1;
  res.render('index', {
    url: req.url,
    session: req.session.user,
    marketAds: marketAds,
  });
  // console.log(req.session.user);
});

router.get('/test', (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.end(req.session.views + ' views');
});

router.get('/profile', (req, res) => {
  res.render('profile', {
    url: req.url,
  });
});

router.get('/ads', (req, res) => {
  res.render('adsView', {
    url: req.url,
  });
});

/*
router.get('/ads/:asdasd', (req, res) => {
  console.log(req.params.asdasd);
  // select from where id = req.params.asdasd
  res.render('adsView', {
    url: req.url,
  });
});
*/


module.exports = router;

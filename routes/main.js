/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
  // res.sendFile(path.join(__dirname + '/views/index.html'));
  // res.send('Hello World!');
});

module.exports = router;

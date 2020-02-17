/* eslint-disable require-jsdoc */
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'));
  // res.send('Hello World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

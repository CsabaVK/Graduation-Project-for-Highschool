/* eslint-disable require-jsdoc */
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

const cookieTime = 30 * 24 * 60 * 60 * 1000;
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: cookieTime,
  expires: new Date(Date.now() + cookieTime),
}));

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/public', express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', require('./routes/main'));
app.use('/account', require('./routes/account'));

app.listen(port, () => console.log(`App listening on port ${port}!`));
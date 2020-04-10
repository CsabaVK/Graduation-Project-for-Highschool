/* eslint-disable require-jsdoc */
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

// set cookie session
const cookieTime = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: cookieTime,
  expires: new Date(Date.now() + cookieTime),
}));

// bodyParses is needed to get form post inputs inside a request
app.use(bodyParser.urlencoded({
  extended: false,
}));

// set public folder to /public
app.use('/public', express.static('public'));
// Set view enginge to ejs and set views folder to views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set and use routes
app.use('/', require('./routes/main'));
app.use('/account', require('./routes/account'));

// this sets the port
app.listen(port, () => console.log(`App listening on port ${port}!`));

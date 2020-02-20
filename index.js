/* eslint-disable require-jsdoc */
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// set and use routes
const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

// set public folder to public
app.use('/public', express.static('public'));

// Set view enginge to ejs and set views folder to views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(port, () => console.log(`App listening on port ${port}!`));

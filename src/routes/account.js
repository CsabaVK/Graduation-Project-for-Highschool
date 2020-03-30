/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const pwHash = require('password-hash');
const syncSql = require('sync-sql');

const sqlData = require('../sqldata.json');

router.get('/', (req, res) => {
  const marketAds = require('../market.example.json');
  res.render('index', {
    url: req.url,
    marketAds: marketAds,
  });
});

router.get('/profile', (req, res) => {
  if (req.session.user) {
    const getProfileDetails = syncSql.mysql(sqlData, `SELECT * FROM users WHERE id='${req.session.user}'`);
    const marketAds = syncSql.mysql(sqlData, `SELECT market.id, users.username, title, price, fuel_type, year, cubic_capacity, horsepower, milage FROM market INNER JOIN users ON users.id=market.ownerid WHERE ownerid='${req.session.user}'`);
    res.render('profile', {
      url: req.url,
      session: req.session.user,
      userdata: getProfileDetails.data.rows[0],
      marketAds: marketAds.data.rows,
    });
  } else {
    res.redirect('/');
  }
});

router.post('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  const username = req.body.username;
  const password = req.body.password;
  const getUserDetails = syncSql.mysql(sqlData, `SELECT id, username, password FROM users WHERE username='${username}'`);
  if (getUserDetails.success) {
    if (getUserDetails.data.rows.length > 0) {
      if (pwHash.verify(password, getUserDetails.data.rows[0].password)) {
        req.session.user = getUserDetails.data.rows[0].id;
        res.redirect('/');
      } else {
        renderPage(req, res, 'index', 'danger', 'Wrong password');
      }
    } else {
      renderPage(req, res, 'index', 'danger', 'User does not exist');
    }
  } else {
    renderPage(req, res, 'index', 'danger', 'Database error');
  }
});

function getCurrentDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

router.post('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password;
  const email = req.body.email;
  const birthdate = req.body.birth_date;
  const languageselector = 'English';
  let errorMessage = '';
  if (checkIfUserExists(email)) {
    errorMessage += 'The user already exists!';
  } else {
    if (email && password && password2) {
      if ((/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/.test(username)) && (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g.test(email)) && (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{3,20}$/g.test(password))) {
        if (password == password2) {
          const inserted = syncSql.mysql(sqlData, `INSERT INTO users (username, password, email, birth_date, language, register_date) VALUES('${username}', '${pwHash.generate(password)}', '${email}', '${birthdate}', '${languageselector}', '${getCurrentDate()}')`);
          if (inserted.success == false) {
            renderPage(req, res, 'index', 'danger', 'Database error!');
          } else {
            renderPage(req, res, 'index', 'success', 'Registration success!');
          }
          return;
        } else {
          errorMessage += 'The passwords are not the same!';
        }
      } else {
        errorMessage += 'Username/email or password is wrong! Password needs to be between 3 and 20 characters and must contain atleast an uppercase letter and a number.';
      }
    } else {
      errorMessage += 'You can\'t leave anything empty!';
    }
  }
  renderPage(req, res, 'index', 'danger', errorMessage);
  return;
});

function checkIfUserExists(userEmail) {
  const exists = syncSql.mysql(sqlData, `SELECT email FROM users WHERE email='${userEmail}'`);
  if (exists && exists.data && exists.data.rows && exists.data.rows[0] && exists.data.rows[0].email) {
    return true;
  } else {
    return false;
  }
}

function renderPage(req, res, pageURI, type, message) {
  res.render(pageURI, {
    marketAds: require('../market.example.json'),
    url: req.url,
    session: req.session.user,
    alert: {
      type: type,
      message: message,
    },
  });
}

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

module.exports = router;
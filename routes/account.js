/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const pwHash = require('password-hash');
const syncSql = require('sync-sql');

const sqlData = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'okjproject',
};

router.get('/', (req, res) => {
  const marketAds = require('../market.example.json');
  res.render('index', {
    url: req.url,
    marketAds: marketAds,
  });
});

router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password;
  const email = req.body.email;
  const birthdate = req.body.birth_date;
  const languageselector = 'English';
  // res.json(req.body);
  let errorMessage = '';
  if (checkIfUserExists(email)) {
    errorMessage += 'The user already exists!';
  } else {
    if (email && password && password2) {
      // https://regexr.com/
      if ((/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/.test(username)) && (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g.test(email)) && (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{3,20}$/g.test(password))) {
        if (password == password2) {
          const inserted = syncSql.mysql(sqlData, `INSERT INTO users (username, password, email, birth_date, lang) VALUES('${username}', '${pwHash.generate(password)}', '${email}', '${birthdate}', '${languageselector}')`);
          // res.json(inserted);
          if (inserted.success == 'false') {
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

function checkIfUserExists(userEmail) {
  const exists = syncSql.mysql(sqlData, 'SELECT email FROM users WHERE email=\'' + userEmail + '\'');
  if (exists && exists.data && exists.data.rows && exists.data.rows[0] && exists.data.rows[0].email) {
    return true;
  } else {
    return false;
  }
}

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});


router.get('/testlogin', (req, res) => {
  req.session.user = 1;
  res.redirect('/');
});

module.exports = router;

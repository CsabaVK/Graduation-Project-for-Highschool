/* eslint-disable camelcase */
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
    const marketAds = syncSql.mysql(sqlData, `SELECT market.*, users.username FROM market INNER JOIN users ON users.id=market.ownerid WHERE ownerid='${req.session.user}'`);

    // console.log(getProfileDetails);
    if (getProfileDetails.data.rows[0].birth_date == '0000-00-00') {
      getProfileDetails.data.rows[0].birth_date = undefined;
    }

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

router.get('/profile/:id', (req, res) => {
  if (req.session.user == req.params.id) {
    return res.redirect('/account/profile');
  }
  const getProfileDetails = syncSql.mysql(sqlData, `SELECT * FROM users WHERE id='${req.params.id}'`);
  if (getProfileDetails.data.rows.length == 0) {
    return res.redirect('/');
  }
  const marketAds = syncSql.mysql(sqlData, `SELECT market.*, users.username FROM market INNER JOIN users ON users.id=market.ownerid WHERE ownerid='${req.params.id}'`);
  if (getProfileDetails.data.rows[0].birth_date == '0000-00-00') {
    getProfileDetails.data.rows[0].birth_date = undefined;
  }
  res.render('profile', {
    url: req.url,
    session: req.session.user,
    userdata: getProfileDetails.data.rows[0],
    marketAds: marketAds.data.rows,
  });
});

router.post('/editprofile', (req, res) => {
  const userDetails = syncSql.mysql(sqlData, `SELECT password FROM users WHERE id='` + req.session.user + `'`);
  const password = req.body.password;
  if (pwHash.verify(password, userDetails.data.rows[0].password)) {
    const phone = req.body.phone;
    const email = req.body.email;
    const birth_date = req.body.birth_date;
    const country = req.body.country;
    syncSql.mysql(sqlData, `UPDATE users SET phone='` + phone + `', email='` + email + `', birth_date='` + birth_date + `', country='` + country + `' WHERE id='` + req.session.user + `'`);
    res.redirect('/account/profile');
  } else {
    // TODO: alert should popup
    // console.log('Password does not match');
    res.redirect('/account/profile');
  }
});

router.post('/changepassword', (req, res) => {
  const oldPw = req.body.password;
  const newPw = req.body.password1;
  const newPwAgain = req.body.password2;
  if (oldPw && newPw && newPwAgain) {
    if (newPw == newPwAgain) {
      const getPassword = syncSql.mysql(sqlData, `SELECT password FROM users WHERE id='` + req.session.user + `'`);
      if (pwHash.verify(oldPw, getPassword.data.rows[0].password)) {
        syncSql.mysql(sqlData, `UPDATE password='` + pwHash.generate(newPw) + `' WHERE id='` + req.session.user + `'`);
        res.redirect('/account/logout');
      } else {
        // the old password doesnt match your current password, whats wrong with you?
        console.log('Old password is going insane bruh.');
      }
    } else {
      // the new passwords must match
      console.log('New passwords are not matching bruv.');
    }
  } else {
    // you must tell everything about the passwords
    console.log('Something is missing... What happened??');
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
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();

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
      if ((/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/.test(username)) && (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g.test(email)) && (/^(?=.*[a-z])(?=.*\d).{3,20}$/g.test(password))) {
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
        errorMessage += 'Username/email or password is wrong! Password needs to be between 3 and 20 characters and must contain a number.';
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
  const marketAds = syncSql.mysql(sqlData, `SELECT market.*, users.username FROM market INNER JOIN users ON users.id=market.ownerid;`);
  res.render(pageURI, {
    url: req.url,
    session: req.session.user,
    marketAds: marketAds.data.rows,
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

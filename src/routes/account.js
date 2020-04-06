/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const pwHash = require('password-hash');
const syncSql = require('sync-sql');

// these are needed for file upload
const multer = require('multer');
const upload = multer({dest: '/uploads'});

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

router.post('/changepicture', upload.single('photos'), (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const tempPath = req.file.path;
  const originalName = req.file.originalname;
  const extension = path.extname(originalName).toLowerCase();
  if (extension === '.png' || extension === '.jpg' || extension === '.jpeg') {
    const targetPath = path.join(__dirname, '../public/img/uploads/users/' + req.session.user + '.png');
    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        renderProfilePage(req, res, 'warning', 'Something went wrong. Try again later.');
      } else {
        res.redirect('/account/profile');
      }
    });
  } else {
    fs.unlink(tempPath, (err) => {
      renderProfilePage(req, res, 'danger', 'Wrong extension! Only png, jpg and jpeg are allowed.');
    });
  }
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
    renderProfilePage(req, res, 'danger', 'Your current password is wrong!');
  }
});

router.post('/changepassword', (req, res) => {
  const oldPw = req.body.password;
  const newPw = req.body.newpassword1;
  const newPwAgain = req.body.newpassword2;
  if (oldPw && newPw && newPwAgain) {
    if (newPw == newPwAgain) {
      if ((/^(?=.*[a-z])(?=.*\d).{3,20}$/g.test(newPw))) {
        const getPassword = syncSql.mysql(sqlData, `SELECT password FROM users WHERE id='` + req.session.user + `'`);
        if (pwHash.verify(oldPw, getPassword.data.rows[0].password)) {
          syncSql.mysql(sqlData, `UPDATE users SET password='` + pwHash.generate(newPw) + `' WHERE id='` + req.session.user + `'`);
          res.redirect('/account/logout');
        } else {
          // the old password doesnt match your current password, whats wrong with you?
          renderProfilePage(req, res, 'danger', 'Old password is wrong!');
        }
      } else {
        renderProfilePage(req, res, 'danger', 'New password requirements are not fulfilled.');
      }
    } else {
      // the new passwords must match
      renderProfilePage(req, res, 'danger', 'New passwords are not matching.');
    }
  } else {
    // you must tell everything about the passwords
    renderProfilePage(req, res, 'danger', 'Something is missing!');
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
        renderMainPage(req, res, 'danger', 'Wrong password');
      }
    } else {
      renderMainPage(req, res, 'danger', 'User does not exist');
    }
  } else {
    renderMainPage(req, res, 'danger', 'Database error');
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
      if ((/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-|.| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/.test(username)) && (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g.test(email)) && (/^(?=.*[a-z])(?=.*\d).{3,20}$/g.test(password))) {
        if (password == password2) {
          const sqlQuery = birthdate == '' ? `INSERT INTO users (username, password, email, language, register_date) VALUES('${username}', '${pwHash.generate(password)}', '${email}', '${languageselector}', '${getCurrentDate()}')` : `INSERT INTO users (username, password, email, birth_date, language, register_date) VALUES('${username}', '${pwHash.generate(password)}', '${email}', '${birthdate}', '${languageselector}', '${getCurrentDate()}')`;
          const inserted = syncSql.mysql(sqlData, sqlQuery);
          if (inserted.success == false) {
            renderMainPage(req, res, 'warning', 'Database error!');
            console.log('Registration database error: ' + JSON.stringify(inserted));
          } else {
            renderMainPage(req, res, 'success', 'Registration success!');
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
  renderMainPage(req, res, 'danger', errorMessage);
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

function renderMainPage(req, res, type, message) {
  const marketAds = syncSql.mysql(sqlData, `SELECT market.*, users.username FROM market INNER JOIN users ON users.id=market.ownerid;`);
  res.render('index', {
    url: req.url,
    session: req.session.user,
    marketAds: marketAds.data.rows,
    alert: {
      type: type,
      message: message,
    },
  });
}

function renderProfilePage(req, res, type, message) {
  const getProfileDetails = syncSql.mysql(sqlData, `SELECT * FROM users WHERE id='${req.session.user}'`);
  const marketAds = syncSql.mysql(sqlData, `SELECT market.*, users.username FROM market INNER JOIN users ON users.id=market.ownerid WHERE ownerid='${req.session.user}'`);
  if (getProfileDetails.data.rows[0].birth_date == '0000-00-00') {
    getProfileDetails.data.rows[0].birth_date = undefined;
  }
  res.render('profile', {
    url: req.url,
    session: req.session.user,
    userdata: getProfileDetails.data.rows[0],
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

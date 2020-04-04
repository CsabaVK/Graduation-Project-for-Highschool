/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const syncSql = require('sync-sql');

// these are needed for file upload
const multer = require('multer');
const upload = multer({dest: '/uploads'});

const sqlData = require('../sqldata.json');

router.get('/', (req, res) => {
  const marketAds = syncSql.mysql(sqlData, `SELECT market.*, users.id AS "userid", users.username FROM market INNER JOIN users ON users.id=market.ownerid;`);
  // res.json(marketAds);
  res.render('index', {
    url: req.url,
    session: req.session.user,
    marketAds: marketAds.data.rows,
  });
});

router.get('/marketad/:id', (req, res) => {
  const marketAd = syncSql.mysql(sqlData, `SELECT * FROM market WHERE id=${req.params.id}`);
  // res.json(marketAd);
  res.render('adsView', {
    url: req.url,
    session: req.session.user,
    marketAd: marketAd.data.rows[0],
  });
});

router.post('/newmarketad', upload.array('photos', 6), (req, res) => {
  const title = req.body.title;
  const price = req.body.price;
  const make = req.body.make;
  const model = req.body.model;
  const shape = req.body.shape;
  const fuel_type = req.body.fuel_type;
  const horsepower = req.body.horsepower;
  const cubic_capacity = req.body.cubic_capacity;
  const milage = req.body.milage;
  const year = req.body.year;
  const doors = req.body.doors;
  const seats = req.body.seats;
  const description = req.body.description;

  // upload to database without checking the uploaded photos
  const result = syncSql.mysql(sqlData,
      `INSERT INTO market (ownerid, created_at, title, price, make, model, shape, fuel_type, horsepower, cubic_capacity, milage, year, doors, seats, description) VALUES ('` +
    req.session.user + `', '` + getCurrentDate() + `', '` + title + `', '` + price + `', '` + make + `', '` + model + `', '` + shape + `', '` + fuel_type + `', '` + horsepower + `', '` + cubic_capacity + `', '` +
    milage + `', '` + year + `', '` + doors + `', '` + seats + `', '` + description + `')`);

  // upload pictures
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(__dirname, '../public/img/uploads/market/' + result.data.rows.insertId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  // iterate over each uploaded file
  for (let i = 0; i < req.files.length; i++) {
    const tempPath = req.files[i].path;
    const originalName = req.files[i].originalname;
    const extension = path.extname(originalName).toLowerCase();

    if (extension === '.png' || extension === '.jpg') {
      const targetPath = path.join(__dirname, '../public/img/uploads/market/' + result.data.rows.insertId + '/' + i + '.png');
      fs.rename(tempPath, targetPath, (err) => {
        console.log('File uploaded: ' + targetPath);
      });
    } else {
      fs.unlink(tempPath, (err) => {
        console.log('Only .png files are allowed!');
      });
    }
  }
  res.redirect('/marketad/' + result.data.rows.insertId);
});

function getCurrentDate() {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

module.exports = router;

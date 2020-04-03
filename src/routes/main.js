/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const syncSql = require('sync-sql');

const sqlData = require('../sqldata.json');

router.get('/', (req, res) => {
  const marketAds = syncSql.mysql(sqlData, `SELECT market.id, users.username, title, price, fuel_type, year, cubic_capacity, horsepower, milage FROM market INNER JOIN users ON users.id=market.ownerid;`);
  // res.json(marketAds);
  res.render('index', {
    url: req.url,
    session: req.session.user,
    marketAds: marketAds.data.rows,
  });
});

router.get('/test', (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.end(req.session.views + ' views');
});

router.get('/ads/:id', (req, res) => {
  const marketAd = syncSql.mysql(sqlData, `SELECT * FROM market WHERE id=${req.params.id}`)
  // res.json(marketAd);
  res.render('adsView', {
    url: req.url,
    session: req.session.user,
    marketAd: marketAd.data.rows[0],
  });
});

router.post('/newmarketad', (req, res) => {
  // TODO: Upload
  // return res.json(req.body);
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

  const result = syncSql.mysql(sqlData, 
    `INSERT INTO market (ownerid, created_at, title, price, make, model, shape, fuel_type, horsepower, cubic_capacity, milage, year, doors, seats, description) VALUES ('` 
    + req.session.user + `', '` + getCurrentDate() + `', '` + title + `', '` + price + `', '` + make + `', '` + model + `', '` + shape + `', '` + fuel_type + `', '` + horsepower + `', '` + cubic_capacity + `', '` +
    milage + `', '` + year +  `', '` + doors + `', '` + seats + `', '` + description + `')`);

  // res.json(result);
  res.redirect('/');
});

function getCurrentDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

module.exports = router;

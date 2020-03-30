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
  //res.json(marketAd);
  res.render('adsView', {
    url: req.url,
    session: req.session.user,
    marketAd: marketAd.data.rows[0],
  });
});

module.exports = router;
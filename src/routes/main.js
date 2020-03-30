/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const syncSql = require('sync-sql');

const sqlData = require('../sqldata.json');

router.get('/', (req, res) => {
  const marketAds = syncSql.mysql(sqlData, `SELECT id, users.username, make, model, price, fuel_type, year, milage FROM market INNER JOIN users ON users.id=market.owner_id;`);
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
  res.render('adsView', {
    url: req.url,
    session: req.session.user,
  });
});

module.exports = router;
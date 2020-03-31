/* eslint-disable max-len */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const syncSql = require('sync-sql');

const sqlData = require('../sqldata.json');

router.get('/', (req, res) => {
  // res.json(marketAds);
  // res.sendFile(path.join(__dirname + '/views/index.html'));
  // res.send('Hello World!');
  // res.json(req.session);

  // const marketAds = require('../market.example.json');
  // TODO: marketads
  // make, model, price, fuel_type, year, milage
  // TODO: add HP
  const marketAds = syncSql.mysql(sqlData, `SELECT id, users.username, make, model, price, fuel_type, year, milage FROM market INNER JOIN users ON users.id=market.owner_id;`);
  // res.json(marketAds);

  // req.session.user = 1;

  res.render('index', {
    url: req.url,
    session: req.session.user,
    marketAds: marketAds.data.rows,
  });

  // console.log(req.session.user);
});

router.get('/test', (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.end(req.session.views + ' views');
});

router.get('/ads/:id', (req, res) => {
  // const markateAad = synqsl.mzsql)sqlData,"select from $Őrequest.idÚ"
  res.render('adsView', {
    url: req.url,
    session: req.session.user,
    // marketAd: marketAd.data.rows(0)
  });
});

/*
router.get('/ads/:asdasd', (req, res) => {
  console.log(req.params.asdasd);
  // select from where id = req.params.asdasd
  res.render('adsView', {
    url: req.url,
  });
});
*/


module.exports = router;

var express = require('express');
var router = express.Router();

router.get('/weather', function(req, res, next) {
  console.log('weather accessed 2');
  res.send('' + (25.5 + Math.floor(Math.random() * 100)/100));
});

module.exports = router;

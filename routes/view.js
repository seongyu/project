var express = require('express');
var router = express.Router();


/* set Data */
router.get('/login', function(req, res, next) {
  res.render('index');
});

/* set Data */
router.get('/', function(req, res, next) {
  res.redirect('login')
});

module.exports = router;

var express = require('express');
var router = express.Router();
var path = require('path');

var indexfile = path.join(path.resolve(process.cwd(), '..'), 'views', 'index.html');

/* GET home page. */
router.get('/', function(req, res) {
  res.sendfile(indexfile);
});

module.exports = router;

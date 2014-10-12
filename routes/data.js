var express = require('express');
var router = express.Router();
var path = require('path');

var rootpath = path.resolve(process.cwd(), '..');

/* GET data listing. */
router.get('/', function(req, res) {
  res.send('yyy');
});
router.get('/products', function(req, res) {
  var prodfile = path.join(rootpath, 'public/data', 'products.json');
  res.sendfile(prodfile);
  console.log("Name:    " + req.params.name);
  //console.log("Country: " + req.body.music.country);
});
router.post('/products', function(req, res) {
  res.send("{ 'aviation': 'HB'}");
  console.log("Name:    " + req.body.name);
  //console.log("Country: " + req.body.music.country);
});

module.exports = router;

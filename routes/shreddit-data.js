/*
 GET     /postings                      // get all postings
 POST    /postings                      // create new posting
 GET     /postings/:PID                 // get posting with PID
 (PUT    /postings/:PID                 // update posting with PID)
 DELETE  /postings/:PID                 // delete posting with PID

 GET     /comments/:PID                 // get all comments for posting with PID
 POST    /comments/:PID                 // create new comment for posting with PID
 DELETE  /comments/:CID                 // delete comment with CID

 PUT     /ratings/:PID/:USER/:STARS     // add/change rating for posting with PID and USER with STARS (0 .. 5)

 GET     /session/:USER                 // get user-settings for USER
 POST    /session/:USER/:PWD            // register with USER (username) and PWD (password)
 PUT     /session/:USER                 // update user-setting for USER
 POST    /login/:USER/:PWD              // login user with USER (username) and PWD (password)
 POST    /logout/:USER                  // logout user with USER (username)
 */

var express = require('express');
var router = express.Router();
// var path = require('path');
var shredditUtil = require('../server/shreddit-utils');

var Nedb = require('nedb');
var postings = new Nedb({ filename: '../server/db/postings', autoload: true });
var comments = new Nedb({ filename: '../server/db/comments', autoload: true });

// GET     /postings                      // get all postings
router.get('/postings', function(req, res) {

  postings.find({}, function(err, docs) {
    if (docs.length <= 0) {
      console.log('the databas <posting> has no element');
      res.json(docs);
    } else {
      console.log('the databas <posting> has ' + docs.length + ' elements');

      var order = req.param("order");
      if (order === "TOP") {
        res.json(shredditUtil.sortOrderTopRated(docs));
      } else if (order === "MY") {
        res.json(shredditUtil.sortOrderMyPostings(docs, req.param("user")));
      } else {
        res.json(shredditUtil.sortOrderLatest(docs));
      }
    }
  });
});

// POST    /postings                      // create new posting
router.post("/postings", function(req, res) {
  // res.json(DB.createPosting(req.body.user, req.body.title, req.body.content, req.body.link, req.body.url, req.body.tags));
});

// GET     /postings/:PID                 // get posting with PID
router.get("/postings/:PID", function(req, res) {
  // res.json(DB.getPosting(req.params.PID));
});

// DELETE  /postings/:PID                 // delete posting with PID
router.delete("/", function(req, res) {
  // res.json(DB.deletePosting(req.params.PID));
});

// GET     /comments/:PID                 // get all comments for posting with PID
router.get("/comments/:PID", function(req, res) {
  // res.json(DB.getComments(req.params.PID));
});

// POST    /comments/:PID                 // create new comment for posting with PID
router.post("/comments/:PID", function(req, res) {
  // res.json(DB.createComment(req.params.PID, req.body.user, req.body.comment));
});

// DELETE  /comments/:CID                 // delete comment with CID
router.delete("/comments/:CID", function(req, res) {
  // res.json(DB.deleteComment(req.params.CID));
});

// PUT     /ratings/:PID/:USER/:STARS     // add/change rating for posting with PID and USER with STARS (0 .. 5)
router.put("/ratings/:PID/:USER/:STARS", function(req, res) {
  // res.json(DB.updateRatings(req.params.PID, req.params.USER, req.params.STARS));
});

// GET     /session/:USER                 // get user-settings for USER
router.get("/session/:USER", function(req, res) {
  // res.json(DB.getUserSetting(req.params.USER));
});

// POST    /session/:USER/:PWD            // register with USER (username) and PWD (password)
router.post("/session/:USER/:PWD", function(req, res) {
  // res.json(DB.registerUser(req.params.USER, req.params.PWD));
});

// PUT     /session/:USER                 // update user-setting for USER
router.put("/session/:USER", function(req, res) {
  // res.json(DB.updateSetting(req.params.USER, req.body.password, req.body.email, req.body.notify, req.body.locale));
});

// POST    /login/:USER/:PWD              // login user with USER (username) and PWD (password)
router.post("/login/:USER/:PWD", function(req, res) {
  res.json(); // TODO
});

// POST    /logout/:USER                  // logout user with USER (username)
router.post("/logout/:USER", function(req, res) {
  res.json(); // TODO
});

module.exports = router;

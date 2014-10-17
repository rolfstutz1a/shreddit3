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

var express = require("express");
var router = express.Router();
// var path = require("path");
var shredditUtil = require("../shreddit-utils");

var Nedb = require("nedb");
var postingsDB = new Nedb({ filename: "../server/db/postings", autoload: true });
var commentsDB = new Nedb({ filename: "../server/db/comments", autoload: true });

/**
 * Loading all postings from the database.
 *
 * Method: GET
 * Route: /postings
 *
 * @param user the username of the user who is requesting the postings
 * @param order how to sort the postings (LATEST: (default) latest postings first, TOP: top rated postings first, MY: only postings from the user).
 */
router.get("/postings", function(req, res) {
  var order = req.param("order");
  var userName = req.param("user");
  var sortOrder = {time: 1};
  var find = {};

  if (order === "TOP") {
    sortOrder = {rating: -1};  // rating
    find = {};
  } else if (order === "MY") {
    sortOrder = {time: -1};  // user
    find = {user: userName};
  } else {
    sortOrder = {time: -1}; // latest
    find = {};
  }

  postingsDB.find(find).sort(sortOrder).exec(function(err, docs) {
    if (err) {
      console.log("error " + req.method + ": " + req.originalUrl + ": all" + err);
    } else {
      if (docs.length <= 0) {
        console.log("database has no element: " + req.originalUrl);
      } else {
        console.log("database " + req.method + ":" + req.path + " has " + docs.length + " elements. " + req.originalUrl);
      }
      res.json(docs);
    }
  });
});

/**
 * Creates a new posting. The posted values are accessible from req.body.
 *
 * Method: POST
 * Route: /postings
 *
 * @param title the title of the new posting.
 * @param user the user who creates the posting.
 * @param link an optional link (e.g. HSR) for more information.
 * @param url an optional url (e.g. http://www.hsr.ch) for more information.
 * @param content the content of the new posting.
 * @param tags a list tags for grouping the postings.
 */
router.post("/postings", function(req, res) {

  var posting = {"title": req.body.title, "user": req.body.user, "version": "1", "time": new Date().toJSON(),
    "rating": "0.00", "people": "0", "link": req.body.link, "url": req.body.url, "commentCount": "0",
    "tags": req.body.tags, "content": req.body.content };

  postingsDB.insert(posting, function(err, newDoc) {
    if (err) {
      console.log("error " + req.method + ": " + req.originalUrl + " : " + err);
    } else {
        res.json(newDoc);
    }
  });
});

/**
 * Loading the posting with the PID from the database.
 *
 * Method: GET
 * Route: /postings/:PID
 *
 * @param PID the ID of the requested posting.
 */
router.get("/postings/:PID", function(req, res) {
  var find = {_id: req.params.PID};

  postingsDB.find(find).exec(function(err, doc) {
    if (err) {
      console.log("error " + req.method + ": " + req.originalUrl + " : " + err);
    } else {
      if (doc.length !== 1) {
        console.log("database " + req.method + ": " + req.path + " has " + doc.length + " elements. " + req.originalUrl);
      }
      res.json(doc);
    }
  });
});

/**
 * Deletes the posting with the PID from the database.
 *
 * Method: DELETE
 * Route: /postings/:PID
 *
 * @param PID the ID of the posting to delete.
 */
router.delete("/postings/:PID", function(req, res) {
  var _pid = req.params.PID;

  console.log("delete: " + _pid);

  commentsDB.remove({pid: _pid}, {multi: true}, function(err, numRemoved) {
    if (err) {
      console.log("error comment " + req.method + ": " + req.originalUrl + " : " + err);
    } else {
      console.log("database " + req.path + " element " + _pid + " count " + numRemoved);
    }
  });

  postingsDB.remove({_id: _pid}, {multi: true}, function(err, numRemoved) {
    if (err) {
      console.log("error posting " + req.method + ": " + req.originalUrl + " : " + err);
    } else {
      console.log("database " + req.path + " element " + _pid + " count " + numRemoved);
    }
    res.json({"removed": numRemoved});
  });
});

// GET     /comments/:PID                 // get all comments for posting with PID
router.get("/comments/:PID", function(req, res) {
  // res.json(DB.getComments(req.params.PID));

  if (err) {
    console.log("error " + req.method + ": " + req.originalUrl + " : " + err);
  } else {
    commentsDB.find({pid: req.params.PID}, function(err, doc) {

      if (doc.length <= 0) {
        console.log("database has no element: " + req.originalUrl);
      } else {
        console.log("database " + req.method + ": " + req.path + " has " + docs.length + " elements. " + req.originalUrl);
      }
      res.json(doc);
    });
  }
});

// POST    /comments/:PID                 // create new comment for posting with PID
router.post("/comments/:PID", function(req, res) {
  // res.json(DB.createComment(req.params.PID, req.body.user, req.body.comment));

});

// DELETE  /comments/:CID                 // delete comment with CID
router.delete("/comments/:CID", function(req, res) {
  // res.json(DB.deleteComment(req.params.CID));

  commentsDB.remove({id: req.params.CID}, {multi: false}, function(err, numRemoved) {

    if (err) {
      console.log("error " + req.method + ": " + req.originalUrl + " : " + err);
    } else {
      console.log("database " + req.path + " element " + req.body.CID + " count " + numRemoved);
    }
    res.json(numRemoved);
  })
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

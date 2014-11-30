/**
 * This code implements all the necessary RESTful services for the SHREDDIT application.
 */
var express = require("express");
var session = require("../shreddit-session");
var router = express.Router();
var ShredditDB = require("../db/shreddit-db");
var DB = new ShredditDB("../server/db/","postings.dat","comments.dat","ratings.dat","users.dat");

/**
 * Loading all postings from the database.
 *
 * Method: GET
 * Route: /postings
 *
 * @param user the username of the user who is requesting the postings
 * @param order how to sort the postings (LATEST: (default) latest postings first, TOP: top rated postings first, MY: only postings from the user).
 * @param search the current active search-text.
 *
 * @returns a sorted array of the requested postings or undefined.
 */
router.get("/postings", session.checkSession, function(req, res) {
  DB.getPostings(req.param("user"), req.param("order"), req.param("search"), function(err, docs) {
    if (err) {
      res.send(500, JSON.stringify(err));
      return;
    }
    res.json(docs);
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
router.post("/postings", session.checkSession, function(req, res) {
  var posting = {"title": req.body.title, "user": req.body.user, "version": 1, "time": new Date().toJSON(),
    "rating": "0.00", "people": "0", "link": req.body.link, "url": req.body.url, "commentCount": 0,
    "tags": req.body.tags, "content": req.body.content };

  DB.savePosting(posting, function(err, newDoc) {
    if (err) {
      res.send(500, JSON.stringify(err));
      return;
    }
    res.json(newDoc);
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
router.get("/postings/:PID", session.checkSession, function(req, res) {

  DB.getPosting(req.params.PID, function(err, doc) {
    if (err) {
      res.send(500, JSON.stringify(err));
      return;
    }
    res.json(doc);
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
router.delete("/postings/:PID", session.checkSession, function(req, res) {
  DB.deletePosting(req.params.PID, function(err, numRemoved) {
    if (err) {
      res.send(500, JSON.stringify(err));
      return;
    }
    res.json({"removed": numRemoved});
  });
});

/**
 * Loads the comments for the posting with the PID from the database. The comments ars sorted by their creation
 * time (the latest first).
 *
 * Method: GET
 * Route: /comments/:PID
 *
 * @param PID the ID of the posting for which the comments are requested.
 */
router.get("/comments/:PID", session.checkSession, function(req, res) {
  DB.getComments(req.params.PID, function(err, docs) {
    if (err) {
      res.send(500, JSON.stringify(err));
      return;
    }
    res.json(docs);
  });
});

/**
 * Create new comment for posting with PID.
 *
 * Method: POST
 * Route: /comments/:PID
 *
 * @param PID the ID of the posting for which the comment is created.       .
 * @param user the user who creates the comment.
 * @param comment the content of the new comment.
 * @param response an username or another reference to an already existing comment.
 */
router.post("/comments/:PID", session.checkSession, function(req, res) {
  var comment = {"pid": req.params.PID,
    "user": req.body.user,
    "time": new Date().toJSON(),
    "comment": req.body.comment,
    "response": req.body.response };

  DB.createComment(comment, function(err, newDoc) {
    if (err) {
      res.send(500, JSON.stringify(err));
      return;
    }
    res.json(newDoc);
  });
});

/**
 * Deletes the comment with the CID from the database.
 *
 * Method: DELETE
 * Route: /comments/:CID
 *
 * @param CID the ID of the comment to delete.
 */
router.delete("/comments/:CID", session.checkSession, function(req, res) {
  DB.deleteComment(req.params.CID, function(err, numRemoved) {
    if (err) {
      res.send(500, JSON.stringify(err));
      return;
    }
    res.json(numRemoved);
  });
});

/**
 * Create new rating for posting with PID.
 *
 * Method: PUT
 * Route: /ratings/:PID/:USER/:STARS
 *
 * @param PID   the ID of the posting for which the rating is.
 * @param USER  the user who do the rating.
 * @param STARS the new rating.
 */
router.put("/ratings/:PID/:USER/:STARS", session.checkSession, function(req, res) {

  DB.createRating(req.params.PID, req.params.USER, req.params.STARS, function(err, posting) {
    if (err) {
      res.send(500, JSON.stringify(err));
      return;
    }
    res.json({ _id: req.params.PID, "rating": posting.rating, "people": posting.people });
  });
});

/**
 * Loads the user-data of the user with the USERNAME.
 *
 * Method: GET
 * Route: /session/:USERNAME
 *
 * @param USERNAME the username of the requested user.
 */
router.get("/session/:USERNAME", session.checkSession, function(req, res) {

  DB.getUserData(req.params.USERNAME, function(err, doc) {
    if (err) {
      res.send(500, JSON.stringify(err));
      return;
    }
    res.json(doc);
  });
});

/**
 * Checks whether the USERNAME already exists.
 *
 * Method: GET
 * Route: /check/:USERNAME
 *
 * @param USERNAME the username to check.
 */
router.get("/check/:USERNAME", function(req, res) {

  DB.checkUser(req.params.USERNAME, function(exists) {
    res.json({"username": req.params.USERNAME, "exists": exists});
  });
});

/**
 * Register a new user for shreddit.
 *
 * Method: POST
 * Route: /register
 *
 * @param username the username of the new user.
 * @param password the password of the new user.
 * @param email the e-mail address of the new user.
 */
router.post("/register", function(req, res) {

  DB.registerUser(req.body.username, req.body.password, req.body.email, function(err, data) {
    if (err) {
      res.send(500, JSON.stringify(err));
      return;
    }
    res.json(data);
  });
});

/**
 * Updates the user settings for the <code>USER</code>.
 *
 * Method: PUT
 * Route: /settings/:USER
 *
 * @param USER the username of the user.
 * @param email the (new) e-mail address of the user.
 * @param locale the (new) locale (=language) of user-interface.
 * @param notify send an email when a comment has been added.
 */
router.put("/settings/:USER", session.checkSession, function(req, res) {

  DB.updateUser(req.params.USER, req.body.email, req.body.locale, req.body.notify, function(err, posting) {
    if (err) {
      res.send(500, JSON.stringify(err));
      return;
    }
    res.json({ _id: req.params.USER });
  });
});

/**
 * login user with USER (username) and PWD (password).
 *
 * Method: POST
 * Route: /login/:USER/:PWD
 *
 * @param USER the username of the new user.
 * @param PWD the password.
 */
router.post("/login/:USER/:PWD", function(req, res) {
  DB.getUserData(req.params.USER,req.params.PWD, function(err, user) {
    if ((err) || (user === null)) {
      res.send(500, "WRONG_USR_PWD");
      return;
    }
    if (user.password === true) {
      session.createSession(req.params.USER, res);
      user.password = "HaHaHa";
      res.json(user);
      return;
    }
    res.send(500, "WRONG_USR_PWD");
  });
});

/**
 * Logout of the user.
 *
 * Method: POST
 * Route: /logout/:USER
 *
 * @param USER the username of the new user.
 */
router.post("/logout/:USER", function(req, res) {
  session.deleteSession(req, res);
  res.send(200, req.params.USER + " logged out");
});

module.exports = router;

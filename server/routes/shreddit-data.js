var express = require("express");
var router = express.Router();

function errorMessage(msg, req, err) {
  return "  *** ERROR [" + req.method + ": " + req.originalUrl + "] " + msg + ": " + err;
}

function debugMessage(msg, req, data) {
  if (Array.isArray(data)) {
    return "  --- DEBUG [" + req.method + ": " + req.originalUrl + "] " + msg + ": size=" + data.length;
  }
  if (data) {
    return "  --- DEBUG [" + req.method + ": " + req.originalUrl + "] " + msg + ": effected=" + data;
  }
  return "  --- DEBUG [" + req.method + ": " + req.originalUrl + "] " + msg + ": (no data)";
}

function respondError(res, message) {
  res.send(500, {error: message});
}

/**
 * NeDB is the database which we use to persist our data.
 *
 * @param postingDB contains the data with postings.
 * @param commentsDB contains the data with the comments for the postings.
 * @param usersDB contains the data about the registered users.
 * @param ratingsDB contains the data about the ratings for the postings.
 */
var Nedb = require("nedb");
var postingsDB = new Nedb({ filename: "../server/db/postings", autoload: true });
var commentsDB = new Nedb({ filename: "../server/db/comments", autoload: true });
var usersDB = new Nedb({ filename: "../server/db/users", autoload: true });
var ratingsDB = new Nedb({ filename: "../server/db/ratings", autoload: true });

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
router.get("/postings", function(req, res) {
  var order = req.param("order");
  var userName = req.param("user");
  var search = req.param("search");
  var sortOrder = { time: 1 };
  var searchObj = {};
  var find = {};

  // for tests search ='Morologie';

  if ((search === 'undefined') || (search === '' )) {
    find = {};
  } else {
    search = '$regex:/' + search + '/i'; // search is case-insensitive
    searchObj = eval('{' + search + '}');
    console.log(typeof (searchText));
    find = {$or: [
      {content: searchObj},
      {title: searchObj},
      {user: searchObj}
    ]};
  }

  if (order === "TOP") {
    sortOrder = { rating: -1 };// rating
  } else if (order === "MY") {
    sortOrder = { time: -1 };  // user
    find = {user: userName};
  } else {
    sortOrder = { time: -1 }; // latest
  }

  postingsDB.find(find).sort(sortOrder).exec(function(err, docs) {
    if (err) {
      console.log(errorMessage("load postings", req, err));
    } else {
      console.log(debugMessage("load postings", req, docs));
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

  var posting = {"title": req.body.title, "user": req.body.user, "version": 1, "time": new Date().toJSON(),
    "rating": "0.00", "people": "0", "link": req.body.link, "url": req.body.url, "commentCount": 0,
    "tags": req.body.tags, "content": req.body.content };

  postingsDB.insert(posting, function(err, newDoc) {
    if (err) {
      console.log(errorMessage("create postings", req, err));
    } else {
      console.log(debugMessage("create postings", req, newDoc));
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
  postingsDB.findOne(find).exec(function(err, doc) {
    if (err) {
      console.log(errorMessage("load posting[" + req.params.PID + "]", req, err));
    } else {
      console.log(debugMessage("load posting[" + req.params.PID + "]", req, doc));
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

  commentsDB.remove({pid: _pid}, {multi: true}, function(err, numRemoved) {
    if (err) {
      console.log(errorMessage("delete comments[" + req.params.PID + "]", req, err));
    } else {
      console.log(debugMessage("delete comments[" + req.params.PID + "]", req, numRemoved));
    }
  });

  postingsDB.remove({_id: _pid}, {multi: true}, function(err, numRemoved) {
    if (err) {
      console.log(errorMessage("delete posting[" + req.params.PID + "]", req, err));
    } else {
      console.log(debugMessage("delete posting[" + req.params.PID + "]", req, numRemoved));
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
 * @param PID the ID of the posting for which the comments are requested..
 */
router.get("/comments/:PID", function(req, res) {

  commentsDB.find({pid: req.params.PID}).sort({"time": -1}).exec(function(err, docs) {
    if (err) {
      console.log(errorMessage("load comments[" + req.params.PID + "]", req, err));
    } else {
      console.log(debugMessage("load comments[" + req.params.PID + "]", req, docs));
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
router.post("/comments/:PID", function(req, res) {
  var comment = {"pid": req.params.PID,
    "user": req.body.user,
    "time": new Date().toJSON(),
    "comment": req.body.comment,
    "response": req.body.response };

  commentsDB.insert(comment, function(err, newDoc) {
    if (err) {
      console.log(errorMessage("create comment[" + req.params.PID + "]", req, err));
    } else {
      console.log(debugMessage("create comment[" + req.params.PID + "]", req, newDoc));
      postingsDB.update({ _id: req.params.PID }, { $inc: { commentCount: 1, _version: 1 } }, { upsert: true }, function() {
        res.json(newDoc);
      });
    }
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
router.delete("/comments/:CID", function(req, res) {
  commentsDB.remove({id: req.params.CID}, {multi: false}, function(err, numRemoved) {
    if (err) {
      console.log(errorMessage("delete comment[" + req.params.CID + "]", req, err));
    } else {
      console.log(debugMessage("delete comment[" + req.params.CID + "]", req, numRemoved));
    }
    res.json(numRemoved);
  })
});

/**
 * Updates the <code>rating</code> and <code>posting</code> with the new vote.
 *
 * @param posting the posting for which the voting was.
 * @param rating the data of the previous votings.
 * @param user  the user who do the rating.
 * @param stars how many stars were given.
 *
 * @return <code>true</code> if the data has to be saved.
 */
function updateRating(posting, rating, user, stars) {
  if (rating.hasOwnProperty(user)) {
    var lastStars = rating[user];
    if (lastStars === stars) {
      return false; // no change in the voting
    }
    rating[user] = stars;
    rating._average = ((rating._count * rating._average) - lastStars + stars) / rating._count;
    posting.rating = "" + rating._average.toFixed(2);
  } else {
    rating[user] = stars;
    rating._average = ((rating._count * rating._average) + stars) / (rating._count + 1);
    rating._count += 1;
    posting.people = rating._count;
    posting.rating = "" + rating._average.toFixed(2);
  }
  return true;
}

/**
 * Create new rating for posting with PID.
 *
 * Method: PUT
 * Route: /ratinGs/:PID/:USER/:STARS
 *
 * @param PID   the ID of the posting for which the rating is.
 * @param USER  the user who do the rating.
 * @param STARS the new rating.
 */
router.put("/ratings/:PID/:USER/:STARS", function(req, res) {
  var queryID = { _id: req.params.PID };

  //ratingsDB.persistence.compactDatafile();
  // postingsDB.persistence.compactDatafile();

  var stars = parseInt(req.params.STARS);
  if ((stars < 0) || (stars > 5)) {
    respondError(res, "invalid number of stars: " + req.params.STARS);
    return;
  }

  // STEP 1: load posting
  postingsDB.findOne(queryID, function(err, doc) {
    if (err) {
      console.log(errorMessage("rating update[" + req.params.PID + "]", req, err));
      respondError(res, err);
      return;
    }
    if (!doc) { // no data in the posting DB
      console.log(debugMessage("rating, no posting to [" + req.params.PID + "]", req, doc));
      respondError(res, "no posting found for: " + req.params.PID);
    }
    var posting = doc;
    // END STEP 1

    // STEP 2: Load rating
    ratingsDB.findOne(queryID, function(err, doc) {
      if (err) {
        console.log(errorMessage("rating update[" + req.params.PID + "]", req, err));
        respondError(res, err);
        return;
      }
      var rating;
      var update;
      if (!doc) {
        rating = { _id: req.params.PID, _count: 0, _average: 0.0, _version: 1 };
        update = false;
      } else {
        rating = doc;
        update = true;
      }

      if (updateRating(posting, rating, req.params.USER, stars)) {
        // STEP 3: Save or update rating

        // STEP 4: Update posting (used twice)
        var step4 = function(err) {
          if (err) {
            console.log(errorMessage("rating update[" + req.params.PID + "]", req, err));
            respondError(res, err);
            return;
          }
          postingsDB.update(queryID, { $set: { "rating": posting.rating, "people": posting.people }, $inc:{_version:1} }, {}, function(err) {
            if (err) {
              console.log(errorMessage("rating update[" + req.params.PID + "]", req, err));
              respondError(res, err);
              return;
            }
            res.json({ _id: req.params.PID, "rating": posting.rating, "people": posting.people });
          });

        };

        if (update) {
          rating._version += 1;
          ratingsDB.update(queryID, rating, {}, step4);
        } else {
          ratingsDB.insert(rating, step4);
        }
      }
    });
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
router.get("/session/:USERNAME", function(req, res) {
  usersDB.findOne({_id: req.params.USERNAME}).exec(function(err, doc) {
    if (err) {
      respondError(res, err);
      return;
    }
      console.log(debugMessage("load user[" + req.params.USERNAME + "]", req, doc));
    res.json(doc);
  });
});

/**
 * Register a new user for shreddit.
 *
 * Method: POST
 * Route: /session/:USERNAME/:PASSWORD
 *
 * @param USERNAME the username of the new user.
 * @param PASSWORD the password of the new user.
 * @param email the e-mail address of the new user.
 */
router.post("/session/:USERNAME/:PASSWORD", function(req, res) {
  var register = { "_id": req.params.USERNAME,
    "password": req.params.PASSWORD,
    "email": req.body.email,
    "_version":req.body._version,
    "since": new Date().toJSON(),
    "locale": "EN",
    "notify": "true",
    "admin": "false" };

  usersDB.findOne({username: req.params.USERNAME}).exec(function(err, docs) {
    if (err) {
      res.json({message: "error while checking user!"});
    } else {
      if (docs) {
        res.json({message: "the user <" + req.params.USERNAME + "> already exists!"});
      } else {
        usersDB.insert(register, function(err, newDoc) {
          if (err) {
            console.log(errorMessage("register user", req, err));
          } else {
            console.log(debugMessage("register user", req, newDoc));
            var userData = { "username": newDoc._id,
                  "password": newDoc.password,
                  "email": newDoc.email,
                  "_version": newDoc._version,
                  "since": newDoc.since,
                  "locale": newDoc.locale,
                  "notify": newDoc.notify,
                  "admin": newDoc.admin };

              res.json(userData);
          }
        });
      }
    }
  });
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

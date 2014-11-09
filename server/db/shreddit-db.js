/**
 * NeDB is the database which we use to persist our data.
 *
 * @param postingDB contains the data with postings.
 * @param commentsDB contains the data with the comments for the postings.
 * @param usersDB contains the data about the registered users.
 * @param ratingsDB contains the data about the ratings for the postings.
 */
var Nedb = require("nedb");

module.exports = function(path, postingDB, commentDB, ratingDB, userDB) {

  this.postingsDB = new Nedb({filename: path + postingDB, autoload: true});
  this.commentsDB = new Nedb({filename: path + commentDB, autoload: true});
  this.ratingsDB = new Nedb({filename: path + ratingDB, autoload: true});
  this.usersDB = new Nedb({filename: path + userDB, autoload: true});


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

  this.updateUserRating = updateRating;

  /**
   * Loading all postings from the database.
   *
   * @param user the username of the user who is requesting the postings
   * @param order how to sort the postings (LATEST: (default) latest postings first, TOP: top rated postings first, MY: only postings from the user).
   * @param search the current active search-text.
   * @param callback(err, data) the callback-method (first argument error [null if no error], second argument an array of postings).
   */
  this.getPostings = function(userName, order, search, callback) {
    var sortOrder = { time: 1 };
    var searchObj = {};
    var find = {};

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

    this.postingsDB.find(find).sort(sortOrder).exec(callback);
  };

  /**
   * Creates a new posting. The posted values are accessible from req.body.
   *
   * @param posting the new posting.
   * @param callback(err, data) the callback-method (first argument error [null if no error], second argument the new posting).
   */
  this.savePosting = function(posting, callback) {
    this.postingsDB.insert(posting, callback);
  };

  /**
   * Loading the posting with the PID from the database.
   *
   * @param PID the ID of the requested posting.
   * @param callback(err, data) the callback-method (first argument error [null if no error], second argument the new posting).
   */
  this.getPosting = function(PID, callback) {
    var find = {_id: PID};
    this.postingsDB.findOne(find).exec(callback);
  };

  /**
   * Deletes the posting with the PID from the database.
   *
   * @param PID the ID of the posting to delete.
   * @param callback(err, data) the callback-method (first argument error [null if no error], second argument the new posting).
   */
  this.deletePosting = function(PID, callback) {
    var self = this;
    self.commentsDB.remove({pid: PID}, {multi: true}, function(err, numRemoved) {
      if (err) {
        callback(err, null);
        return;
      }
      self.postingsDB.remove({_id: PID}, {multi: true}, callback);
    });
  };

  /**
   * Loads the comments for the posting with the PID from the database. The comments ars sorted by their creation
   * time (the latest first).
   *
   * @param PID the ID of the posting for which the comments are requested..
   * @param callback(err, data) the callback-method (first argument error [null if no error], second argument the new posting).
   */
  this.getComments = function(PID, callback) {
    this.commentsDB.find({"pid": PID}).sort({"time": -1}).exec(callback);
  };

  /**
   * Create new comment for posting with PID.
   *
   * @param comment the new comment.
   * @param callback(err, data) the callback-method (first argument error [null if no error], second argument the new posting).
   */
  this.createComment = function(comment, callback) {
    var pDB = this.postingsDB;
    this.commentsDB.insert(comment, function(err, newDoc) {
      if (err) {
        callback(err,null);
        return;
      }
      pDB.update({ _id: comment.pid }, { $inc: { commentCount: 1, _version: 1 } }, { upsert: true }, callback);
    });
  };

  /**
   * Deletes the comment with the CID from the database.
   *
   * @param CID the ID of the comment to delete.
   * @param callback(err, data) the callback-method (first argument error [null if no error], second argument the new posting).
   */
  this.deleteComment = function(CID, callback) {
    this.commentsDB.remove({id: CID}, {multi: false}, callback);
  };

  /**
   * Create new rating for posting with PID.
   *
   * @param PID   the ID of the posting for which the rating is.
   * @param USER  the user who do the rating.
   * @param STARS the new rating.
   * @param callback(err, data) the callback-method (first argument error [null if no error], second argument the new posting).
   */
  this.createRating = function(PID, USER, STARS, callback) {
    var queryID = { _id: PID };
    var rDB = this.ratingsDB;
    var pDB = this.postingsDB;

    var stars = parseInt(STARS);
    if ((stars < 0) || (stars > 5)) {
      callback({message: "invalid number of stars: " + STARS}, null);
      return;
    }

    // STEP 1: load posting
    this.postingsDB.findOne(queryID, function(err, doc) {
      if (err) {
        callback(err, null);
        return;
      }
      if (!doc) { // no data in the posting DB
        callback({message: "no posting found for: " + PID}, null);
        return;
      }
      var posting = doc;
      // END STEP 1

      // STEP 2: Load rating
      rDB.findOne(queryID, function(err, doc) {
        if (err) {
          callback(err, null);
          return;
        }
        var rating;
        var update;
        if (!doc) {
          rating = { _id: PID, _count: 0, _average: 0.0, _version: 1 };
          update = false;
        } else {
          rating = doc;
          update = true;
        }

        if (updateRating(posting, rating, USER, stars)) {
          // STEP 3: Save or update rating

          // STEP 4: Update posting (used twice)
          var step4 = function(err) {
            if (err) {
              callback(err, null);
              return;
            }
            pDB.update(queryID, { $set: { "rating": posting.rating, "people": posting.people }, $inc: {_version: 1} }, {}, function(err) {
              if (err) {
                callback(err, null);
                return;
              }
              callback(null, { _id: PID, "rating": posting.rating, "people": posting.people });
            });
          };

          if (update) {
            rating._version += 1;
            rDB.update(queryID, rating, {}, step4);
          } else {
            rDB.insert(rating, step4);
          }
        }
      });
    });
  };

  /**
   * Loads the user-data of the user with the USERNAME.
   *
   * @param USERNAME the username of the requested user.
   * @param callback(err, data) the callback-method (first argument error [null if no error], second argument the new posting).
   */
  this.getUserData = function(USERNAME, callback) {
    this.usersDB.findOne({_id: USERNAME}).exec(callback);
  };

  /**
   * Delete the user-data of the user with the USERNAME.
   *
   * @param USERNAME the username of the user to delet.
   * @param callback(err, data) the callback-method (first argument error [null if no error], second argument the new posting).
   */
  this.deleteUserData = function(USERNAME, callback) {
      this.usersDB.remove({_id: USERNAME}, {multi: false}, callback);
  };

  /**
   * Register a new user for shreddit.
   *
   * @param USERNAME the username of the new user.
   * @param PASSWORD the password of the new user.
   * @param EMAIL the e-mail address of the new user.
   * @param callback(err, data) the callback-method (first argument error [null if no error], second argument the new posting).
   */
  this.registerUser = function(USERNAME, PASSWORD, EMAIL, callback) {
    var register = { "_id": USERNAME,
      "password": PASSWORD,
      "email": EMAIL,
      "_version": 1,
      "since": new Date().toJSON(),
      "locale": "EN",
      "notify": "true",
      "admin": "false" };
    var uDB = this.usersDB;

      uDB.findOne({_id: USERNAME}).exec(function(err, doc) {
      if (err) {
          console.log(err);
        callback({message: "error while checking user!"}, null);
        return;
      }
      if (doc) {
        callback({message: "the user <" + USERNAME + "> already exists!"}, null);
        return;
      }
      uDB.insert(register, callback);
    });
  };
};


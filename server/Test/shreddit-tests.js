var ShredditDB = require("../db/shreddit-db");
var DB = new ShredditDB("server/test/db/", "postings.dat", "comments.dat", "ratings.dat", "users.dat");

exports.testUpdateRating = function (test) {

    var ratingscrNoUser = { _id: '1', _count: 1, _average: 3.0, _version: 1 };
    var ratingscr = { _id: '1', _count: 1, _average: 3.0, _version: 1, user1: 3 };

    var postingscr = { "title": "Testing post", "user": "user1", "version": 1, "time": "2014-08-22T10:20:22.000Z",
        "rating": "3.0", "people": "1", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": 0,
        "tags": "", "content": "Thats only a test" };

    test.expect(4);
    test.equal(DB.updateUserRating(postingscr, ratingscrNoUser, "user1", 3), true, "Test with no user");
    test.equal(DB.updateUserRating(postingscr, ratingscr, "user1", 3), false, "test with same user and same rating");
    test.equal(DB.updateUserRating(postingscr, ratingscr, "user1", 1), true, "test with same user and same rating");
    test.equal(DB.updateUserRating(postingscr, ratingscr, "user2", 3), true, "test with new user");
    test.done();
};

exports.testUserDB = {

    tearDown: function (callback) {
        // clean up
        var userNew = "newUser";
        DB.deleteUserData(userNew, function (err, data) {
            if (err) {
                console.log('check user DB, tearDown ' + err)
            }
        });

        callback();
    },
    getUser: function (test) {
        var userExist = "test";
        var passw = "123456";

        DB.getUserData(userExist, passw, function (err, user) {
            test.expect(5);
            test.deepEqual(err, null, "check user DB, no err");
            test.deepEqual(user._id, userExist, "check user DB, user name");
            test.deepEqual(user.password, true, "check user DB, user password is ok");
            test.deepEqual(user.email, "test@example.com", "check user DB, user's email-address");
            test.deepEqual(user.admin, "true", "check user DB, user is admin");
            test.done();
        })
    },
    regExistUser: function (test) {
        var userExist = "test";
        var email = "newUser@hsr.ch";
        var passw = "123456";

        DB.registerUser(userExist, email, passw, function (err, docs) {

            test.expect(3);
            test.deepEqual(docs, null, 'check user DB user exist');
            test.notEqual(err.message, 'undefined', 'check user DB, user not in DB');
            test.deepEqual(err.message, 'the user <' + userExist + '> already exists!', 'check user DB, existing user');
            test.done();
        })
    },
    regUser: function (test) {
        var userNew = "newUser";
        var email = "newUser@hsr.ch";
        var passw = "q1w2e3r4";

        DB.registerUser(userNew, passw, email, function (err, newDoc) {

            DB.getUserData(userNew, passw, function (error, user) {
                test.expect(6);
                test.deepEqual(err, null, 'check user DB, user exist in DB');
                test.notEqual(newDoc, null, 'check user DB, no user data');
                test.deepEqual(error, null, 'check user DB, no error');
                test.deepEqual(user._id, userNew, 'check user DB, new user found');
                test.deepEqual(user.admin, 'false', 'check user DB, new user is not admin');
                test.deepEqual(user.password,true,'check user password')
                test.done();
            });
        })
    }
};

exports.testPostingDB = {

    setUp: function (callback) {
        // Init
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    onPosting: function (test) {
        var postId = "444444";
        var user = "saycbel";
        var content = "Alle Roulettezahlen addiert ergeben 666.";
        var title = "Roulette";
        var time = "2014-10-11T15:54:10.000Z";

        DB.getPosting(postId, function (err, docs) {
            test.expect(6);
            test.deepEqual(err, null, "check posting DB, no err ")
            test.deepEqual(docs._id, postId, "check posting DB, _id is correct");
            test.deepEqual(docs.title, title, "check posting DB, title is correct");
            test.deepEqual(docs.user, user, "check posting DB, user is correct");
            test.deepEqual(docs.content, content, "check posting DB, content is correct");
            test.deepEqual(docs.time, time, "check posting DB, time is correct");
            test.done();
        })
    },
    allPostings: function (test) {
        var user = "";
        var order = ""; // it will sort by time
        var search = "";
        var firstId = "666666";
        var lastId = "555555";

        DB.getPostings(user, order, search, function (err, docs) {
            test.expect(4);
            test.deepEqual(err, null, "check postings DB, no err")
            test.deepEqual(docs.length, 7, "check postings DB, get posting count");
            test.deepEqual(docs[0]._id, firstId, "check postings DB, first _id is correct");
            test.deepEqual(docs[docs.length - 1]._id, lastId, "check postings DB, first _id is correct");
            test.done();
        })
    },
    topRatingSortPostings: function (test) {
        var user = "saycbel";
        var order = "TOP"; // it will sort by time
        var search = "";
        var topRatid = "444444";

        DB.getPostings(user, order, search, function (err, docs) {
            test.expect(4);
            test.deepEqual(err, null, "check postings DB, top rating no err")
            test.deepEqual(docs.length, 7, "check postings DB, top rating get posting count");
            test.deepEqual(docs[0]._id, topRatid, "check postings DB, top rating _id is correct");
            test.deepEqual(docs[0].user, user, "check postings DB, top rating user is correct");
            test.done();
        });
    },
    postPosting: function (test) {
        var user = "tester";
        var id = "888888";

        var posting = {"title": "Testing", "user": "tester", "version": 1, "time": new Date().toJSON(),
            "rating": "0.00", "people": "0", "link": "Testing", "url": "www.testing.ch", "commentCount": 0,
            "tags": "test", "content": "we test the shreddit3", "_id": id };

        DB.savePosting(posting, function (err, newDoc) {
            if (err) {
                console.log(err);
            } else {
                DB.getPosting(id, function (err, docs) {
                    test.expect(4);
                    test.deepEqual(err, null, "check postings DB, post posting, no err")
                    test.notEqual(docs, null, "check postings DB, post posting, found new posting");
                    test.deepEqual(docs._id, id, "check postings DB, post Posting _id is correct");
                    test.deepEqual(docs.user, user, "check postings DB, post Posting user is correct");
                    test.done();
                });
            }
        });
    },
    deletePosting: function (test) {
        var id = "888888";

        DB.deletePosting(id, function (err, docs) {
            if (err) {
                console.log(err);
            } else {
                DB.getPosting(id, function (err, docs) {
                    test.expect(2);
                    test.deepEqual(err, null, "check postings DB, delete posting, no err")
                    test.deepEqual(docs, null, "check postings DB, delete posting, no posting found");
                    test.done();
                });
            }
        });
    }
};

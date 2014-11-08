
var ShredditDB = require("../db/shreddit-db");
var DB = new ShredditDB("server/test/db/","postings.dat","comments.dat","ratings.dat","users.dat");

exports.testUpdateRating = function(test) {

    var ratingscrNoUser = { _id: '1', _count: 1, _average: 3.0, _version: 1 };
    var ratingscr =       { _id: '1', _count: 1, _average: 3.0, _version: 1, user1: 3 };

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

exports.testGetUser = function(test) {
    DB.getUserData("test", function(error, user) {
        test.expect(2);
        test.equal(user._id, "test", "check user name");
        test.equal(user.email, "test@example.com", "check user's email-address");
        test.done();
    });
};

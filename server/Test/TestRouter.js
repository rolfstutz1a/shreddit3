/**
 * Created by rolf on 26.10.2014.
 */

var ratingscr = { _id: '1', _count: 1, _average: 3.0, _version: 1,"bie":3 };

var postingscr = {"title": "Testing post", "user": "check", "version": 1, "time": "2014-08-22T10:20:22.000Z",
    "rating": "3.0", "people": "1", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": 0,
    "tags": "", "content": "Thats only a test" };

QUnit.test("Test updateRating function", function( assert ) {
    assert.equal(updateRating(postingscr, ratingscr, "check", "3"), false  );

//            assert.equal(prettyDate(now, "2008/01/26 22:23:30"), "2 days ago");
//            assert.equal(prettyDate(now, "2007/01/26 22:23:30"), undefined);
});

/**
 * Created by rolf on 26.10.2014.
 */

QUnit.test("Test function updateRating ", function( assert ) {
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
    var ratingscr = { _id: '1', _count: 1, _average: 3.0, _version: 1,"user1":3 };

    var postingscr = {"title": "Testing post", "user": "check", "version": 1, "time": "2014-08-22T10:20:22.000Z",
        "rating": "3.0", "people": "1", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": 0,
        "tags": "", "content": "Thats only a test" };

    assert.equal(updateRating(postingscr, ratingscr, "user1", 3), false  );// Test with same user and same rating
    assert.equal(updateRating(postingscr, ratingscr, "user1", 1), true  );// Test with same user and same rating
    assert.equal(updateRating(postingscr, ratingscr, "user2", 3), true  ); // Test with new user

});

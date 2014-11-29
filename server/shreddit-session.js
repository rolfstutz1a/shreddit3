/**
 * This is our own implementation of the session handling.
 *
 * It is just a minimal implementation for tests without special features.
 */
var sessions = {};
var lastSessionId = 0;

/**
 * Generates and returns a new session ID.
 *
 * @returns the generated session ID.
 */
function generateSessionId() {
  var id = new Date().valueOf();
  if (id <= lastSessionId) {
    id = lastSessionId + 1;
  }
  lastSessionId = id;
  return "sid" + id;
}

/**
 * Creates a new session fur the user <code>usr</code>.
 *
 * @param usr the username.
 * @param res the http-response.
 */
var createSession = function(usr, res) {
  var sid = generateSessionId();
  var session = { "id": sid, "user": usr, "time": new Date().valueOf() };

  sessions[sid] = session;

  res.cookie("shreddit-usr", usr);
  res.cookie("shreddit-sid", sid, {maxAge: 900000});

  console.log(" >>> create-session: user=" + usr + " sid=" + sid + "   object=" + sessions[sid]);
};

/**
 * Removes the session that comes with the request.
 *
 * @param req the http-request.
 * @param res the http-response.
 */
var deleteSession = function(req, res) {
  var sid = req.cookies["shreddit-sid"];
  if (sid) {
    var usr = sessions[sid].user;
    delete sessions[sid];
    res.clearCookie("shreddit-usr");
    res.clearCookie("shreddit-sid");
    console.log(" >>> delete-session: user=" + usr + " sid=" + sid + "   object=" + sessions[sid]);
  }
};

/**
 * Checks whether the session that comes with the request is (still) valid.
 *
 * @param req the http-request.
 * @param res the http-response.
 * @param nxt the next function in the call-chain.
 */
var checkSession = function(req, res, nxt) {
  var usr = req.cookies["shreddit-usr"];
  var sid = req.cookies["shreddit-sid"];
  if (!sid) {
    res.send(401, "Unauthorized: No valid session!");
    console.log(" >>> ERROR.1  check-session: user=" + usr + " sid=" + sid + "   object=" + sessions[sid]);
    return;
  }
  var session = sessions[sid];
  if (!session) {
    res.send(401, "Unauthorized: No valid session!");
    console.log(" >>> ERROR.2  check-session: user=" + usr + " sid=" + sid + "   object=" + sessions[sid]);
    return;
  }
  var now = new Date().valueOf();
  if ((now - session.time) > 900000) {
    deleteSession(req, res);
    res.send(401, "Unauthorized: Session time-out!");
    console.log(" >>> ERROR.3  check-session: user=" + usr + " sid=" + sid + "   object=" + sessions[sid]);
    return;
  }
  session.time = now;
  res.cookie("shreddit-usr", usr);
  res.cookie("shreddit-sid", sid, {maxAge: 900000});
  console.log(" >>> check-session: user=" + usr + " sid=" + sid + "   object=" + sessions[sid]);
  nxt();
};

exports.createSession = createSession;
exports.deleteSession = deleteSession;
exports.checkSession = checkSession;


var sessions = {};
var lastSessionId = 0;

function generateSessionId() {
  var id = new Date().valueOf();
  if (id <= lastSessionId) {
    id = lastSessionId + 1;
  }
  lastSessionId = id;
  return "sid" + id;
}

var createSession = function(usr, res) {
  var sid = generateSessionId();
  var session = { "id": sid, "user": usr, "time": new Date().valueOf() };

  sessions[sid] = session;

  res.cookie("shreddit-usr", usr);
  res.cookie("shreddit-sid", sid, {maxAge: 900000});
};

var deleteSession = function(req, res) {
  var sid = req.cookies["shreddit-sid"];
  if (sid) {
    delete sessions[sid];
    res.clearCookie("shreddit-usr");
    res.clearCookie("shreddit-sid");
  }
};

var checkSession = function(req, res, nxt) {
  var usr = req.cookies["shreddit-usr"];
  var sid = req.cookies["shreddit-sid"];
  if (!sid) {
    res.send(401, "Unauthorized: No valid session!");
    return;
  }
  var session = sessions[sid];
  if (!session) {
    res.send(401, "Unauthorized: No valid session!");
    return;
  }
  var now = new Date().valueOf();
  if ((now - session.time) > 900000) {
    deleteSession(req, res);
    res.send(401, "Unauthorized: Session time-out!");
    return;
  }
  session.time = now;
  res.cookie("shreddit-usr", usr);
  res.cookie("shreddit-sid", sid, {maxAge: 900000});
  nxt();
};

exports.createSession = createSession;
exports.deleteSession = deleteSession;
exports.checkSession = checkSession;


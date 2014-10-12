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

var express = require('express');
var router = express.Router();
// var path = require('path');

// var rootpath = path.resolve(process.cwd(), '..');


var postings = [
  { "id": "1003", "title": "241543903", "user": "fridge", "version": "1", "time": "2014-08-11T17:07:02.000Z", "rating": "2.29", "people": "7", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "4", "tags": "", "content": "Wenn man in der Google Bildersuche nach 241543903 sucht, findet man Menschen, die ihren Kopf in Kühlschränke stecken."},
  { "id": "1001", "title": "Sektflasche", "user": "cyrano", "version": "1", "time": "2014-08-01T10:44:00.000Z", "rating": "3.00", "people": "5", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Die Bezeichnung für eine Sektflasche mit sechs Litern Inhalt ist „Methusalem“."},
  { "id": "1002", "title": "Pizza", "user": "volcano", "version": "1", "time": "2014-08-06T12:41:54.000Z", "rating": "2.29", "people": "7", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Eine Pizza mit dem Radius z und der Dicke a hat das Volumen Pi • z • z • a."},
  { "id": "1008", "title": "Nase", "user": "cyrano", "version": "1", "time": "2014-08-17T02:26:26.000Z", "rating": "2.83", "people": "6", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Der Winzer und Weintester Ilja Gort hat seine Nase für 5 Millionen Euro versichern lassen. Die Bedingung der Versicherung war allerdings, dass er weder Motorrad fahren noch boxen noch als Feuerschlucker oder Assistent eines Messerwerfers arbeiten darf."},
  { "id": "1009", "title": "Im Aufzug", "user": "bie", "version": "1", "time": "2014-08-22T09:30:35.000Z", "rating": "2.00", "people": "5", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Schauspieler Jack Lemmon wurde in einem Aufzug geboren."},
  { "id": "1010", "title": "Psycho", "user": "snassnal", "version": "1", "time": "2014-08-27T21:05:51.000Z", "rating": "3.20", "people": "5", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "In der berühmten Duschszene aus „Psycho“ wurde Schokosirup als Blut verwendet."},
  { "id": "1011", "title": "Liechtensteinische Nationalhymne", "user": "ceanage", "version": "1", "time": "2014-09-02T05:15:03.000Z", "rating": "0.00", "people": "0", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Die liechtensteinische Nationalhymne „Oben am jungen Rhein“ hat dieselbe Melodie wie „God Save The Queen“."},
  { "id": "1012", "title": "Vulkaniergruß", "user": "woillpol", "version": "1", "time": "2014-09-07T08:44:51.000Z", "rating": "2.75", "people": "4", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Zachary Quinto musste sich beim Dreh von „Star Trek“ die Finger zusammenkleben, um den Vulkaniergruß zu machen."},
  { "id": "1013", "title": "Binnenstaaten", "user": "lycina", "version": "1", "time": "2014-09-12T15:41:54.000Z", "rating": "2.60", "people": "5", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "2", "tags": "", "content": "Nur zwei Binnenstaaten der Erde sind auch ausschließlich von Binnenstaaten umgeben. Nur zwei Länder weltweit sind Binnenstaaten, die außerdem auch ausschließlich von Binnenstaaten umgeben sind: Liechtenstein und Usbekistan. Liechtenstein liegt zwischen der Schweiz und Österreich, während Usbekistan von Kasachstan, Kirgisistan, Tadschikistan, Afghanistan und Turkmenistan umgeben ist."},
  { "id": "1016", "title": "Einmarsch in Liechtenstein", "user": "moorwor", "version": "1", "time": "2014-09-17T23:34:45.000Z", "rating": "2.60", "people": "5", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "3", "tags": "", "content": "Anfang 2007 marschierte die Schweizer Armee aus Versehen in Liechtenstein ein."},
  { "id": "1020", "title": "Barbies voller Name lautet Barbara Millicent Roberts", "user": "levesale", "version": "1", "time": "2014-09-23T02:22:15.000Z", "rating": "2.00", "people": "2", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Die Barbie-Puppe ist wohl weltweit eines der bekanntesten Spielzeuge überhaupt. Sie wurde von der Amerikanerin Ruth Handler kreiert, die die Puppe nach ihrer Tochter Barbara benannte. 1959 hatte die Barbie ihre Premiere auf dem Markt. Der volle Name der Puppe lautet Barbara Millicent Roberts. Barbies Freund Ken heißt mit vollem Namen Ken Carson."},
  { "id": "1021", "title": "Name Los Angeles'", "user": "ceanage", "version": "1", "time": "2014-09-28T12:41:38.000Z", "rating": "1.60", "people": "5", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Los Angeles hieß ursprünglich „El Pueblo de Nuestra Señora la Reina de los Ángeles de Porciúncula“ (Das Dorf Unserer Lieben Frau, Königin der Engel des Flusses Portiuncula)."},
  { "id": "1022", "title": "Heterochromia iridis", "user": "cyrano", "version": "1", "time": "2014-10-03T20:56:18.000Z", "rating": "2.50", "people": "2", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "3", "tags": "", "content": "Die US-Schauspielerin Mila Kunis hat Heterochromia iridis – sie hat zwei unterschiedliche Augenfarben. Weitere Personen: Jane Seymour, Simon Pegg, Daniela Ruah"},
  { "id": "1026", "title": "Murmeltier", "user": "volcano", "version": "1", "time": "2014-10-08T22:58:53.000Z", "rating": "2.50", "people": "4", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Das männliche Murmeltier heißt „Bär“, das weibliche „Katze“ und das Jungtier „Affe“."},
  { "id": "1027", "title": "Kobra", "user": "levesale", "version": "1", "time": "2014-10-14T10:04:01.000Z", "rating": "2.57", "people": "7", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "1", "tags": "", "content": "Der wissenschaftliche Name der Brillenschlange lautet Naja naja."},
  { "id": "1029", "title": "HUGO", "user": "bie", "version": "1", "time": "2014-10-19T16:23:39.000Z", "rating": "2.50", "people": "4", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Das Codewort „HUGO“ bezeichnet im Flugbetrieb mittransportierte Leichen – es steht entweder für „Human Gone“ oder für „heute unerwartet gestorbenes Objekt“."},
  { "id": "1030", "title": "Roulette", "user": "ceanage", "version": "1", "time": "2014-10-25T00:39:05.000Z", "rating": "4.00", "people": "1", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Alle Roulettezahlen addiert ergeben 666."}
];

// GET     /postings                      // get all postings
router.get('/postings', function(req, res) {
  res.json(postings);
});

// POST    /postings                      // create new posting
router.post("/postings", function(req, res) {
  // res.json(DB.createPosting(req.body.user, req.body.title, req.body.content, req.body.link, req.body.url, req.body.tags));
});

// GET     /postings/:PID                 // get posting with PID
router.get("/postings/:PID", function(req, res) {
  // res.json(DB.getPosting(req.params.PID));
});

// DELETE  /postings/:PID                 // delete posting with PID
router.delete("/", function(req, res) {
  // res.json(DB.deletePosting(req.params.PID));
});

// GET     /comments/:PID                 // get all comments for posting with PID
router.get("/comments/:PID", function(req, res) {
  // res.json(DB.getComments(req.params.PID));
});

// POST    /comments/:PID                 // create new comment for posting with PID
router.post("/comments/:PID", function(req, res) {
  // res.json(DB.createComment(req.params.PID, req.body.user, req.body.comment));
});

// DELETE  /comments/:CID                 // delete comment with CID
router.delete("/comments/:CID", function(req, res) {
  // res.json(DB.deleteComment(req.params.CID));
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

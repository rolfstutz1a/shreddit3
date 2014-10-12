function ShredditDB() {

  var nextID = 1031;
  var users;
  var postings = [
    { "id": "1001", "title": "Sektflasche", "user": "cyrano", "version": "1", "time": "2014-08-01T10:44:00.000Z", "rating": "3.00", "people": "5", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Die Bezeichnung für eine Sektflasche mit sechs Litern Inhalt ist „Methusalem“."},
    { "id": "1002", "title": "Pizza", "user": "volcano", "version": "1", "time": "2014-08-06T12:41:54.000Z", "rating": "2.29", "people": "7", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Eine Pizza mit dem Radius z und der Dicke a hat das Volumen Pi • z • z • a."},
    { "id": "1003", "title": "241543903", "user": "fridge", "version": "1", "time": "2014-08-11T17:07:02.000Z", "rating": "2.29", "people": "7", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "4", "tags": "", "content": "Wenn man in der Google Bildersuche nach 241543903 sucht, findet man Menschen, die ihren Kopf in Kühlschränke stecken."},
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
  var comments = [
    { "id": "1004", "pid": "1003", "user": "snassnal", "time": "2014-08-13T00:02:54.000Z", "comment": "Comment 1" },
    { "id": "1005", "pid": "1003", "user": "yeringem", "time": "2014-08-14T00:43:15.000Z", "comment": "Comment 2", "response": "snassnal" },
    { "id": "1006", "pid": "1003", "user": "suz", "time": "2014-08-15T03:05:55.000Z", "comment": "Comment 3", "response": "yeringem" },
    { "id": "1007", "pid": "1003", "user": "ceanage", "time": "2014-08-16T03:09:31.000Z", "comment": "Comment 4", "response": "suz" },
    { "id": "1014", "pid": "1013", "user": "bie", "time": "2014-09-13T22:32:10.000Z", "comment": "Comment 1" },
    { "id": "1015", "pid": "1013", "user": "yeringem", "time": "2014-09-15T01:49:19.000Z", "comment": "Comment 2", "response": "bie" },
    { "id": "1017", "pid": "1016", "user": "snassnal", "time": "2014-09-19T01:46:53.000Z", "comment": "Comment 1" },
    { "id": "1018", "pid": "1016", "user": "saycbel", "time": "2014-09-20T09:09:34.000Z", "comment": "Comment 2", "response": "snassnal" },
    { "id": "1019", "pid": "1016", "user": "snassnal", "time": "2014-09-21T10:44:47.000Z", "comment": "Comment 3", "response": "saycbel" },
    { "id": "1023", "pid": "1022", "user": "moorwor", "time": "2014-10-05T07:43:08.000Z", "comment": "Comment 1" },
    { "id": "1024", "pid": "1022", "user": "suz", "time": "2014-10-06T17:10:17.000Z", "comment": "Comment 2", "response": "moorwor" },
    { "id": "1025", "pid": "1022", "user": "suz", "time": "2014-10-07T18:39:54.000Z", "comment": "Comment 3", "response": "suz" },
    { "id": "1028", "pid": "1027", "user": "snassnal", "time": "2014-10-15T10:51:56.000Z", "comment": "Comment 1" }
  ];
  var ratings = [
    { "id": "1001", "count": "5", "average": "3.00", "votes": [
      {"user": "yeringem", "stars": "3"},
      {"user": "fridge", "stars": "4"},
      {"user": "snassnal", "stars": "4"},
      {"user": "volcano", "stars": "2"},
      {"user": "saycbel", "stars": "2"}
    ] },
    { "id": "1002", "count": "7", "average": "2.29", "votes": [
      {"user": "fridge", "stars": "1"},
      {"user": "lycina", "stars": "2"},
      {"user": "suz", "stars": "1"},
      {"user": "levesale", "stars": "2"},
      {"user": "saycbel", "stars": "3"},
      {"user": "woillpol", "stars": "4"},
      {"user": "bie", "stars": "3"}
    ] },
    { "id": "1003", "count": "7", "average": "2.29", "votes": [
      {"user": "yeringem", "stars": "2"},
      {"user": "snassnal", "stars": "1"},
      {"user": "moorwor", "stars": "4"},
      {"user": "cyrano", "stars": "2"},
      {"user": "levesale", "stars": "4"},
      {"user": "ceanage", "stars": "2"},
      {"user": "woillpol", "stars": "1"}
    ] },
    { "id": "1008", "count": "6", "average": "2.83", "votes": [
      {"user": "fridge", "stars": "3"},
      {"user": "lycina", "stars": "3"},
      {"user": "moorwor", "stars": "3"},
      {"user": "levesale", "stars": "4"},
      {"user": "ceanage", "stars": "3"},
      {"user": "bie", "stars": "1"}
    ] },
    { "id": "1009", "count": "5", "average": "2.00", "votes": [
      {"user": "lycina", "stars": "3"},
      {"user": "snassnal", "stars": "4"},
      {"user": "moorwor", "stars": "1"},
      {"user": "ceanage", "stars": "1"},
      {"user": "woillpol", "stars": "1"}
    ] },
    { "id": "1010", "count": "5", "average": "3.20", "votes": [
      {"user": "moorwor", "stars": "4"},
      {"user": "cyrano", "stars": "4"},
      {"user": "levesale", "stars": "4"},
      {"user": "volcano", "stars": "2"},
      {"user": "ceanage", "stars": "2"}
    ] },
    { "id": "1012", "count": "4", "average": "2.75", "votes": [
      {"user": "yeringem", "stars": "2"},
      {"user": "snassnal", "stars": "3"},
      {"user": "moorwor", "stars": "3"},
      {"user": "volcano", "stars": "3"}
    ] },
    { "id": "1013", "count": "5", "average": "2.60", "votes": [
      {"user": "fridge", "stars": "1"},
      {"user": "moorwor", "stars": "4"},
      {"user": "suz", "stars": "3"},
      {"user": "levesale", "stars": "1"},
      {"user": "bie", "stars": "4"}
    ] },
    { "id": "1016", "count": "5", "average": "2.60", "votes": [
      {"user": "fridge", "stars": "4"},
      {"user": "snassnal", "stars": "2"},
      {"user": "suz", "stars": "2"},
      {"user": "levesale", "stars": "1"},
      {"user": "bie", "stars": "4"}
    ] },
    { "id": "1020", "count": "2", "average": "2.00", "votes": [
      {"user": "yeringem", "stars": "2"},
      {"user": "saycbel", "stars": "2"}
    ] },
    { "id": "1021", "count": "5", "average": "1.60", "votes": [
      {"user": "yeringem", "stars": "4"},
      {"user": "suz", "stars": "1"},
      {"user": "levesale", "stars": "1"},
      {"user": "saycbel", "stars": "1"},
      {"user": "bie", "stars": "1"}
    ] },
    { "id": "1022", "count": "2", "average": "2.50", "votes": [
      {"user": "ceanage", "stars": "4"},
      {"user": "woillpol", "stars": "1"}
    ] },
    { "id": "1026", "count": "4", "average": "2.50", "votes": [
      {"user": "yeringem", "stars": "4"},
      {"user": "moorwor", "stars": "1"},
      {"user": "suz", "stars": "4"},
      {"user": "saycbel", "stars": "1"}
    ] },
    { "id": "1027", "count": "7", "average": "2.57", "votes": [
      {"user": "yeringem", "stars": "1"},
      {"user": "fridge", "stars": "2"},
      {"user": "lycina", "stars": "2"},
      {"user": "suz", "stars": "3"},
      {"user": "saycbel", "stars": "4"},
      {"user": "volcano", "stars": "4"},
      {"user": "ceanage", "stars": "2"}
    ] },
    { "id": "1029", "count": "4", "average": "2.50", "votes": [
      {"user": "moorwor", "stars": "3"},
      {"user": "volcano", "stars": "2"},
      {"user": "ceanage", "stars": "3"},
      {"user": "woillpol", "stars": "2"}
    ] },
    { "id": "1030", "count": "1", "average": "4.00", "votes": [
      {"user": "cyrano", "stars": "4"}
    ] }
  ];
  var languages = [
    {name: "English", locale: "EN"},
    {name: "Deutsch", locale: "DE"},
    {name: "Français", locale: "FR"},
    {name: "Italiano", locale: "IT"},
    {name: "Polski", locale: "PL"},
    {name: "Svenska", locale: "SE"},
    {name: "Español", locale: "ES"}
  ];
  (function(map) {
    map["bie"] = { "username": "bie", "password": "123456", "email": "bie@example.com", "since": "2014-07-04T10:44:00.000Z", "locale": "EN", "notify": "true", "admin": "true"};
    map["suz"] = { "username": "suz", "password": "123456", "email": "suz@example.com", "since": "2014-07-05T14:38:53.000Z", "locale": "EN", "notify": "false", "admin": "true"};
    map["moorwor"] = { "username": "moorwor", "password": "123456", "email": "moorwor@example.com", "since": "2014-07-06T20:05:42.000Z", "locale": "FR", "notify": "false", "admin": "false"};
    map["saycbel"] = { "username": "saycbel", "password": "123456", "email": "saycbel@example.com", "since": "2014-07-07T22:11:27.000Z", "locale": "IT", "notify": "true", "admin": "false"};
    map["cyrano"] = { "username": "cyrano", "password": "123456", "email": "cyrano@example.com", "since": "2014-07-09T08:57:51.000Z", "locale": "DE", "notify": "false", "admin": "false"};
    map["lycina"] = { "username": "lycina", "password": "123456", "email": "lycina@example.com", "since": "2014-07-10T16:06:27.000Z", "locale": "SE", "notify": "false", "admin": "false"};
    map["woillpol"] = { "username": "woillpol", "password": "123456", "email": "woillpol@example.com", "since": "2014-07-11T17:24:04.000Z", "locale": "IT", "notify": "true", "admin": "false"};
    map["levesale"] = { "username": "levesale", "password": "123456", "email": "levesale@example.com", "since": "2014-07-13T00:51:12.000Z", "locale": "EN", "notify": "false", "admin": "false"};
    map["fridge"] = { "username": "fridge", "password": "123456", "email": "fridge@example.com", "since": "2014-07-14T02:10:34.000Z", "locale": "IT", "notify": "true", "admin": "false"};
    map["snassnal"] = { "username": "snassnal", "password": "123456", "email": "snassnal@example.com", "since": "2014-07-15T11:36:27.000Z", "locale": "SE", "notify": "false", "admin": "false"};
    map["volcano"] = { "username": "volcano", "password": "123456", "email": "volcano@example.com", "since": "2014-07-16T23:34:11.000Z", "locale": "FR", "notify": "false", "admin": "false"};
    map["yeringem"] = { "username": "yeringem", "password": "123456", "email": "yeringem@example.com", "since": "2014-07-18T11:03:22.000Z", "locale": "PL", "notify": "true", "admin": "false"};
    map["ceanage"] = { "username": "ceanage", "password": "123456", "email": "ceanage@example.com", "since": "2014-07-19T11:56:36.000Z", "locale": "ES", "notify": "true", "admin": "false"};
  }(users));

  var getNextID = function() {
    var id = nextID;
    nextID += 1;
    return id;
  };

  var getPostingIndexById = function(id) {
    for (var index = 0; index < postings.length; ++index) {
      if (postings[index].id === id) {
        return index;
      }
    }
    return -1;
  };
  var getRatingIndexById = function(id) {
    for (var index = 0; index < ratings.length; ++index) {
      if (ratings[index].id === id) {
        return index;
      }
    }
    return -1;
  };

  this.prototype.deletePosting = function(id) {
    var index = getPostingIndexById(id);
    if (index !== -1) {
      postings.splice(index, 1);
    }
  };

  this.prototype.createPosting = function(user, title, content, link, url, tags) {
    var posting = { "id": getNextID(), "title": title, "user": user, "version": "1", "time": new Date().toJSON(), "rating": "0.00",
      "people": "0", "link": link, "url": url, "commentCount": "0", "tags": tags, "content": content };
    postings.push(posting);
    return posting;
  };

  this.prototype.getPostings = function() {
    return postings;
  };

  this.prototype.getUser = function(username) {
    var user = users[username];
    if (user !== undefined) {
      return user;
    }
    return null;
  };

  this.prototype.register = function(username, password, email) {
    if (this.isValidForRegister(username)) {
      var since = new Date().toJSON();
      var newUser = { "username": username, "password": password, "email": email, "since": since, "locale": "EN", "notify": "true", "admin": "false"};
      console.log(newUser);
      users.push(newUser);
      return true;
    }
    return false;
  };

  this.prototype.isValidForRegister = function(username) {
    return users[username] === undefined;
  };

  this.prototype.getLanguages = function() {
    return languages;
  };

}

var DB = new ShredditDB();

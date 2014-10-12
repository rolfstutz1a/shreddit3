var shredditApplication = angular.module("shreddit", ["ngCookies"]);

// , "ui.bootstrap","dialogs"

shredditApplication.config(function($routeProvider) {
  $routeProvider.
    when("/", {controller: SessionController, templateUrl: "tpl/login.html", hiddenMenu: true, hiddenPostingsMenu: true}).
    when("/postings", {controller: PostingsController, templateUrl: "tpl/postings.html"}).
    when("/new", {controller: NewController, templateUrl: "tpl/new.html", hiddenPostingsMenu: true}).
    when("/about", {controller: AboutController, templateUrl: "tpl/about.html", hiddenPostingsMenu: true}).
    when("/settings", {controller: SettingsController, templateUrl: "tpl/settings.html", hiddenPostingsMenu: true}).
    when("/register", {controller: RegisterController, templateUrl: "tpl/register.html", hiddenMenu: true, hiddenPostingsMenu: true}).
    when("/comments/:posting", {controller: CommentsController, templateUrl: "tpl/comments.html", hiddenPostingsMenu: true}).
    when("/newcomment/:posting", {controller: NewCommentController, templateUrl: "tpl/new-comment.html", hiddenPostingsMenu: true}).
    otherwise({redirectTo: "/", hiddenMenu: true});
});

function showMainMenu(visibleMenu, visiblePostingsMenu) {
  if (visibleMenu) {
    jQuery(".sc-show-if-loggedin").show();
    if (visiblePostingsMenu) {
      jQuery(".sc-show-if-posting").show();
    } else {
      jQuery(".sc-show-if-posting").hide();
    }
  } else {
    jQuery(".sc-show-if-posting").hide();
    jQuery(".sc-show-if-loggedin").hide();
  }
}

function selectSortOrder(order) {
  var button = jQuery(".sc-sort-button");
  button.removeClass("sc-sort-button-checked");
  button.removeClass("sc-sort-button-unchecked");
  if (order === "TOP") {
    jQuery("#si-sort-order-top-rated").addClass("sc-sort-button-checked");
  } else if (order === "MY") {
    jQuery("#si-sort-order-my-postings").addClass("sc-sort-button-checked");
  } else {
    jQuery("#si-sort-order-latest").addClass("sc-sort-button-checked");
  }
}

function SessionController($scope, $location, $routeParams, $cookieStore, $rootScope, userService, sessionService) {

  $scope.user = {
    username: sessionService.getUsername(),
    password: sessionService.getPassword(),
    loggedin: (sessionService.getUsername() !== undefined)
  };

  $scope.$on("$routeChangeStart", function(event, dest) {
    showMainMenu(dest.$route.hiddenMenu !== true, dest.$route.hiddenPostingsMenu !== true);
  });
  $scope.fake = function() {
    $scope.user.username = "volcano";
    $scope.user.password = "123456";
  };
  $scope.isValidCred = function() {
    var flag = ($scope.user.username !== undefined) && ($scope.user.username.length > 2) && ($scope.user.password !== undefined) && ($scope.user.password.length > 5);
    return flag;
  };
  $scope.isInvalidCred = function() {
    return !$scope.isValidCred();
  };

  $scope.login = function() {
    $scope.user.loggedin = false;
    if (($scope.isValidCred() === true) && (sessionService.login(userService, $scope.user.username, $scope.user.password) === true)) {
      $cookieStore.put("sss-username", $scope.user.username);
      $scope.user.loggedin = true;
      $location.path("/postings");
      selectSortOrder($cookieStore.get("sss-sort-order"));
    } else {
      sessionService.logout();
      $scope.user.loggedin = false;
      $location.path("/");
    }
    console.log("login: username=<" + $scope.user.username + "> password=<" + $scope.user.password + "> (" + $scope.user.loggedin + ")");
  };

  $scope.logout = function() {
    sessionService.logout();
    $scope.user.loggedin = false;
    $location.path("/");
    console.log("logout: username=<" + $scope.user.username + "> password=<" + $scope.user.password + "> (" + $scope.user.loggedin + ")");
  };

  $scope.showSettings = function() {
    $location.path("/settings");
  };

  $scope.showAbout = function() {
    $location.path("/about");
  };

  $scope.register = function() {
    $location.path("/register");
  };

  function setSortOrder(order) {
    $scope.user.sortOrder = order;
    selectSortOrder(order);
    $cookieStore.put("sss-sort-order", order);
    $rootScope.$broadcast("onChangeSortOrder");
    $location.path("/postings");
  }

  $scope.setSortOrderLatest = function() {
    setSortOrder("LATEST");
  };
  $scope.setSortOrderTopRated = function() {
    setSortOrder("TOP");
  };
  $scope.setSortOrderMyPostings = function() {
    setSortOrder("MY");
  };

  $scope.addNewPosting = function() {
    $location.path("/new");
  };
  $scope.close = function() {
    $location.path("/postings");
  };
}

function RegisterController($scope, $location, $routeParams, userService, sessionService) {
  $scope.registerInfo = {};

  $scope.register = function() {
    var user = $scope.registerInfo;
    if (userService.register(user.username, user.password, user.email)) {
      sessionService.login(userService.getUser(user.username));
      $location.path("/");
    }
  };
  $scope.close = function() {
    $location.path("/");
  };
}

function SettingsController($scope, $location, $routeParams, userService, sessionService) {
  $scope.settings = {};
  $scope.languages = userService.getLanguages();

  (function(stngs) {
    var user = userService.getUserRef(sessionService.getUsername());
    stngs.language = userService.getLanguage(user.locale);
    stngs.email = user.email;
    stngs.notify = user.notify === "true";
    console.log("init settings!");
  }($scope.settings));

  $scope.save = function() {
    var user = userService.getUserRef(sessionService.getUsername());
    user.email = $scope.settings.email;
    user.locale = $scope.settings.language.locale;
    user.notify = $scope.settings.notify.toString();
    console.log("notify: " + user.notify);
    userService.save(user);
    $scope.close();
  };
  $scope.close = function() {
    $location.path("/postings");
  };
}

function NewCommentController($scope, $location, $routeParams) {
  $scope.close = function() {
    $location.path("/postings");
  };
}

function CommentsController($scope, $location, $routeParams) {
  $scope.close = function() {
    $location.path("/postings");
  };
}

function NewController($scope, $location, $routeParams, $cookieStore) {
  $scope.username = $cookieStore.get("sss-username");

  $scope.close = function() {
    $location.path("/postings");
  };
}

function AboutController($scope, $location, $routeParams) {
  $scope.close = function() {
    $location.path("/postings");
  };
}

function PostingsController($scope, $location, $routeParams, $cookieStore, postingService) {
  $scope.postings = [];

  var callback = function(data, status, headers, config) {
    $scope.postings = data;
  }

  postingService.loadPostings(callback, $cookieStore.get("sss-sort-order"), $cookieStore.get("sss-username"));
  $scope.getUser = function() {
    return $cookieStore.get("sss-username");
  };
  $scope.deletePosting = function(id) {
    postingService.deletePosting(id);
    postingService.loadPostings(callback, $cookieStore.get("sss-sort-order"), $cookieStore.get("sss-username"));
  };
  $scope.$on("onChangeSortOrder", function(event, dest) {
    postingService.loadPostings(callback, $cookieStore.get("sss-sort-order"), $cookieStore.get("sss-username"));
  });
}

// -------------------------------------------------------------------------
// SERVICES
// -------------------------------------------------------------------------
shredditApplication.factory("postingService", function($http) {

  var postings = [
    { "id": "1411395110633", "title": "Sektflasche", "user": "woillpol", "date": "22.09.2014", "time": "16:11", "rating": ".76", "people": "28", "stars": "1", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "1", "tags": "", "content": "Die Bezeichnung für eine Sektflasche mit sechs Litern Inhalt ist „Methusalem“."},
    { "id": "1411387121633", "title": "Pizza", "user": "volcano", "date": "22.09.2014", "time": "13:58", "rating": "2.69", "people": "38", "stars": "3", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "2", "tags": "", "content": "Eine Pizza mit dem Radius z und der Dicke a hat das Volumen Pi • z • z • a."},
    { "id": "1411379139633", "title": "241543903", "user": "fridge", "date": "22.09.2014", "time": "11:45", "rating": "2.02", "people": "0", "stars": "2", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Wenn man in der Google Bildersuche nach 241543903 sucht, findet man Menschen, die ihren Kopf in Kühlschränke stecken."},
    { "id": "1411369332633", "title": "Nase", "user": "cyrano", "date": "22.09.2014", "time": "09:02", "rating": "1.22", "people": "16", "stars": "1", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "2", "tags": "", "content": "Der Winzer und Weintester Ilja Gort hat seine Nase für 5 Millionen Euro versichern lassen. Die Bedingung der Versicherung war allerdings, dass er weder Motorrad fahren noch boxen noch als Feuerschlucker oder Assistent eines Messerwerfers arbeiten darf."},
    { "id": "1411359520633", "title": "Im Aufzug", "user": "woillpol", "date": "22.09.2014", "time": "06:18", "rating": ".41", "people": "36", "stars": "0", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Schauspieler Jack Lemmon wurde in einem Aufzug geboren."},
    { "id": "1411349592633", "title": "Psycho", "user": "cyrano", "date": "22.09.2014", "time": "03:33", "rating": "4.29", "people": "11", "stars": "4", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "2", "tags": "", "content": "In der berühmten Duschszene aus „Psycho“ wurde Schokosirup als Blut verwendet."},
    { "id": "1411340929633", "title": "Liechtensteinische Nationalhymne", "user": "cyrano", "date": "22.09.2014", "time": "01:08", "rating": "3.54", "people": "18", "stars": "4", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "2", "tags": "", "content": "Die liechtensteinische Nationalhymne „Oben am jungen Rhein“ hat dieselbe Melodie wie „God Save The Queen“."},
    { "id": "1411331994633", "title": "Vulkaniergruß", "user": "levesale", "date": "21.09.2014", "time": "22:39", "rating": ".73", "people": "15", "stars": "1", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Zachary Quinto musste sich beim Dreh von „Star Trek“ die Finger zusammenkleben, um den Vulkaniergruß zu machen."},
    { "id": "1411323770633", "title": "Binnenstaaten", "user": "volcano", "date": "21.09.2014", "time": "20:22", "rating": "4.38", "people": "25", "stars": "4", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Nur zwei Binnenstaaten der Erde sind auch ausschließlich von Binnenstaaten umgeben. Nur zwei Länder weltweit sind Binnenstaaten, die außerdem auch ausschließlich von Binnenstaaten umgeben sind: Liechtenstein und Usbekistan. Liechtenstein liegt zwischen der Schweiz und Österreich, während Usbekistan von Kasachstan, Kirgisistan, Tadschikistan, Afghanistan und Turkmenistan umgeben ist."},
    { "id": "1411314650633", "title": "Einmarsch in Liechtenstein", "user": "snassnal", "date": "21.09.2014", "time": "17:50", "rating": "4.10", "people": "30", "stars": "4", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Anfang 2007 marschierte die Schweizer Armee aus Versehen in Liechtenstein ein."},
    { "id": "1411307762633", "title": "Barbies voller Name lautet Barbara Millicent Roberts", "user": "saycbel", "date": "21.09.2014", "time": "15:56", "rating": ".58", "people": "27", "stars": "1", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Die Barbie-Puppe ist wohl weltweit eines der bekanntesten Spielzeuge überhaupt. Sie wurde von der Amerikanerin Ruth Handler kreiert, die die Puppe nach ihrer Tochter Barbara benannte. 1959 hatte die Barbie ihre Premiere auf dem Markt. Der volle Name der Puppe lautet Barbara Millicent Roberts. Barbies Freund Ken heißt mit vollem Namen Ken Carson."},
    { "id": "1411299460633", "title": "Name Los Angeles'", "user": "moorwor", "date": "21.09.2014", "time": "13:37", "rating": "1.28", "people": "24", "stars": "1", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Los Angeles hieß ursprünglich „El Pueblo de Nuestra Señora la Reina de los Ángeles de Porciúncula“ (Das Dorf Unserer Lieben Frau, Königin der Engel des Flusses Portiuncula)."},
    { "id": "1411291150633", "title": "Heterochromia iridis", "user": "lycina", "date": "21.09.2014", "time": "11:19", "rating": ".53", "people": "4", "stars": "1", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "1", "tags": "", "content": "Die US-Schauspielerin Mila Kunis hat Heterochromia iridis – sie hat zwei unterschiedliche Augenfarben. Weitere Personen: Jane Seymour, Simon Pegg, Daniela Ruah"},
    { "id": "1411282939633", "title": "Murmeltier", "user": "moorwor", "date": "21.09.2014", "time": "09:02", "rating": ".16", "people": "38", "stars": "0", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "2", "tags": "", "content": "Das männliche Murmeltier heißt „Bär“, das weibliche „Katze“ und das Jungtier „Affe“."},
    { "id": "1411274611633", "title": "Kobra", "user": "snassnal", "date": "21.09.2014", "time": "06:43", "rating": "3.28", "people": "25", "stars": "3", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Der wissenschaftliche Name der Brillenschlange lautet Naja naja."},
    { "id": "1411267063633", "title": "HUGO", "user": "woillpol", "date": "21.09.2014", "time": "04:37", "rating": "1.80", "people": "23", "stars": "2", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Das Codewort „HUGO“ bezeichnet im Flugbetrieb mittransportierte Leichen – es steht entweder für „Human Gone“ oder für „heute unerwartet gestorbenes Objekt“."},
    { "id": "1411258763633", "title": "Roulette", "user": "levesale", "date": "21.09.2014", "time": "02:19", "rating": "3.40", "people": "6", "stars": "3", "link": "HSR", "url": "http://www.hsr.ch", "commentCount": "0", "tags": "", "content": "Alle Roulettezahlen addiert ergeben 666."}
    // { "id": "", "title": "", "user": "", "date": "", "time": "", "rating": "", "people": "", "stars": "", "link": "", "url": "", "commentCount": "",
    //   "tags": "",
    //   "content": ""}
  ];

  var createCompareFunction = function(prop, asc) {
    return function(a, b) {
      if (a[prop] > b[prop]) {
        return asc;
      }
      if (a[prop] < b[prop]) {
        return -asc;
      }
      return 0;
    };
  };
  var indexById = function(id) {
    for (var index = 0; index < postings.length; ++index) {
      if (postings[index].id === id) {
        return index;
      }
    }
    return -1;
  };
  var sortOrderLatest = function() {
    postings.sort(createCompareFunction("id", -1));
    return postings;
  };
  var sortOrderTopRated = function() {
    postings.sort(createCompareFunction("rating", -1));
    return postings;
  };
  var sortOrderMyPostings = function(username) {
    var array = [];
    for (var index = 0; index < postings.length; ++index) {
      if (postings[index].user === username) {
        array.push(postings[index]);
      }
    }
    array.sort(createCompareFunction("id", -1));
    return array;
  };

  return {
    deletePosting: function(id) {
      var index = indexById(id);
      if (index !== -1) {
        postings.splice(index, 1);
      }
    },
    loadPostings: function(success, order, username) {

      $http.get("/data/postings").success(success);

      /*
      if (order === "TOP") {
        return sortOrderTopRated();
      }
      if (order === "MY") {
        return sortOrderMyPostings(username);
      }
      return sortOrderLatest();
      */
    }
  };

});

shredditApplication.factory("userService", function() {

  var users = {};
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
    map["suz"] = { "username": "suz", "password": "123456", "email": "suz@example.com", "since": "2014/09/09", "locale": "PL", "notify": "false", "admin": "true"};
    map["moorwor"] = { "username": "moorwor", "password": "123456", "email": "moorwor@example.com", "since": "2014/09/09", "locale": "PL", "notify": "false"};
    map["saycbel"] = { "username": "saycbel", "password": "123456", "email": "saycbel@example.com", "since": "2014/09/09", "locale": "DE", "notify": "true"};
    map["cyrano"] = { "username": "cyrano", "password": "123456", "email": "cyrano@example.com", "since": "2014/09/09", "locale": "PL", "notify": "true"};
    map["lycina"] = { "username": "lycina", "password": "123456", "email": "lycina@example.com", "since": "2014/09/09", "locale": "PL", "notify": "true"};
    map["woillpol"] = { "username": "woillpol", "password": "123456", "email": "woillpol@example.com", "since": "2014/09/09", "locale": "PL", "notify": "true"};
    map["levesale"] = { "username": "levesale", "password": "123456", "email": "levesale@example.com", "since": "2014/09/09", "locale": "ES", "notify": "true"};
    map["fridge"] = { "username": "fridge", "password": "123456", "email": "fridge@example.com", "since": "2014/09/09", "locale": "DE", "notify": "false"};
    map["snassnal"] = { "username": "snassnal", "password": "123456", "email": "snassnal@example.com", "since": "2014/09/09", "locale": "FR", "notify": "false"};
    map["volcano"] = { "username": "volcano", "password": "123456", "email": "volcano@example.com", "since": "2014/09/09", "locale": "ES", "notify": "true"};
    map["yeringem"] = { "username": "yeringem", "password": "123456", "email": "yeringem@example.com", "since": "2014/09/09", "locale": "PL", "notify": "true"};
    map["ceanage"] = { "username": "ceanage", "password": "123456", "email": "ceanage@example.com", "since": "2014/09/09", "locale": "SE", "notify": "true"};
  }(users));

  return {
    getUser: function(username) {
      var user = users[username];
      if (user !== undefined) {
        return angular.copy(user);
      }
      return null;
    },
    getUserRef: function(username) {
      return users[username];
    },
    save: function(user) {
      console.log("save user: " + user);
    },
    register: function(username, password, email) {
      if (this.isValidForRegister(username)) {
        var newUser = {"username": username, "password": password, "email": email, "since": "2014/09/09", "settings": {"locale": "EN", "notify": "true"}};
        console.log(newUser);
        users.push(newUser);
        return true;
      }
      return false;
    },
    isValidForRegister: function(username) {
      return users[username] === undefined;
    },
    getLanguage: function(locale) {
      for (var index = 0; index < languages.length; ++index) {
        if (languages[index].locale === locale) {
          return languages[index];
        }
      }
      return languages[0];
    },
    getLanguages: function() {
      return languages;
    }
  };
});

shredditApplication.factory("sessionService", function() {

  var currentUser = {};

  return {
    getUsername: function() {
      if (currentUser.username) {
        return currentUser.username;
      }
      return undefined;
    },
    getPassword: function() {
      if (currentUser.password) {
        return currentUser.password;
      }
      return undefined;
    },
    getEMail: function() {
      return currentUser.email;
    },
    login: function(service, username, password) {
      if ((!username) || (!password)) {
        this.currentUser = {};
        return false;
      }
      var user = service.getUser(username);
      if ((user === null) || (user.password !== password)) {
        this.currentUser = {};
        return false;
      }
      currentUser.username = username;
      currentUser.password = password;
      currentUser.sortOrder = "LATEST";
      return true;
    },
    logout: function() {
      this.currentUser = {};
    }
  };
});

var shredditApplication = angular.module("shreddit", ["ngCookies"]);

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

function onLoadPostings(data) {
  for (var index = 0; index < data.length; ++index) {
    data[index].date = new Date(Date.parse(data[index].time)).toLocaleString();
  }
  return data;
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

function NewController($scope, $location, $routeParams, $cookieStore, postingService) {
  $scope.posting =
  { "title": "Morologie",
    "user": $cookieStore.get("sss-username"),
    "link": "Wiki: Morologie",
    "url": "http://de.wikipedia.org/wiki/Morologie",
    "tags": "Wissenschaft",
    "content": "Die Wissenschaft von der Dummheit heisst Morologie." };

  $scope.createPosting = function() {
    postingService.createPosting($scope.posting);
    $location.path("/postings");
  };

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
    $scope.postings = onLoadPostings(data);
  };
  var reload = function(data, status, headers, config) {
    postingService.loadPostings(callback, $cookieStore.get("sss-sort-order"), $cookieStore.get("sss-username"));
  };

  postingService.loadPostings(callback, $cookieStore.get("sss-sort-order"), $cookieStore.get("sss-username"));
  $scope.getUser = function() {
    return $cookieStore.get("sss-username");
  };
  $scope.deletePosting = function(id) {
    postingService.deletePosting(id, reload);
  };
  $scope.$on("onChangeSortOrder", function(event, dest) {
    postingService.loadPostings(callback, $cookieStore.get("sss-sort-order"), $cookieStore.get("sss-username"));
  });
}

// -------------------------------------------------------------------------
// SERVICES
// -------------------------------------------------------------------------
shredditApplication.factory("postingService", function($http) {

  return {
    deletePosting: function(id, success) {
      $http.delete("/data/postings/"+id).success(success);
    },
    createPosting: function(posting) {
      $http({url: "/data/postings", method: "POST", data: posting});
    },
    loadPostings: function(success, order, username) {
      $http.get("/data/postings?order="+order+"&user="+username).success(success);
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

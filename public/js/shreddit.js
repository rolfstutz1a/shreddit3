var shredditApplication = angular.module("shreddit", ["ngCookies"]);

/**
 *
 */
shredditApplication.config(function($routeProvider) {
  $routeProvider.
    when("/", {controller: SessionController, templateUrl: "tpl/login.html", hiddenMenu: true, hiddenPostingsMenu: true}).
    when("/postings", {controller: PostingsController, templateUrl: "tpl/postings.html"}).
    when("/new", {controller: NewController, templateUrl: "tpl/new.html", hiddenPostingsMenu: true}).
    when("/about", {controller: AboutController, templateUrl: "tpl/about.html", hiddenPostingsMenu: true}).
    when("/settings", {controller: SettingsController, templateUrl: "tpl/settings.html", hiddenPostingsMenu: true}).
    when("/register", {controller: RegisterController, templateUrl: "tpl/register.html", hiddenMenu: true, hiddenPostingsMenu: true}).
    when("/comments/:pid", {controller: CommentsController, templateUrl: "tpl/comments.html", hiddenPostingsMenu: true}).
    when("/newcomment/:pid", {controller: NewCommentController, templateUrl: "tpl/new-comment.html", hiddenPostingsMenu: true}).
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

/*
 (function(){
 }());
 jQuery(function(){

 });
 */

function onUpdateDate(data) {
  if (Array.isArray(data)) {
    for (var index = 0; index < data.length; ++index) {
      data[index].date = new Date(Date.parse(data[index].time)).toLocaleString();
    }
    return data;
  }
  if (data) {
    data.date = new Date(Date.parse(data.time)).toLocaleString();
  }
  return data;
}

function findPostingByID(id, postings) {
  if (Array.isArray(postings)) {
    for (var index = 0; index < postings.length; ++index) {
      if (id === postings[index]._id) {
        return postings[index];
      }
    }
  }
  return null;
}

/**
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param $cookieStore
 * @param $rootScope
 * @param userService
 * @param sessionService
 * @constructor
 */
function SessionController($scope, $location, $routeParams, $cookieStore, $rootScope, userService, sessionService) {

  $scope.user = {
    username: sessionService.getUsername(),
    password: sessionService.getPassword(),
    loggedin: (sessionService.getUsername() !== undefined)
  };

  $scope.$on("$routeChangeStart", function(event, dest) {
    showMainMenu(dest.$route.hiddenMenu !== true, dest.$route.hiddenPostingsMenu !== true);
  });
  $scope.fake = function(name) {
    $scope.user.username = name;
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

  $scope.onSearch = function(key) {
    if (key === 13) {
      $rootScope.$broadcast("onReloadPostings");
    } else if (key === 0) {
      var srch = jQuery("#srch-term").val();
      if ((srch) && (srch.length > 0)) {
        jQuery("#srch-term").val("");
        $rootScope.$broadcast("onReloadPostings");
      }
    }
    jQuery("#srch-term").focus();
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
    $rootScope.$broadcast("onReloadPostings");
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

/**
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param userService
 * @param sessionService
 * @constructor
 */
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

/**
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param userService
 * @param sessionService
 * @constructor
 */
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

function NewCommentController($scope, $location, $routeParams, $cookieStore, postingService) {

  $scope.posting = {};
  $scope.comment = {"user": $cookieStore.get("sss-username")};

  var onLoadPosting = function(data, status, headers, config) {
    $scope.posting = onUpdateDate(data);
  };

  postingService.loadPosting($routeParams.pid, onLoadPosting);

  $scope.createComment = function(pid) {
    postingService.createComment(pid, $scope.comment);
    $location.path("/comments/" + pid);
  };
  $scope.close = function(pid) {
    $location.path("/comments/" + pid);
  };
}

function CommentsController($scope, $location, $routeParams, postingService) {

  $scope.posting = {};
  $scope.comments = {};

  var onLoadComments = function(data, status, headers, config) {
    $scope.comments = onUpdateDate(data);
  };
  var onLoadPosting = function(data, status, headers, config) {
    $scope.posting = onUpdateDate(data);
    postingService.loadComments($routeParams.pid, onLoadComments);
  };

  postingService.loadPosting($routeParams.pid, onLoadPosting);

  $scope.addComment = function(pid) {
    $location.path("/newcomment/" + pid);
  };
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

function RatingController($scope, $location, $routeParams, $cookieStore, postingService) {

  $scope.rate = function() {
    console.log(JSON.stringify($scope.rating));
  };
}

function PostingsController($scope, $location, $routeParams, $cookieStore, postingService) {

  jQuery("#si-rating-dialog").dialog({
    autoOpen: false,
    width: 300,
    modal: true,
    buttons: [{ text: "Close",
        click: function() {
          jQuery(this).dialog("close");
        }
      }]
  });

  var onRate = function(data, status, headers, config) {
    console.log(" >>> Rating: " + JSON.stringify(data));
    var posting = findPostingByID(data._id, $scope.postings);
    if (posting) {
      posting.people = data.people;
      posting.rating = data.rating;
    }
  };

  function processRating(id, rate) {
    return function(event) {
      jQuery("#si-rating-dialog").dialog("close");
      console.log("Rating: id=" + id + " rate=" + rate);
      postingService.ratePosting(id, $cookieStore.get("sss-username"), rate, onRate);
      event.preventDefault();     };
  }

  $scope.openRatingDialog = function(id, user, title) {
    if (user !== $cookieStore.get("sss-username")) {
      var dlg = jQuery("#si-rating-dialog");
      for (var rate = 0; rate <= 5; ++rate) {
        var stars = jQuery("#si-select-stars-" + rate);
        stars.unbind("click"); // remove possible previous listeners
        stars.bind("click", processRating(id, rate));
      }
      dlg.dialog("option", "title", title);
      dlg.dialog("open");
    }
  };

  $scope.username = $cookieStore.get("sss-username");
  $scope.postings = [];

  var callback = function(data, status, headers, config) {
    $scope.postings = onUpdateDate(data);
  };
  var reload = function(data, status, headers, config) {
    postingService.loadPostings(callback, $cookieStore.get("sss-sort-order"), $cookieStore.get("sss-username"), jQuery("#srch-term").val());
  };

  postingService.loadPostings(callback, $cookieStore.get("sss-sort-order"), $cookieStore.get("sss-username"), jQuery("#srch-term").val());

  $scope.getUser = function() {
    return $cookieStore.get("sss-username");
  };
  $scope.deletePosting = function(id) {
    postingService.deletePosting(id, reload);
  };
  $scope.showComments = function(id) {
    $location.path("/comments/" + id);
  };
  $scope.$on("onReloadPostings", function(event, dest) {
    postingService.loadPostings(callback, $cookieStore.get("sss-sort-order"), $cookieStore.get("sss-username"), jQuery("#srch-term").val());
  });
}

// -------------------------------------------------------------------------
// SERVICES
// -------------------------------------------------------------------------
shredditApplication.factory("postingService", function($http) {

  return {
    deletePosting: function(id, onDelete) {
      $http.delete("/data/postings/" + id).success(onDelete);
    },
    ratePosting: function(id, user, stars, onRate) {
      $http.put("data/ratings/"+id+"/"+user+"/" + stars).success(onRate);
    },
    createPosting: function(posting) {
      $http({url: "/data/postings", method: "POST", data: posting});
    },
    loadPosting: function(pid, onLoad) {
      $http.get("/data/postings/" + pid).success(onLoad);
    },
    loadComments: function(pid, onLoad) {
      $http.get("/data/comments/" + pid).success(onLoad);
    },
    createComment: function(pid, comment) {
      $http({url: "/data/comments/" + pid, method: "POST", data: comment});
    },
    loadPostings: function(onLoad, order, username, search) {
      $http.get("/data/postings?order=" + order + "&user=" + username + "&search=" + search).success(onLoad);
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
    map["bie"] = { "username": "bie", "password": "123456", "email": "r1bieri@hsr.ch", "since": "2014/09/09", "locale": "PL", "notify": "false"};
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

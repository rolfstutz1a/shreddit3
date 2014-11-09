"use strict";

angular.module("shreddit", ["ngRoute", "ngCookies"]);

// -------------------------------------------------------------------------
// ROUTING CONFIGURATION
// -------------------------------------------------------------------------
angular.module("shreddit").config(function($routeProvider) {
  $routeProvider.
    when("/", {
      controller: "SessionController",
      templateUrl: "tpl/login.html",
      hiddenMenu: true,
      hiddenPostingsMenu: true
    }).
    when("/postings", {
      controller: "PostingsController",
      templateUrl: "tpl/postings.html",
      hiddenMenu: false,
      hiddenPostingsMenu: false
    }).
    when("/new", {
      controller: "NewController",
      templateUrl: "tpl/new.html",
      hiddenMenu: false,
      hiddenPostingsMenu: true
    }).
    when("/about", {
      controller: "AboutController",
      templateUrl: "tpl/about.html",
      hiddenMenu: false,
      hiddenPostingsMenu: true
    }).
    when("/settings", {
      controller: "SettingsController",
      templateUrl: "tpl/settings.html",
      hiddenMenu: false,
      hiddenPostingsMenu: true
    }).
    when("/register", {
      controller: "RegisterController",
      templateUrl: "tpl/register.html",
      hiddenMenu: true,
      hiddenPostingsMenu: true
    }).
    when("/comments/:pid", {
      controller: "CommentsController",
      templateUrl: "tpl/comments.html",
      hiddenMenu: false,
      hiddenPostingsMenu: true
    }).
    when("/newcomment/:pid", {
      controller: "NewCommentController",
      templateUrl: "tpl/new-comment.html",
      hiddenMenu: false,
      hiddenPostingsMenu: true
    }).
    when("/error", {
      controller: "ErrorController",
      templateUrl: "tpl/error.html",
      hiddenMenu: true,
      hiddenPostingsMenu: true
    }).
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

function correctDateAndLink(posting) {
  posting.date = new Date(Date.parse(posting.time));
  if ((!posting.link) && (posting.url)) {
    posting.link = posting.url;
  }
}

function onUpdateDate(data) {
  if (Array.isArray(data)) {
    for (var index = 0; index < data.length; ++index) {
      correctDateAndLink(data[index]);
    }
    return data;
  }
  if (data) {
    correctDateAndLink(data);
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

// -------------------------------------------------------------------------
// CONTROLLERS
// -------------------------------------------------------------------------

angular.module("shreddit").controller("ErrorController",
  function($scope, $location, errorService) {

    $scope.error = errorService.getError();

    $scope.home = function() {
      $location.path("/");
    };
  });

/**
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param $cookies
 * @param $rootScope
 * @param adminService
 * @constructor
 */
angular.module("shreddit").controller("SessionController",
  function($scope, $location, $routeParams, $cookies, $rootScope, adminService, errorService) {

    $scope.user = {username: "", password: ""};

    $scope.$on("$routeChangeStart", function(event, dest) {
      showMainMenu(dest.$$route.hiddenMenu !== true, dest.$$route.hiddenPostingsMenu !== true);
    });

    $scope.fake = function(name) {
      $scope.user.username = name;
      $scope.user.password = "123456";
    };

    var onError = function(data, status, headers, config) {
      errorService.setError(status, data);
      $location.path("/error");
    };

    var onLogin = function(data, status, headers, config) {
      $location.path("/postings");
      selectSortOrder($cookies["sss-sort-order"]);
    };
    var onLogout = function(data, status, headers, config) {
      $location.path("/");
    };

    $scope.login = function() {
      if ($scope.loginForm.$valid) {
        adminService.login($scope.user.username, $scope.user.password, onLogin, onError);
      }
    };

    $scope.logout = function() {
      adminService.logout(onLogout, onError);
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
      $cookies["sss-sort-order"] = order;
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
  });

/**
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param adminService
 * @constructor
 */
angular.module("shreddit").controller("RegisterController", function($scope, $location, $routeParams, adminService) {
  $scope.registerInfo = {};

  $scope.register = function() {
    //    var user = $scope.registerInfo;
    //    if (userServiceXXX.register(user.username, user.password, user.email)) {
    //      sessionServiceXXX.login(userServiceXXX.get User(user.username));
    //      $location.path("/");
    //    }
  };
  $scope.close = function() {
    $location.path("/");
  };
});

/**
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param adminService
 * @constructor
 */
angular.module("shreddit").controller("SettingsController", function($scope, $location, $routeParams, $cookies, adminService) {
  $scope.settings = {};
  $scope.languages = adminService.getLanguages();

  //  (function(stngs) {
  //    var user = userServiceXXX.get User Ref(sessionServiceXXX.getUsername());
  //    stngs.language = userServiceXXX.getLanguage(user.locale);
  //    stngs.email = user.email;
  //    stngs.notify = user.notify === "true";
  //    console.log("init settings!");
  //  }($scope.settings));

  $scope.save = function() {
    var userdata;
    //    var user = userServiceXXX.get User Ref(sessionServiceXXX.getUsername());
    //    user.email = $scope.settings.email;
    //    user.locale = $scope.settings.language.locale;
    //    user.notify = $scope.settings.notify.toString();
    console.log("notify: " + user.notify);
    adminService.saveSettings(userdata);
    $scope.close();
  };
  $scope.close = function() {
    $location.path("/postings");
  };
});

angular.module("shreddit").controller("NewCommentController", function($scope, $location, $routeParams, $rootScope, $cookies, postingService, adminService, errorService) {

  $scope.posting = {};
  $scope.comment = {"user": adminService.getUser()};

  var onError = function(data, status, headers, config) {
    errorService.setError(status, data);
    $location.path("/error");
  };
  var onLoadPosting = function(data, status, headers, config) {
    $scope.posting = onUpdateDate(data);
  };

  postingService.loadPosting($routeParams.pid, onLoadPosting, onError);

  $scope.createComment = function(pid) {
    postingService.createComment(pid, $scope.comment, onError);
    $location.path("/comments/" + pid);
  };
  $scope.close = function(pid) {
    $location.path("/comments/" + pid);
  };
});

angular.module("shreddit").controller("CommentsController", function($scope, $location, $routeParams, postingService, errorService) {

  $scope.posting = {};
  $scope.comments = {};

  var onError = function(data, status, headers, config) {
    errorService.setError(status, data);
    $location.path("/error");
  };
  var onLoadComments = function(data, status, headers, config) {
    $scope.comments = onUpdateDate(data);
  };
  var onLoadPosting = function(data, status, headers, config) {
    $scope.posting = onUpdateDate(data);
    postingService.loadComments($routeParams.pid, onLoadComments, onError);
  };

  postingService.loadPosting($routeParams.pid, onLoadPosting, onError);

  $scope.addComment = function(pid) {
    $location.path("/newcomment/" + pid);
  };
  $scope.close = function() {
    $location.path("/postings");
  };
});

angular.module("shreddit").controller("NewController", function($scope, $location, $routeParams, $cookies, postingService, adminService, errorService) {
  $scope.posting =
  {
    "title": "Morologie",
    "user": adminService.getUser(),
    "link": "Wiki: Morologie",
    "url": "http://de.wikipedia.org/wiki/Morologie",
    "tags": "Wissenschaft",
    "content": "Die Wissenschaft von der Dummheit heisst Morologie."
  };

  var onError = function(data, status, headers, config) {
    errorService.setError(status, data);
    $location.path("/error");
  };

  $scope.createPosting = function() {
    postingService.createPosting($scope.posting, onError);
    $location.path("/postings");
  };

  $scope.close = function() {
    $location.path("/postings");
  };
});

angular.module("shreddit").controller("AboutController", function($scope, $location, $routeParams) {
  $scope.close = function() {
    $location.path("/postings");
  };
});

/**
 * The PostingsController ensures that the requested postings are presented to the user.
 *
 * @content username this contains the name of the currently logged-in user.
 * @content postings contains an array (can be empty) with shown postings.
 * @content status 0: no postings visible,  >0: visible postings,  -1: currently loading
 */
angular.module("shreddit").controller("PostingsController", function($scope, $location, $rootScope, $routeParams, $cookies, $timeout, postingService, adminService, errorService) {

  $scope.username = adminService.getUser();
  $scope.postings = [];
  $scope.status = -1;

  jQuery("#si-rating-dialog").dialog({
    autoOpen: false,
    width: 300,
    modal: true,
    buttons: [
      {
        text: "Close",
        click: function() {
          jQuery(this).dialog("close");
        }
      }
    ]
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
      postingService.ratePosting(id, adminService.getUser(), rate, onRate, onError);
      event.preventDefault();
    };
  }

  $scope.openRatingDialog = function(id, user, title) {
    if (!adminService.isUser(user)) {
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

  var onError = function(data, status, headers, config) {
    $scope.status = 0;
    errorService.setError(status, data);
    $location.path("/error");
  };
  var onLoad = function(data, status, headers, config) {
    $timeout(function() {
      $scope.postings = onUpdateDate(data);
      $scope.status = $scope.postings.length;
      console.log("status: " + $scope.status);
      if ($scope.status === 0) {
        jQuery("#si-add-new-posting").effect("highlight", {times: 5, easing: "easeOutQuart"}, 2500);
      }
    }, 1111);
  };
  var onReload = function(data, status, headers, config) {
    $scope.posting = [];
    $scope.status = -1;
    postingService.loadPostings(onLoad, onError, $cookies["sss-sort-order"], adminService.getUser(), jQuery("#srch-term").val());
  };

  postingService.loadPostings(onLoad, onError, $cookies["sss-sort-order"], adminService.getUser(), jQuery("#srch-term").val());

  $scope.getUser = function() {
    return adminService.getUser();
  };
  $scope.deletePosting = function(id) {
    postingService.deletePosting(id, onReload, onError);
  };
  $scope.showComments = function(id) {
    $location.path("/comments/" + id);
  };
  $scope.$on("onReloadPostings", function(event) {
    $scope.posting = [];
    $scope.status = -1;
    postingService.loadPostings(onLoad, onError, $cookies["sss-sort-order"], adminService.getUser(), jQuery("#srch-term").val());
  });
});

// -------------------------------------------------------------------------
// SERVICES
// -------------------------------------------------------------------------
angular.module("shreddit").factory("postingService", function($http) {

  return {
    deletePosting: function(id, onDelete, onError) {
      $http.delete("/data/postings/" + id).success(onDelete).error(onError);
    },
    ratePosting: function(id, user, stars, onRate, onError) {
      $http.put("data/ratings/" + id + "/" + user + "/" + stars).success(onRate).error(onError);
    },
    createPosting: function(posting, onError) {
      $http({url: "/data/postings", method: "POST", data: posting}).error(onError);
    },
    loadPosting: function(pid, onLoad, onError) {
      $http.get("/data/postings/" + pid).success(onLoad).error(onError);
    },
    loadComments: function(pid, onLoad, onError) {
      $http.get("/data/comments/" + pid).success(onLoad).error(onError);
    },
    createComment: function(pid, comment, onError) {
      $http({url: "/data/comments/" + pid, method: "POST", data: comment}).error(onError);
    },
    loadPostings: function(onLoad, onError, order, username, search) {
      $http.get("/data/postings?order=" + order + "&user=" + username + "&search=" + search).success(onLoad).error(onError);
    }
  };

});

angular.module("shreddit").factory("adminService", function($http) {

  var languages = [
    {name: "English", locale: "EN"},
    {name: "Deutsch", locale: "DE"}
  ];
  var username = undefined;

  return {

    login: function(user, password, onLogin, onError) {
      $http.post("data/login/" + user + "/" + password)
        .success(function(data, status, headers, config) {
          username = data.user;
          console.log("loggin=" + username);
          onLogin(data, status, headers, config);
        })
        .error(function(data, status, headers, config) {
          username = undefined;
          onError(data, status, headers, config);
        });
    },

    logout: function(onLogout, onError) {
      $http.post("data/logout/" + username).success(onLogout).error(onError);
      username = undefined;
    },

    saveSettings: function(userdata) {
      console.log("save user: " + userdata);
    },

    getUser: function() {
      return username;
    },

    isUser: function(user) {
      return (username !== undefined) && (user === username);
    },

    register: function(username, password, email) {
      var newUser = {
        "username": username,
        "password": password,
        "email": email,
        "since": "2014/09/09",
        "settings": {"locale": "EN", "notify": "true"}
      };
      console.log(JSON.stringify(newUser));
      //users.push(newUser);
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

/*
 angular.module("shreddit").factory("sessionServiceXXX", function() {

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
 var user = service.get User(username);
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
 */
angular.module("shreddit").factory("errorService", function() {

  var error = {code: 400, message: "Bad Request!"};

  return {
    getError: function() {
      return error;
    },
    setError: function(code, message) {
      error.code = code;
      error.message = message;
    }
  };
});

"use strict";

/**
 * This is the client-side javascript code for the SHREDDIT application.<br>
 * It contains:<br>
 *   <ul>
 *     <li>the (client-side) routing configuration</li>
 *     <li>the angular controllers</li>
 *     <li>the angular services</li>
 *     <li>some additional javascript helper-functions</li>
 *   </ul>
 */
angular.module("shreddit", ["ngRoute", "ngCookies", "ui.bootstrap"]);

// *************************************************************************
// ROUTING CONFIGURATION
// *************************************************************************
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

// *************************************************************************
// HELPER FUNCTIONS
// *************************************************************************

/**
 * Controls the visibility of the main- and posting-menu.
 *
 * @param visibleMenu if <code>true</code> the main-menu is visible.
 * @param visiblePostingsMenu if <code>true</code> the posting-menu is visible.
 */
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

/**
 * Controls the presentation of the language-button in the header.
 *
 * @param locale the active language (EN or DE).
 */
function selectLanguageLocale(locale) {
  var button = jQuery(".sc-language-button");
  button.removeClass("sc-language-button-checked");
  button.removeClass("sc-language-button-unchecked");
  if (locale === "DE") {
    jQuery("#si-language-de").addClass("sc-language-button-checked");
  } else {
    jQuery("#si-language-en").addClass("sc-language-button-checked");
  }
}

/**
 * Makes sure that the link of a posting has a content if the URL is set.
 *
 * @param posting the posting to correct.
 */
function correctLink(posting) {
  if ((!posting.link) && (posting.url)) {
    posting.link = posting.url;
  }
}

/**
 * Updates all the link-objects of passed posting(s).
 *
 * @param data a single posting or an array of postings.
 *
 * @returns the updated data.
 */
function onUpdateLink(data) {
  if (Array.isArray(data)) {
    for (var index = 0; index < data.length; ++index) {
      correctLink(data[index]);
    }
    return data;
  }
  if (data) {
    correctLink(data);
  }
  return data;
}

/**
 * Returns the posting with the <code>id</code> or <code>null</code> if none found.
 *
 * @param id the ID of the requested posting.
 * @param postings the array of postings.
 *
 * @returns the posting with the ID.
 */
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

// *************************************************************************
// CONTROLLERS
// *************************************************************************

/**
 * The error-controller provides the error-information for the error-view.
 *
 * @param $scope the scope of the controller.
 * @param $location for the navigation within the application.
 * @param errorService the data-service for this controller.
 */
angular.module("shreddit").controller("ErrorController",
  function($scope, $location, errorService) {

    function translate(error) {
      var e = {code: error.code};

      e.message = $scope.TXT.MESSAGE[error.message];
      if (!e.message) {
        e.message = error.message;
      }
      return e;
    }

    $scope.error = translate(errorService.getError());

    $scope.$on("onChangeLocaleComplete", function(event) {
      $scope.error = translate(errorService.getError());
    });

    $scope.home = function() {
      $location.path("/");
    };
  });

/**
 * The language-controller provides the locale-information.
 *
 * @param $scope the scope of the controller.
 * @param $rootScope for the broadcast messages.
 * @param adminService provides data about logged-in user.
 * @param languageService the data-service for this controller.
 */
angular.module("shreddit").controller("LanguageController",
  function($scope, $rootScope, adminService, languageService) {

    $scope.TXT = languageService.getText();
    selectLanguageLocale(languageService.getLocale());

    $scope.$on("onChangeLocale", function(event) {
      $scope.changeLanguage(adminService.getUserLocale());
    });

    $scope.isEN = function() {
      return languageService.getLocale() === "EN";
    };
    $scope.isDE = function() {
      return languageService.getLocale() === "DE";
    };

    $scope.changeLanguage = function(locale) {
      languageService.changeLanguage(locale);
      $scope.TXT = languageService.getText();
      selectLanguageLocale(locale);
      $rootScope.$broadcast("onChangeLocaleComplete");
    };
  });

/**
 * The session-controller provides the session-information for several views.
 *
 * @param $scope the scope of the controller.
 * @param $location for the navigation within the application.
 * @param $cookies provides access to the cookies.
 * @param $rootScope for the broadcast messages.
 * @param adminService the data-service for this controller.
 * @param errorService passing the error-information.
 */
angular.module("shreddit").controller("SessionController",
  function($scope, $location, $cookies, $rootScope, adminService, errorService) {

    $scope.user = {username: "", password: ""};
    $scope.currentSortOrder = "Filter";

    $scope.$on("$routeChangeStart", function(event, dest) {
      showMainMenu(dest.$$route.hiddenMenu !== true, dest.$$route.hiddenPostingsMenu !== true);
    });

    $scope.$on("onChangeLocaleComplete", function(event, dest) {
      updateSortOrderMenu($cookies["sss-sort-order"]);
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
      console.log("Logged in: " + JSON.stringify(data));
      $location.path("/postings");
      updateSortOrderMenu($cookies["sss-sort-order"]);
      $rootScope.$broadcast("onChangeLocale");
    };
    var onLogout = function(data, status, headers, config) {
      $location.path("/");
    };

    $scope.login = function() {
      if ($scope.loginForm.$valid) {
        adminService.login(angular.lowercase($scope.user.username), $scope.user.password, onLogin, onError);
      }
    };

    $scope.logout = function() {
      adminService.logout(onLogout, onError);
    };

    $scope.showShreddit = function() {
      if (adminService.isLoggedIn()) {
        $location.path("/postings");
      } else {
        $location.path("/");
      }
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

    function updateSortOrderMenu(order) {
      if (order === "TOP") {
        $scope.currentSortOrder = $scope.TXT.MENU.SORT_TOP_SHORT_LABEL;
      } else if (order === "MY") {
        $scope.currentSortOrder = $scope.TXT.MENU.SORT_MY_SHORT_LABEL;
      } else {
        $scope.currentSortOrder = $scope.TXT.MENU.SORT_LATEST_SHORT_LABEL;
      }
    }

    function setSortOrder(order) {
      $scope.user.sortOrder = order;
      updateSortOrderMenu(order);
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
 * The register-controller provides the information for the register-view.
 *
 * @param $scope the scope of the controller.
 * @param $location for the navigation within the application.
 * @param $rootScope for the broadcast messages.
 * @param adminService the data-service for this controller.
 * @param errorService passing the error-information.
 */
angular.module("shreddit").controller("RegisterController", function($scope, $location, $rootScope, adminService, errorService) {

  $scope.registerInfo = {};
  $scope.valid = { used: false, mismatch: false };

  var onCheckUser = function(data, status, headers, config) {
    console.log("check: " + JSON.stringify(data));
    if (angular.equals(angular.lowercase($scope.registerInfo.username),data.username)) {
      $scope.valid.used = data.exists;
    }
  };

  $scope.$on('$locationChangeStart', function(event) {
    if ($scope.registerForm.$dirty) {
      if (!confirm($scope.TXT.MESSAGE.UNSAVED_DATA)) {
        event.preventDefault();
      }
    }
  });

  $scope.isValidData = function() {
    if ($scope.valid.used === true) {
      return false;
    }
    if ($scope.valid.mismatch === true) {
      return false;
    }
    var info = $scope.registerInfo;
    if ((!info.username) || (info.username.length < 3)) {
      return false;
    }
    if (!info.email) {
      return false;
    }
    if ((!info.password) || (info.password.length < 6)) {
      return false;
    }
    if ((!info.password2) || (info.password2.length < 6)) {
      return false;
    }
    return true;
  };

  $scope.checkUsername = function() {
    var user = $scope.registerInfo.username;
    if ((!user) || (user.length < 3)) {
      $scope.valid.used = false;
    } else {
      adminService.checkUser(angular.lowercase(user), onCheckUser);
    }
  };
  $scope.checkPassword = function() {
    if ($scope.registerInfo.password2) {
      $scope.valid.mismatch = !angular.equals($scope.registerInfo.password, $scope.registerInfo.password2);
    } else {
      $scope.valid.mismatch = false;
    }
  };

  var onError = function(data, status, headers, config) {
    $scope.registerForm.$setPristine();
    errorService.setError(status, data);
    $location.path("/error");
  };

  var onLogin = function(data, status, headers, config) {
    console.log("Logged in: " + JSON.stringify(data));
    $rootScope.$broadcast("onChangeLocale");
    $location.path("/postings");
  };

  $scope.register = function() {
    var info = $scope.registerInfo;

    var onRegister = function(data, status, headers, config) {
      $scope.registerForm.$setPristine();
      adminService.login(angular.lowercase(info.username), info.password, onLogin, onError);
    };

    adminService.register(angular.lowercase(info.username), info.password, info.email, onRegister, onError)
  };
  $scope.close = function() {
    $location.path("/");
  };
});

/**
 * The settings-controller provides the information for the settings-view.
 *
 * @param $scope the scope of the controller.
 * @param $location for the navigation within the application.
 * @param $rootScope for the broadcast messages.
 * @param adminService the data-service for this controller.
 * @param errorService passing the error-information.
 */
angular.module("shreddit").controller("SettingsController", function($scope, $location, $rootScope, adminService, errorService) {

  $scope.languages = adminService.getLanguages();
  $scope.settings = {};

  (function(values) {
    var user = adminService.getUserData();
    values.username = user._id;
    values.language = adminService.getLanguage(user.locale);
    values.email = user.email;
    values.notify = user.notify === "true";
    console.log("init settings: " + JSON.stringify(values));
  }($scope.settings));

  $scope.$on('$locationChangeStart', function(event) {
    if ($scope.settingsForm.$dirty) {
      if (!confirm($scope.TXT.MESSAGE.UNSAVED_DATA)) {
        event.preventDefault();
      }
    }
  });

  var onError = function(data, status, headers, config) {
    $scope.settingsForm.$setPristine();
    errorService.setError(status, data);
    $location.path("/error");
  };

  var onUpdateUser = function(data, status, headers, config) {
    $scope.settingsForm.$setPristine();
    $rootScope.$broadcast("onChangeLocale");
    $scope.close();
  };

  $scope.save = function() {
    var user = adminService.getUserData();
    user.email = $scope.settings.email;
    user.locale = $scope.settings.language.locale;
    user.notify = $scope.settings.notify.toString();
    adminService.updateUser(user, onUpdateUser, onError);
  };
  $scope.close = function() {
    $location.path("/postings");
  };
});

/**
 * The new comment-controller provides the information for the new comment-view.
 *
 * @param $scope the scope of the controller.
 * @param $location for the navigation within the application.
 * @param $routeParams for accessing posting ID.
 * @param postingService provides access to the postings.
 * @param adminService the data-service for this controller.
 * @param errorService passing the error-information.
 */
angular.module("shreddit").controller("NewCommentController", function($scope, $location, $routeParams, postingService, adminService, errorService) {

  $scope.posting = {};
  $scope.comment = {"user": adminService.getUser()};

  $scope.$on('$locationChangeStart', function(event) {
    if ($scope.newCommentForm.$dirty) {
      if (!confirm($scope.TXT.MESSAGE.UNSAVED_DATA)) {
        event.preventDefault();
      }
    }
  });

  var onError = function(data, status, headers, config) {
    $scope.newCommentForm.$setPristine();
    errorService.setError(status, data);
    $location.path("/error");
  };
  var onLoadPosting = function(data, status, headers, config) {
    $scope.newCommentForm.$setPristine();
    $scope.posting = onUpdateLink(data);
  };

  postingService.loadPosting($routeParams.pid, onLoadPosting, onError);

  $scope.createComment = function(pid) {
    $scope.newCommentForm.$setPristine();
    postingService.createComment(pid, $scope.comment, onError);
    $location.path("/comments/" + pid);
  };
  $scope.close = function(pid) {
    $location.path("/comments/" + pid);
  };
});

/**
 * The comment-controller provides the information for the comment-view.
 *
 * @param $scope the scope of the controller.
 * @param $location for the navigation within the application.
 * @param $routeParams for accessing posting ID.
 * @param $timeout used to deliberately delay the result of the comments.
 * @param postingService provides access to the postings.
 * @param errorService passing the error-information.
 */
angular.module("shreddit").controller("CommentsController", function($scope, $location, $routeParams, $timeout, postingService, errorService) {

  $scope.posting = {};
  $scope.comments = [];
  $scope.loadingState = -1;

  var onError = function(data, status, headers, config) {
    errorService.setError(status, data);
    $location.path("/error");
  };
  var onLoadComments = function(data, status, headers, config) {
    // a fake timeout simulating a longer loading time
    $timeout(function() {
      $scope.comments = data;
      $scope.loadingState = $scope.comments.length;
    }, 555);
  };
  var onLoadPosting = function(data, status, headers, config) {
    $scope.posting = onUpdateLink(data);
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

/**
 * The new (posting)-controller provides the information for the new posting-view.
 *
 * @param $scope the scope of the controller.
 * @param $location for the navigation within the application.
 * @param postingService provides access to the postings.
 * @param adminService the data-service for this controller.
 * @param errorService passing the error-information.
 */
angular.module("shreddit").controller("NewController", function($scope, $location, postingService, adminService, errorService) {
  $scope.posting =
  {
    "title": "Morologie",
    "user": adminService.getUser(),
    "link": "Morologie",
    "url": "http://de.wikipedia.org/wiki/Morologie",
    "tags": "Wissenschaft",
    "content": "Die Wissenschaft von der Dummheit heisst Morologie."
  };

  $scope.$on('$locationChangeStart', function(event) {
    if ($scope.newForm.$dirty) {
      if (!confirm($scope.TXT.MESSAGE.UNSAVED_DATA)) {
        event.preventDefault();
      }
    }
  });

  var onError = function(data, status, headers, config) {
    $scope.newForm.$setPristine();
    errorService.setError(status, data);
    $location.path("/error");
  };

  $scope.clear = function() {
    $scope.posting = {"user": adminService.getUser()};
  };

  $scope.createPosting = function() {
    $scope.newForm.$setPristine();
    postingService.createPosting($scope.posting, onError);
    $location.path("/postings");
  };

  $scope.close = function() {
    $location.path("/postings");
  };
});

/**
 * The about-controller provides the information for the about-view.
 *
 * @param $scope the scope of the controller.
 * @param $location for the navigation within the application.
 */
angular.module("shreddit").controller("AboutController", function($scope, $location) {
  $scope.close = function() {
    $location.path("/postings");
  };
});

/**
 * The posting-controller provides the information for the posting-view.
 *
 * @param $scope the scope of the controller.
 * @param $location for the navigation within the application.
 * @param $cookies provides access to the cookies.
 * @param $rootScope for the broadcast messages.
 * @param $timeout used to deliberately delay the result of the postings.
 * @param postingService provides access to the postings.
 * @param adminService the data-service for this controller.
 * @param errorService passing the error-information.
 */
angular.module("shreddit").controller("PostingsController", function($scope, $location, $cookies, $rootScope, $timeout, postingService, adminService, errorService) {

  $scope.username = adminService.getUser();
  $scope.postings = [];
  $scope.loadingState = -1;

  jQuery("#si-rating-dialog").dialog({autoOpen: false,width: 300,modal: true,
    buttons: [{text: $scope.TXT.GENERAL.CLOSE,click: function() {jQuery(this).dialog("close");}}]});

  $scope.onSearch = function(key) {
    var field = jQuery("#si-search-term");
    if (key === 13) {
      $rootScope.$broadcast("onReloadPostings");
    } else if (key === 0) {
      var srch = field.val();
      if ((srch) && (srch.length > 0)) {
        field.val("");
        $rootScope.$broadcast("onReloadPostings");
      }
    }
    field.focus();
  };

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

      dlg.dialog({autoOpen: false, width: 300, modal: true,
        buttons: [{text: $scope.TXT.GENERAL.CLOSE,
            click: function() {
              jQuery(this).dialog("close");
            }
          }]
      });

      for (var rate = 0; rate <= 5; ++rate) {
        var stars = jQuery("#si-select-stars-" + rate);
        stars.unbind("click"); // remove possible previous listeners
        stars.bind("click", processRating(id, rate));
      }
      dlg.dialog("option", "title", $scope.TXT.POSTING.RATE + ": " + title);
      dlg.dialog("open");
      jQuery("#si-rating-dialog-title").html($scope.TXT.POSTING.RATE);
    }
  };

  var onError = function(data, status, headers, config) {
    $scope.loadingState = 0;
    errorService.setError(status, data);
    $location.path("/error");
  };
  var onLoad = function(data, status, headers, config) {
    // a fake timeout simulating a longer loading time
    $timeout(function() {
      $scope.postings = onUpdateLink(data);
      $scope.loadingState = $scope.postings.length;
      if ($scope.loadingState === 0) {
        jQuery("#si-add-new-posting").effect("highlight", {times: 5, easing: "easeOutQuart"}, 2500);
      }
    }, 1111);
  };
  var onReload = function(data, status, headers, config) {
    $scope.posting = [];
    $scope.loadingState = -1;
    postingService.loadPostings(onLoad, onError, $cookies["sss-sort-order"], adminService.getUser(), jQuery("#si-search-term").val());
  };

  postingService.loadPostings(onLoad, onError, $cookies["sss-sort-order"], adminService.getUser(), jQuery("#si-search-term").val());

  $scope.isUser = function(user) {
    return angular.equals(angular.lowercase(user), angular.lowercase(adminService.getUser()));
  };
  $scope.deletePosting = function(id) {
    postingService.deletePosting(id, onReload, onError);
  };
  $scope.showComments = function(id) {
    $location.path("/comments/" + id);
  };
  $scope.$on("onReloadPostings", function(event) {
    $scope.posting = [];
    $scope.loadingState = -1;
    postingService.loadPostings(onLoad, onError, $cookies["sss-sort-order"], adminService.getUser(), jQuery("#si-search-term").val());
  });
});

// *************************************************************************
// SERVICES
// *************************************************************************

/**
 * The posting-service provides functions for accessing the posting data.<br>
 *   <ul>
 *     <li>load all postings</li>
 *     <li>load a single posting</li>
 *     <li>create a posting</li>
 *     <li>delete a posting</li>
 *     <li>rate a posting</li>
 *     <li>load the comments of a posting</li>
 *     <li>create a comment for a posting</li>
 *   </ul>
 */
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

/**
 * The administration-service provides functions for accessing the user data.<br>
 *   <ul>
 *     <li>login and logout</li>
 *     <li>update the user-setting</li>
 *     <li>accessing: username, logged-in state, locale ...</li>
 *     <li>check whether an username already exists</li>
 *     <li>register a new user</li>
 *   </ul>
 */
angular.module("shreddit").factory("adminService", function($http) {

  var username = undefined;
  var userdata = null;

  return {

    login: function(user, password, onLogin, onError) {
      $http.post("data/login/" + user + "/" + password)
        .success(function(data, status, headers, config) {
          username = data._id;
          userdata = data;
          onLogin(data, status, headers, config);
        })
        .error(function(data, status, headers, config) {
          username = undefined;
          userdata = null;
          onError(data, status, headers, config);
        });
    },

    logout: function(onLogout, onError) {
      $http.post("data/logout/" + username).success(onLogout).error(onError);
      username = undefined;
      userdata = null;
    },

    updateUser: function(user, onUpdateUser, onError) {
      $http({url: "/data/settings/" + user._id, method: "PUT", data: user}).success(onUpdateUser).error(onError);
    },

    getUser: function() {
      return username;
    },

    getUserData: function() {
      return userdata;
    },

    getUserLocale: function() {
      return userdata === null ? "EN" : userdata.locale;
    },

    isUser: function(user) {
      return (username !== undefined) && (user === username);
    },

    isLoggedIn: function() {
      return username !== undefined;
    },

    checkUser: function(username, onCheckUser) {
      $http.get("data/check/" + username).success(onCheckUser).error(onCheckUser);

    },

    register: function(username, password, email, onRegister, onError) {
      var user = {
        "username": username,
        "password": password,
        "email": email
      };
      $http({url: "/data/register/", method: "POST", data: user}).success(onRegister).error(onError);
    }
  };
});

/**
 * The error-service provides functions for presenting an error to the user.<br>
 *   <ul>
 *     <li>set a (new) error</li>
 *     <li>get the current error</li>
 *   </ul>
 */
angular.module("shreddit").factory("errorService", function() {

  var error = {code: 400, message: "MSG_BAD_REQUEST"};

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

/**
 * The language-service provides functions for handling the resource-texts.<br>
 *   <ul>
 *     <li>handling the active locale</li>
 *     <li>provide the english and german resources</li>
 *   </ul>
 */
angular.module("shreddit").factory("languageService", function() {

  var languages = [
    {name: "English", locale: "EN"},
    {name: "Deutsch", locale: "DE"}
  ];

  var res = resource();
  var EN = res.getEN();
  var DE = res.getDE();

  var TXT = DE;
  var locale = "DE";

  return {

    getText: function() {
      return TXT;
    },

    getLocale: function() {
      return locale;
    },

    changeLanguage: function(language) {
      if (language === "DE") {
        TXT = DE;
        locale = "DE";
      } else {
        TXT = EN;
        locale = "EN";
      }
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

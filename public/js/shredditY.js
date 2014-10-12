var shredditApplication = angular.module('shreddit', ['ngCookies']);

shredditApplication.config(function($routeProvider) {
  $routeProvider.
          when('/', {controller: SessionController, templateUrl: 'login.html'}).
          when('/postings', {controller: PostingsController, templateUrl: 'postings.html'}).
          when('/new', {controller: NewController, templateUrl: 'new.html'}).
          when('/about', {controller: AboutController, templateUrl: 'about.html'}).
      when('/settings', {controller: SessionController, templateUrl: 'settings.html'}).
      when('/register', {controller: SessionController, templateUrl: 'register.html'}).
          when('/comments/:posting', {controller: CommentsController, templateUrl: 'comments.html'}).
          when('/newcomment/:posting', {controller: NewCommentController, templateUrl: 'new-comment.html'}).
          otherwise({redirectTo: '/'});
});

function showMainMenu(visible) {
  if (visible) {
    jQuery(".sc-show-if-loggedin").show();
  } else {
    jQuery(".sc-show-if-loggedin").hide();
  }
}

function selectSortOrder(order) {
  jQuery(".sc-sort-button").removeClass("sc-sort-button-checked");
  jQuery(".sc-sort-button").removeClass("sc-sort-button-unchecked");
  if (order === "TOP") {
    jQuery("#si-sort-order-top-rated").addClass("sc-sort-button-checked");
  } else if (order === "MY") {
    jQuery("#si-sort-order-my-postings").addClass("sc-sort-button-checked");
  } else {
    jQuery("#si-sort-order-latest").addClass("sc-sort-button-checked");
  }
}

(function() {
  var initialize;
  initialize = function() {
    //showMainMenu(false);
    //selectSortOrder(1);
  };
  jQuery(initialize);
}());

function SessionController($scope, $location, $routeParams, $cookieStore) {

  $scope.username = $cookieStore.get("S3username");
  $scope.password = $cookieStore.get("S3password");
  $scope.loggedin = $cookieStore.get("S3loggedin") === "true";
  $scope.sortOrder = $cookieStore.get("S3sortorder");

  $scope.isValidCred = function() {
    var flag = ($scope.username !== undefined) && ($scope.username.length > 2) && ($scope.password !== undefined) && ($scope.password.length > 5);
    console.log("valid=" + flag);
    return flag;
  };
  $scope.isInvalidCred = function() {
    var flag = ($scope.username === undefined) || ($scope.username.length <= 2) || ($scope.password === undefined) || ($scope.password.length <= 5);
    console.log("invalid=" + flag);
    return flag;
  };
  $scope.login = function() {
    if ($scope.isValidCred()) {
      $scope.loggedin = true;
      $cookieStore.put("S3username", $scope.username);
      $cookieStore.put("S3password", $scope.password);
      $cookieStore.put("S3loggedin", "true");
      $location.path('/postings');
    } else {
      $scope.loggedin = false;
      $cookieStore.remove("S3loggedin");
      $location.path('/');
    }
    console.log("login: username=<" + $scope.username + "> password=<" + $scope.password + "> (" + $scope.loggedin + ")");
    showMainMenu($scope.loggedin);
  };
  $scope.logout = function() {
    $scope.loggedin = false;
    $cookieStore.remove("S3loggedin");
    $location.path('/');
    showMainMenu(false);
    console.log("logout: username=<" + $scope.username + "> password=<" + $scope.password + "> (" + $scope.loggedin + ")");
  };
  $scope.showSettings = function() {
    $location.path('/settings');
  };
  $scope.showAbout = function() {
    $location.path('/about');
  };
  $scope.setSortOrderLatest = function() {
    $scope.sortOrder = "LATEST";
    selectSortOrder("LATEST");
    $cookieStore.put("S3sortorder", "LATEST");
    $location.path('/postings');
  };
  $scope.setSortOrderTopRated = function() {
    $scope.sortOrder = "TOP";
    selectSortOrder("TOP");
    $cookieStore.put("S3sortorder", "TOP");
    $location.path('/postings');
  };
  $scope.setSortOrderMyPostings = function() {
    $scope.sortOrder = "MY";
    selectSortOrder("MY");
    $cookieStore.put("S3sortorder", "MY");
    $location.path('/postings');
  };
  $scope.addNewPosting = function() {
    $location.path('/new');
  };
  $scope.close = function() {
    $location.path('/postings');
  };
}

function NewCommentController($scope, $location, $routeParams) {
  $scope.close = function() {
    $location.path('/postings');
  };
}

function CommentsController($scope, $location, $routeParams) {
  $scope.close = function() {
    $location.path('/postings');
  };
}

function NewController($scope, $location, $routeParams) {
  $scope.close = function() {
    $location.path('/postings');
  };
}

function AboutController($scope, $location, $routeParams) {
  $scope.close = function() {
    $location.path('/postings');
  };
}

function PostingsController($scope, $location, $routeParams) {
//    $scope.links = service.getLinks();
}

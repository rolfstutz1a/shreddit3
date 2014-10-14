
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

var indexById = function(array, id) {
  for (var index = 0; index < array.length; ++index) {
    if (array[index].id === id) {
      return index;
    }
  }
  return -1;
};

var sortOrderLatest = function(array) {
  array.sort(createCompareFunction("time", -1));
  return array;
};

var sortOrderTopRated = function(array) {
  array.sort(createCompareFunction("rating", -1));
  return array;
};

var sortOrderMyPostings = function(array, username) {
  var my = [];
  for (var index = 0; index < array.length; ++index) {
    if (array[index].user === username) {
      my.push(array[index]);
    }
  }
  my.sort(createCompareFunction("id", -1));
  return my;
};

exports.sortOrderLatest = sortOrderLatest;
exports.sortOrderTopRated = sortOrderTopRated;
exports.sortOrderMyPostings = sortOrderMyPostings;

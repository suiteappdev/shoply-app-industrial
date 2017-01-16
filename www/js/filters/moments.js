angular.module('starter').filter('now', function() {
  
  return function(input) {

    var output;

    output = window.moment(input).fromNow();

    return output;

  }

});
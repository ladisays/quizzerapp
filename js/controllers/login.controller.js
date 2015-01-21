var quizzerapp = angular.module('quizzerapp');

quizzerapp.controller('LoginCtrl', function ($scope, $http, $location, Auth) {
  $scope.login = function(){
    Auth.login($scope.email, $scope.password);
    // Auth.isLoggedIn = true;
  };
});
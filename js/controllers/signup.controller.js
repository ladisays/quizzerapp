var quizzerapp = angular.module('quizzerapp');

quizzerapp.controller('SignupCtrl', function ($scope, $http, $location, Auth) {
  $scope.signup = function() {
    Auth.signup($scope.firstName, $scope.lastName, $scope.email, $scope.password);
  };
});
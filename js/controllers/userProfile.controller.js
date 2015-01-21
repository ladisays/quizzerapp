var quizzerapp = angular.module('quizzerapp');

quizzerapp.controller('userProfile', function ($scope, $http, $location, $cookieStore, Questions) {
  if($cookieStore.get('userDetails') !== undefined) {
    // console.log($cookieStore.get('userDetails'));
    var user = $cookieStore.get('userDetails');
    $scope.firstName = parser(user.firstName);
    $scope.lastName = parser(user.lastName);
    $scope.email = user.email;

    $http.get('http://quizzerapi.herokuapp.com/profile/'+ user._id +'/tags')
    .success(function (tags) {
      $scope.tags = tags;
      // console.log($scope.tags);
    });

    // if($scope.tagList.value !== '') {
      // $http.get('http://quizzerapi.herokuapp.com/profile/'+ user._id +'/tags/' + $scope.tagList)
      // .success(function (questions) {
      //   console.log(questions);
      //   console.log($scope.tagList);
      // });
    // }
    
    $http({
      method  : 'GET',
      url     : 'http://quizzerapi.herokuapp.com/profile/' + user._id +'/questions'  
    })
    .success(function (questions) {
      // console.log(questions);
      if(questions !== []) {
        console.log('Here are your questions!');
        console.log(questions);
        $scope.questions = questions;
        return $scope.questions;
      }
    })
    .error(function (err) {
      console.log('There was an error retrieving your questions from the server!');
      console.log(err);
    });

    $scope.edit = function(id) {
      // Questions.findOne(id, user._id);
      $location.url('/profile/questions/' + id);
    };

    $scope.delete = function(id) {
      Questions.deleteOne(id, user._id);
    };
  }
  else {
    $location.url('/login');
  }
});
var quizzerapp = angular.module('quizzerapp');

quizzerapp.controller('QuestionsCtrl', function ($scope, $http, $location, $cookieStore, $routeParams, Questions) {
  if($cookieStore.get('userDetails') !== undefined) {
    var user = $cookieStore.get('userDetails');
    
    $scope.createOne = function() {
      var wrongOptions = [];
      wrongOptions.push($scope.w_option);
      wrongOptions.push($scope.w_option_1);
      wrongOptions.push($scope.w_option_2);

      Questions.createOne(user._id, $scope.tag, $scope.name, $scope.answer, wrongOptions);
    };

    if($routeParams.id) {

      $http({
        method  : 'GET',
        url     : 'http://localhost:8080/profile/' + user._id + '/questions/' + $routeParams.id,
        data    : $.param({
          _id: $routeParams.id,
          user_id: user._id
        }),  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function (question) {
        console.log('successfully retrieved a question.');
        console.log(question);
        $scope.tag = question.tag;
        $scope.name = question.name;
        $scope.answer = question.answer;
        $scope.w_option = question.wrongOptions[0];
        $scope.w_option_1 = question.wrongOptions[1];
        $scope.w_option_2 = question.wrongOptions[2];
      })
      .error(function (err) {
        console.log('There was an error with your request.');
        console.log(err);
      });

      // var question = Questions.findOne($routeParams.id, user._id);
      
    }

    $scope.update = function()  {
      // console.log($routeParams);
      var wrongOptions = [];
      wrongOptions.push($scope.w_option);
      wrongOptions.push($scope.w_option_1);
      wrongOptions.push($scope.w_option_2);

      Questions.updateOne($routeParams.id, user._id, $scope.tag, $scope.name, $scope.answer, wrongOptions);
    };

    $scope.delete = function() {
      Questions.deleteOne($routeParams.id, user._id);
    };
    // $scope.findOne();
  }
  else {
    $location.url('/login');
  }
});
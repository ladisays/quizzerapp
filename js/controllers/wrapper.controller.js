quizzerapp.controller('WrapperCtrl', function ($scope, $cookieStore, $location, Auth) {

  if($cookieStore.get('userDetails') !== undefined) {
    // console.log($cookieStore.get('userDetails'));
    var user = $cookieStore.get('userDetails');
    var user_id = user._id;
    $scope.firstName = parser(user.firstName);
    $scope.lastName = parser(user.lastName);
    $scope.email = user.email;

    $scope.isLoggedIn = true;
    console.log($scope.isLoggedIn);

    $scope.logout = function() {
      Auth.logout(user_id);
      $scope.isLoggedIn = false;
    };
  }

  else {
    $scope.isLoggedIn = false;
    console.log($scope.isLoggedIn);
    $location.url('/login');
  }
});
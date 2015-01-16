var quizzerapp = angular.module('quizzerapp', ['ngRoute', 'ngResource'])
.config(function($routeProvider, $locationProvider, $httpProvider) {
  
  var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
    // Initialize a new promise
    var deferred = $q.defer();

    // Make an AJAX call to check if the user is logged in
    $http.get('http://localhost:8080/loggedin').success(function(user){
      // Authenticated
      if (user !== '0') {
        $timeout(deferred.resolve, 0);
        console.log(user);
      }


      // Not Authenticated
      else {
        $rootScope.message = 'You need to log in.';
        $timeout(function(){deferred.reject();}, 0);
        console.log('Redirecting back to login');
        $location.url('/login');
      }
      console.log(user);
      // if(user === '0') {
      //   console.log('Not logged in');
      //   $timeout(function(){deferred.reject();}, 0);
      // }
      // else {
      //   $timeout(deferred.resolve, 0);
      //   console.log(user);
      // }
    });

    return deferred.promise;
  };

  // ================================================
  // Add an interceptor for AJAX errors
  // ================================================
  $httpProvider.interceptors.push(function($q, $location) {
    return function(promise) {
      return promise.then(
        // Success: just return the response
        function(response){
          return response;
        }, 
        // Error: check the error status to get only the 401
        function(response) {
          if (response.status === 401)
            $location.url('/login');
          return $q.reject(response);
        }
      );
    }
  });

  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: ''
  })
  .when('/signup', {
    templateUrl: 'views/signup.html',
    controller: ''
  })
  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  })
  .when('/profile', {
    templateUrl: 'views/view.profile.html',
    controller: 'userProfile',
    resolve: {
      loggedin: checkLoggedin
    }
  })
  .otherwise({
    redirectTo: '/'
  });

}); // end config

// .run(function($rootScope, $http) {
//   $rootScope.message = '';

//   // Logout function is available in any pages
//   $rootScope.logout = function(){
//     $rootScope.message = 'Logged out.';
//     $http.post('https://quizzerapp.herokuapp.com/logout');
//   };
// });


quizzerapp.controller('LoginCtrl', function ($scope, $http, $rootScope, $location) {
  $scope.login = function(){
    console.log($scope.email, $scope.password);
    $http({
      method  : 'POST',
      url     : 'http://localhost:8080/login',
      data    : $.param({email: $scope.email, password: $scope.password}),  
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
    })
    .success(function(user){
      // No error: authentication OK
      $rootScope.message = 'Authentication successful!';
      $location.url('/profile');
    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Authentication failed.';
      $location.url('/login');
    });
  };
});

quizzerapp.controller('userProfile', function ($scope, $http, $location) {
  $http('http://localhost:8080/profile')
  .success(function (user) {
    console.log(user);
    $scope.firstName = user.firstName;
    $scope.lastName = user.lastName;
    $scope.email = user.email;
  })
  .error(function(err) {
    console.log(err);
  });
});





















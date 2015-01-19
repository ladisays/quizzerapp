var quizzerapp = angular.module('quizzerapp', ['ngRoute', 'ngResource'])
.config(function($routeProvider, $locationProvider, $httpProvider) {

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
    controller: 'SignupCtrl'
  })
  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  })
  .when('/profile', {
    templateUrl: 'views/view.profile.html',
    controller: 'userProfile',
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



quizzerapp.controller('LoginCtrl', function ($scope, $http, $location, Auth) {
  $scope.login = function(){
    Auth.login();
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



quizzerapp.factory('Auth', ['$cookieStore', '$http', '$location', function ($cookieStore, $http, $location) {
  return {
    login: function(email, password) {
      $http({
        method  : 'POST',
        url     : 'http://localhost:8080/login',
        data    : $.param({
          email: email,
          password: password
        }),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function(user) {
        console.log('You have successfully logged in.');
        console.log(user);
        $cookieStore.put('userDetails', user);
      });
    },

    signup: function(firstName, lastName, email, password) {
      $http({
        method  : 'POST',
        url     : 'http://localhost:8080/signup',
        data    : $.param({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
        }),  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function (user) {
        console.log('You have successfully signed up!');
      })
      .error(function (err) {
        console.log('There was an error trying to communicate with the server');
      });
    },

    user: $cookieStore.get('userDetails')
  };
}]);


quizzerapp.factory('Questions', ['$http', 'Auth', function ($http, Auth) {
  return {
    createQuestion: function() {

    },

    getAllQuestions: function() {

    },

    findOneQuestion: function() {

    },

    deleteQuestion: function() {

    }
  }
}])



















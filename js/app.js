var quizzerapp = angular.module('quizzerapp', ['ngCookies', 'ngRoute', 'ngResource'])
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
  // .when('/', {
  //   templateUrl: 'views/main.html',
  //   controller: 'WrapperCtrl'
  // })
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
    controller: 'userProfile'
  })
  // .when('/profile/questions', {
  //   templateUrl: 'views/view.question.html',
  //   controller: 'QuestionsCtrl'
  // })
  .when('/profile/questions/add', {
    templateUrl: 'views/create.question.html',
    controller: 'QuestionsCtrl'
  })
  .when('/profile/questions/:id', {
    templateUrl: 'views/edit.question.html',
    controller: 'QuestionsCtrl'
  })
  .otherwise({
    redirectTo: '/login'
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

function parser(name) {
  var parsedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
  return parsedName;
}











































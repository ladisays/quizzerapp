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

    logout: function(id) {
      $http({
        method  : 'POST',
        url     : 'http://localhost:8080/logout',
        data    : $.param({_id: id}),  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function (res) {
        console.log('You have been successfully logged out!');
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
        console.log(user);
      })
      .error(function (err) {
        console.log('There was an error trying to communicate with the server');
      });
    },

    user: $cookieStore.get('userDetails')
  };
}]);


quizzerapp.factory('Questions', ['$http', '$location', 'Auth', function ($http, $location, Auth) {
  return {
    createOneQuestion: function(tag, name, answer, wrongOptions) {
      $http({
        method  : 'POST',
        url     : 'http://localhost:8080/profile/questions',
        data    : $.param({
          user_id: Auth.user._id,
          tag: tag,
          name: name,
          answer: answer,
          wrongOptions: wrongOptions
        }),  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function (question) {
        console.log('You have successfully created a question');
        console.log(question);
      })
      .error(function (err) {
        console.log('There was an error creating the question!');
        console.log(err);
      });
    },

    findAllQuestions: function() {
      $http({
        method  : 'GET',
        url     : 'http://localhost:8080/profile/questions',
        data    : $.param({user_id: Auth.user._id}),  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function (questions) {
        console.log('Here are your questions!');
        console.log(questions);
      })
      .error(function (err) {
        console.log('There was an error retrieving your questions from the server!');
        console.log(err);
      });
    },

    findOneQuestion: function(id) {
      $http({
        method  : 'GET',
        url     : 'http://localhost:8080/profile/questions/' + id,
        data    : $.param({
          _id: id,
          user_id: Auth.user._id
        }),  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function (question) {
        console.log('successfully retrieved a question.');
        console.log(question);
      })
      .error(function (err) {
        console.log('There was an error with your request.');
        console.log(err);
      });
    },

    updateOneQuestion: function () {
      $http({
        method  : 'PUT',
        url     : 'http://localhost:8080/profile/questions/:id',
        data    : $.param({
          _id: id,
          user_id: Auth.user._id
        }),  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function (question) {
        console.log('Successfully updated a question.');
        console.log(question);
      })
      .error(function (err) {
        console.log('There was an error with your request.');
        console.log(err);
      });
    },

    deleteOneQuestion: function() {
      $http({
        method  : 'DELETE',
        url     : 'http://localhost:8080/profile/questions/:id',
        data    : $.param({
          _id: id,
          user_id: Auth.user._id
        }),  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function (question) {
        console.log('Successfully deleted a question.');
        console.log(question);
      })
      .error(function (err) {
        console.log('There was an error with your request.');
        console.log(err);
      });
    }
  };
}]);



















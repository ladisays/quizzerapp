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
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'WrapperCtrl'
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

function parser(name) {
  var parsedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
  return parsedName;
}



quizzerapp.controller('WrapperCtrl', function ($scope, $cookieStore, Auth) {

  if($cookieStore.get('userDetails') !== undefined) {
    console.log($cookieStore.get('userDetails'));
    var user = $cookieStore.get('userDetails');
    var user_id = user._id;
    $scope.firstName = parser(user.firstName);
    $scope.lastName = parser(user.lastName);
    $scope.email = user.email;
    $scope.isLoggedIn = true;
    $scope.logout = function() {
      Auth.logout(user_id);
    }
  }

  else {
    $scope.isLoggedIn = false;
  }
});

quizzerapp.controller('LoginCtrl', function ($scope, $http, $location, Auth) {
  $scope.login = function(){
    Auth.login($scope.email, $scope.password);
  };
});


quizzerapp.controller('SignupCtrl', function ($scope, $http, $location, Auth) {
  $scope.signup = function() {
    Auth.signup($scope.firstName, $scope.lastName, $scope.email, $scope.password);
  };
})

quizzerapp.controller('userProfile', function ($scope, $http, $location, $cookieStore, Questions) {
  if($cookieStore.get('userDetails') !== undefined) {
    // console.log($cookieStore.get('userDetails'));
    var user = $cookieStore.get('userDetails');
    $scope.firstName = parser(user.firstName);
    $scope.lastName = parser(user.lastName);
    $scope.email = user.email;
    
    $http({
      method  : 'GET',
      url     : 'http://localhost:8080/profile/' + user._id +'/questions'  
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
})













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
        $location.url('/profile');
      })
      .error(function(error) {
        console.log('Authentication failed!');
        $location.url('/login');
      })
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
        $cookieStore.remove('userDetails');
        $location.path('/');
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
        $cookieStore.put('userDetails', user);
        $location.url('/profile');
      })
      .error(function (err) {
        console.log('There was an error trying to communicate with the server');
        $location.url('/signup');
      });
    },

    user: $cookieStore.get('userDetails')
  };
}]);


quizzerapp.factory('Questions', ['$http', '$location', 'Auth', function ($http, $location, Auth) {
  return {
    createOne: function(user_id, tag, name, answer, wrongOptions) {
      $http({
        method  : 'POST',
        url     : 'http://localhost:8080/profile/'+ user_id +'/questions',
        data    : $.param({
          user_id: user_id,
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
        $location.url('/profile');
      })
      .error(function (err) {
        console.log('There was an error creating the question!');
        console.log(err);
        $location.url('/profile/questions/add');
      });
    },

    findAll: function(id) {
      $http({
        method  : 'GET',
        url     : 'http://localhost:8080/profile/' + id +'/questions',
        data    : $.param({}),  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function (questions) {
        console.log('Here are your questions!');
        console.log(questions);
        return questions;
      })
      .error(function (err) {
        console.log('There was an error retrieving your questions from the server!');
        console.log(err);
      });
    },

    findOne: function(id, user_id) {
      $http({
        method  : 'GET',
        url     : 'http://localhost:8080/profile/' + user_id + '/questions/' + id,
        data    : $.param({
          _id: id,
          user_id: user_id
        }),  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function (question) {
        console.log('successfully retrieved a question.');
        console.log(question);
        return question;
      })
      .error(function (err) {
        console.log('There was an error with your request.');
        console.log(err);
      });
    },

    updateOne: function (id, user_id, tag, name, answer, wrongOptions) {
      $http({
        method  : 'PUT',
        url     : 'http://localhost:8080/profile/' + user_id + '/questions/' + id,
        data    : $.param({
          _id: id,
          user_id: user_id,
          tag: tag,
          name: name,
          answer: answer,
          wrongOptions: wrongOptions
        }),  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function (question) {
        console.log('Successfully updated a question.');
        // console.log(question);
        $location.url('/profile');
      })
      .error(function (err) {
        console.log('There was an error with your request.');
        console.log(err);
      });
    },

    deleteOne: function(id, user_id) {
      $http({
        method  : 'DELETE',
        url     : 'http://localhost:8080/profile/' + user_id + '/questions/' + id,
        data    : $.param({
          id: id,
          user_id: user_id
        }),  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function (question) {
        console.log('Successfully deleted a question.');
        console.log(question);
        $location.path('/profile');
      })
      .error(function (err) {
        console.log('There was an error with your request.');
        console.log(err);
      });
    }
  };
}]);



















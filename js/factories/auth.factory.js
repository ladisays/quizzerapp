var quizzerapp = angular.module('quizzerapp');

quizzerapp.factory('Auth', ['$cookieStore', '$http', '$location', function ($cookieStore, $http, $location) {
  return {
    isLoggedIn: true,
    login: function(email, password) {
      $http({
        method  : 'POST',
        url     : 'http://quizzerapi.herokuapp.com/login',
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
        $('#loginForm').jrumble({
          x: 20,
          y: 0,
          rotation: 0,
          speed: 20
        });
        console.log('Authentication failed!');
        // $location.url('/login');
        $('#loginForm').trigger('startRumble');
        setTimeout(function() {
          $('#loginForm').trigger('stopRumble');
        }, 500);
      });
    },

    logout: function(id) {
      $http({
        method  : 'POST',
        url     : 'http://quizzerapi.herokuapp.com/logout',
        data    : $.param({_id: id}),  
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      })
      .success(function (res) {
        console.log('You have been successfully logged out!');
        $cookieStore.remove('userDetails');
        $location.path('/login');
      });
    },

    signup: function(firstName, lastName, email, password) {
      $http({
        method  : 'POST',
        url     : 'http://quizzerapi.herokuapp.com/signup',
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

    user: $cookieStore.get('userDetails'),
  };
}]);

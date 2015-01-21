var quizzerapp = angular.module('quizzerapp');

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
'use strict';
angular.module('starter.controllers')
  .service('account', function ($q, constants, $http) {
  	return {
  		register : function(data){
            var async = $q.defer();

            $http.post(constants.base_url + 'user', data).success(function(data) {
                    async.resolve(data);
                }).error(function(status){
                    async.reject(status);
            });

            return async.promise;
  		},

  		login : function(data){
            var async = $q.defer();

            $http.post(constants.base_url + 'login', data).success(function(data) {
                    async.resolve(data);
                }).error(function(data, status){
                    async.reject({data:data , status : status});
            });

            return async.promise;
  		},

      password_reset : function(data){
          var async = $q.defer();

            $http.post(constants.base_url + 'password-reset/', data)
            .success(function(data, status, headers, config) {
                async.resolve(data);
                
              })
            .error(function(data, status, headers, config) {
                async.reject(status);
              });

          return async.promise;
      }
  	};
    // AngularJS will instantiate a singleton by calling "new" on this function
  });

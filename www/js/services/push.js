'use strict';

/**
 * @ngdoc service
 * @name shoplyApp.storage
 * @description
 * # storage
 * Service in the shoplyApp.
 */

 (function(){
	angular.module('starter.controllers')
	  .service('push', function ($q) {
		   return { register : function(){
	  	   		 	var async = $q.defer();

				    var push = PushNotification.init({
				          android: {
				              senderID: "871168760"
				          },
				          ios: {
				              alert: "true",
				              badge: "true",
				              sound: "true"
				          },
				          windows: {}
				    });

				    push.on('registration', function(data) {
				    	async.resolve(data);
				    });

				    push.on('notification', function(data) {
				          // data.message,
				          // data.title,
				          // data.count,
				          // data.sound,
				          // data.image,
				          // data.additionalData
				    });

				    push.on('error', function(e) {
				        async.reject(e);
				    });
		   }};
	  });

 })();
 
